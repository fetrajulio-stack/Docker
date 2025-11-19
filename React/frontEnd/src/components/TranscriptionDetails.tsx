import React, { useState } from 'react';
import { User, Phone, Clock, Tag, FileText, Building, Users, UserCheck, MessageSquare, CheckSquare } from 'lucide-react';
import { useTranscriptions } from '../contexts/TranscriptionContext';

export interface Transcription {
  id: string | number;
  notes?: string;
  messageLeft?: boolean;
  priority?: 'urgent' | 'important' | 'normal' | string;
  status?: 'a-traiter' | 'en-attente' | 'en-cours' | 'traite' | string;
  motif?: string;
  callerName?: string;
  callerPhone?: string;
  timestamp: string | number | Date;
  duration?: string;
  callCount?: number;
  structure?: string;
  service?: string;
  intervenant?: string;
  assignedTo?: string;
  content?: string;
  patientFileLink?: string;
  handledBy?: string;
  followUpAssignedTo?: string;
}

interface TranscriptionDetailsProps {
  transcription: Transcription | null;
  onClose?: () => void;
}

export function TranscriptionDetails({ transcription, onClose }: TranscriptionDetailsProps) {
  const { updateTranscription } = useTranscriptions();
  const [notes, setNotes] = useState<string>(transcription?.notes || '');
  const [messageLeft, setMessageLeft] = useState<boolean>(transcription?.messageLeft || false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  if (!transcription) {
    return (
      <div className="p-8 text-gray-500 text-center">
        <p>Aucune transcription sélectionnée.</p>
      </div>
    );
  }

  const getPriorityColor = (priority?: string): string => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'important':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'normal':
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getStatusColor = (status?: string): string => {
    switch (status) {
      case 'a-traiter':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'en-attente':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'en-cours':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'traite':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getMotifLabel = (motif?: string): string => {
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

    return motif ? motifs[motif] || motif : '';
  };

  const getStatusLabel = (status?: string): string => {
    const statuses: Record<string, string> = {
      'a-traiter': 'À traiter',
      'en-attente': 'En attente',
      'en-cours': 'En cours',
      'traite': 'Traité'
    };

    return status ? statuses[status] || status : '';
  };

  const handleSaveNotes = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTranscription(transcription.id, {
        notes,
        messageLeft
      });
    } catch (error) {
      console.error('Failed to update notes:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await updateTranscription(transcription.id, {
        status: newStatus
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl mx-auto p-8 border border-gray-200 max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Détails de la transcription</h2>
        <div className="flex items-center space-x-3">
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPriorityColor(
              transcription.priority
            )}`}
          >
            {transcription.priority?.toUpperCase()}
          </span>
          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
              transcription.status
            )}`}
          >
            {getStatusLabel(transcription.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Basic Info */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de l'appelant</h3>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{transcription.callerName || '-'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">{transcription.callerPhone || '-'}</span>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-medium">
                  {new Date(transcription.timestamp).toLocaleString('fr-FR')}
                </span>
              </div>

              {transcription.duration && (
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">Durée: {transcription.duration}</span>
                </div>
              )}

              {transcription.callCount && transcription.callCount > 1 && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">Nombre d'appels: {transcription.callCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Classification */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Classification</h3>

            <div className="space-y-4">
              {transcription.motif && (
                <div className="flex items-center space-x-3">
                  <Tag className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-900 font-medium">Motif: {getMotifLabel(transcription.motif)}</span>
                </div>
              )}

              {transcription.structure && (
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-900 font-medium">Structure: {transcription.structure}</span>
                </div>
              )}

              {transcription.service && (
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-900 font-medium">Service: {transcription.service}</span>
                </div>
              )}

              {transcription.intervenant && (
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-900 font-medium">Intervenant: {transcription.intervenant}</span>
                </div>
              )}

              {transcription.assignedTo && (
                <div className="flex items-center space-x-3">
                  <UserCheck className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-900 font-medium">Assigné à: {transcription.assignedTo}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Content and Actions */}
        <div className="space-y-6">
          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contenu de l'appel</h3>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {transcription.content}
              </p>
            </div>
          </div>

          {/* Status Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleStatusChange('en-attente')}
                disabled={isUpdating || transcription.status === 'en-attente'}
                className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                En attente
              </button>
              <button
                onClick={() => handleStatusChange('en-cours')}
                disabled={isUpdating || transcription.status === 'en-cours'}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                En cours
              </button>
              <button
                onClick={() => handleStatusChange('traite')}
                disabled={isUpdating || transcription.status === 'traite'}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Traité
              </button>
              <button
                onClick={() => handleStatusChange('a-traiter')}
                disabled={isUpdating || transcription.status === 'a-traiter'}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                À traiter
              </button>
            </div>
          </div>

          {/* Message Left Checkbox */}
          <div className="bg-green-50 rounded-xl p-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={messageLeft}
                onChange={(e) => {
                  setMessageLeft(e.target.checked);
                  // Auto-save when checkbox changes
                  setTimeout(() => handleSaveNotes(), 100);
                }}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-gray-900 font-medium">Message laissé au patient</span>
            </label>
            <p className="text-sm text-gray-600 mt-2 ml-8">
              Cocher cette case marquera automatiquement la transcription comme "Traité"
            </p>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notes</h3>
            <div className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajouter des notes..."
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    <span>Sauvegarder les notes</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Patient File Link */}
          {transcription.patientFileLink && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Dossier patient</h3>
              <a
                href={transcription.patientFileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Ouvrir le dossier patient</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {(transcription.handledBy || transcription.followUpAssignedTo) && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            {transcription.handledBy && (
              <div>
                <span className="font-medium">Pris en charge par:</span> {transcription.handledBy}
              </div>
            )}
            {transcription.followUpAssignedTo && (
              <div>
                <span className="font-medium">Suivi assigné à:</span> {transcription.followUpAssignedTo}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}