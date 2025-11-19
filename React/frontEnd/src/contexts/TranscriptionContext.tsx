import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '../services/api';

type Transcription = {
  id: string | number;
  status: string;
  [key: string]: any;
};

export type TranscriptionContextType = {
  transcriptions: Transcription[];
  loading: boolean;
  error: string | null;
  moveTranscription: (id: string | number, newStatus: string, updates?: Partial<Transcription>) => Promise<void>;
  updateTranscription: (id: string | number, updates: Partial<Transcription>) => Promise<void>;
  createTranscription: (transcriptionData: Partial<Transcription>) => Promise<Transcription>;
  refreshTranscriptions: () => Promise<void>;
};

type TranscriptionProviderProps = {
  children: ReactNode;
};

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

export function TranscriptionProvider({ children }: TranscriptionProviderProps) {
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load transcriptions from API
  const loadTranscriptions = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTranscriptions();
      console.log(data);
      
      setTranscriptions(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load transcriptions:', err);
      setError('Failed to load transcriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTranscriptions();
  }, []);

  const moveTranscription = async (id: string | number, newStatus: string, updates: Partial<Transcription> = {}) => {
    try {
      const updatedTranscription = await apiService.updateTranscriptionStatus(id, {
        status: newStatus,
        ...updates
      });

      setTranscriptions(prev =>
        prev.map(transcription =>
          transcription.id === id
            ? updatedTranscription
            : transcription
        )
      );

      loadTranscriptions()
    } catch (err) {
      console.error('Failed to update transcription:', err);
      // Fallback to local update
      setTranscriptions(prev =>
        prev.map(transcription =>
          transcription.id === id
            ? { ...transcription, status: newStatus, ...updates }
            : transcription
        )
      );
    }
  };

  const updateTranscription = async (id: string | number, updates: Partial<Transcription>) => {
    try {
      const updatedTranscription = await apiService.updateTranscriptionStatus(id, updates);

      setTranscriptions(prev =>
        prev.map(transcription =>
          transcription.id === id
            ? updatedTranscription
            : transcription
        )
      );
    } catch (err) {
      console.error('Failed to update transcription:', err);
      // Fallback to local update
      setTranscriptions(prev =>
        prev.map(transcription =>
          transcription.id === id
            ? { ...transcription, ...updates }
            : transcription
        )
      );
    }
  };

  const createTranscription = async (transcriptionData: Partial<Transcription>): Promise<Transcription> => {
    try {
      const newTranscription = await apiService.createTranscription(transcriptionData);
      setTranscriptions(prev => [newTranscription, ...prev]);
      return newTranscription;
    } catch (err) {
      console.error('Failed to create transcription:', err);
      throw err;
    }
  };

  return (
    <TranscriptionContext.Provider value={{
      transcriptions,
      loading,
      error,
      moveTranscription,
      updateTranscription,
      createTranscription,
      refreshTranscriptions: loadTranscriptions,
    }}>
      {children}
    </TranscriptionContext.Provider>
  );
}

export function useTranscriptions(): TranscriptionContextType {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error('useTranscriptions must be used within a TranscriptionProvider');
  }
  return context;
}

