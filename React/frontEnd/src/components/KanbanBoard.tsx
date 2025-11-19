import React from 'react';
import { KanbanColumn } from './KanbanColumn';
import { KanbanUrgent } from './KanbanUrgent';
import { useTranscriptions } from '../contexts/TranscriptionContext';


type KanbanBoardProps = {
  searchTerm: string;
};


export function KanbanBoard({ searchTerm }: KanbanBoardProps) {
  const { transcriptions, loading, error } = useTranscriptions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Chargement des transcriptions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erreur de chargement</p>
          <p className="text-gray-500 text-sm">Utilisation des données de démonstration</p>
        </div>
      </div>
    );
  }

  const filteredTranscriptions = transcriptions.filter(transcription =>
    transcription.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transcription.callerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transcription.callerPhone.includes(searchTerm)
  );

  // Separate urgent transcriptions
  const urgentTranscriptions = filteredTranscriptions.filter(t => t.priority === 'urgence');

  // Non-urgent columns
  const columns = [
    {
      id: 'a-traiter',
      title: 'À traiter',
      status: 'a-traiter',
      color: 'bg-gray-100 border-gray-300',
      count: filteredTranscriptions.filter(t => t.status === 'a-traiter').length,
    },
    {
      id: 'en-attente',
      title: 'En attente',
      status: 'en-attente',
      color: 'bg-yellow-50 border-yellow-300',
      count: filteredTranscriptions.filter(t => t.status === 'en-attente').length,
    },
    {
      id: 'en-cours',
      title: 'En cours',
      status: 'en-cours',
      color: 'bg-blue-50 border-blue-300',
      count: filteredTranscriptions.filter(t => t.status === 'en-cours').length,
    },
    {
      id: 'traite',
      title: 'Traité',
      status: 'traite',
      color: 'bg-green-50 border-green-300',
      count: filteredTranscriptions.filter(t => t.status === 'traite').length,
    },
  ];

  return (
    <div className="space-y-6 h-full">
      {/* Top horizontal urgent row */}
      {urgentTranscriptions.length > 0 && (
        <KanbanUrgent
          title="Urgent"
          status="urgent"
          color="border-red-500"
          count={urgentTranscriptions.length}
          transcriptions={urgentTranscriptions}
        />
      )}

      {/* Regular columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
        {columns.map(column => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            status={column.status}
            color={column.color}
            count={column.count}
            transcriptions={filteredTranscriptions.filter(
              t => t.status === column.status && t.priority !== 'urgent'
            )}
          />
        ))}
      </div>
    </div>
  );
}
