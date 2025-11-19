import React, { useState } from 'react';
import { Clock, User, Phone } from 'lucide-react';
import { useTranscriptions } from '../contexts/TranscriptionContext';
import { TranscriptionDetails } from './TranscriptionDetails';

// Définition du type Transcriptiond
export interface Transcription {
  id: string;
  callerName: string;
  callerPhone: string;
  content: string;
  priority: 'urgence' | 'important' | 'normal';
  motif?: string;
  timestamp: string | number | Date;
  duration?: string;
  callCount: number;
  assignedTo?: string;
}

// Props du composant
interface TranscriptionCardProps {
  transcription: Transcription;
  targetStatus: string;
}

export function TranscriptionCard({ transcription, targetStatus }: TranscriptionCardProps) {
  const { moveTranscription } = useTranscriptions();
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false); // <-- state to show modal

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', transcription.id);
    e.dataTransfer.setData('application/json', JSON.stringify(transcription));
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    console.log(draggedId);
    console.log(targetStatus);
    if (draggedId !== transcription.id) {
      moveTranscription(draggedId, targetStatus);
    }
  };

  const getPriorityBadge = (priority: Transcription['priority']) => {
    switch (priority) {
      case 'urgence':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'important':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getPriorityText = (priority: Transcription['priority']) => {
    switch (priority) {
      case 'urgence':
        return 'Urgence';
      case 'important':
        return 'Important';
      case 'normal':
      default:
        return 'Normal';
    }
  };

  const getMotifLabel = (motif: string) => {
    const motifs: Record<string, string> = {
      'nouveau-rdv': 'Nouveau RDV',
      'modification-rdv': 'Modification RDV',
      'annulation-rdv': 'Annulation RDV',
      'question': 'Question',
      'urgence': 'Urgence',
      'retard': 'Retard',
      'preaccueil': 'Pré-accueil',
      'autre': 'Autre'
    };

    return motifs[motif] || motif;
  };

  const formatTime = (date: string | number | Date) => {
    const d = new Date(date); // Convert string/timestamp to Date
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };


  const formatDate = (date: string | number | Date) => {
    const d = new Date(date); // Convert to Date object
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };


  return (
    <>
      {/* Card */}
      <div
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        onClick={() => setShowDetails(true)} // <-- show details on click
        className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${isDragging ? 'opacity-50 rotate-2 scale-95' : ''
          }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="font-medium text-gray-900 truncate">{transcription.callerName}</span>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityBadge(
              transcription.priority
            )}`}
          >
            {getPriorityText(transcription.priority)}
          </span>
        </div>

        {/* Motif */}
        {transcription.motif && (
          <div className="flex items-center space-x-2 mb-2 text-xs text-gray-500">
            <span className="px-2 py-1 bg-gray-100 rounded-full">
              {getMotifLabel(transcription.motif)}
            </span>
          </div>
        )}

        {/* Phone */}
        <div className="flex items-center space-x-2 mb-3 text-sm text-gray-600">
          <Phone className="h-3 w-3" />
          <span>{transcription.callerPhone}</span>
        </div>

        {/* Content */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
          {transcription.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(transcription.timestamp)} {formatTime(transcription.timestamp)}</span>
            </div>
            {transcription.duration && <span>Durée: {transcription.duration}</span>}
            {transcription.callCount > 1 && <span>Appels: {transcription.callCount}</span>}
          </div>
        </div>

        {/* Assigned Agent */}
        {transcription.assignedTo && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-gray-600">Assigné à {transcription.assignedTo}</span>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-5xl w-full max-h-[90vh] overflow-hidden relative">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            >
              ✕
            </button>
            <TranscriptionDetails
              transcription={transcription}
              onClose={() => setShowDetails(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}