import React, { useState } from 'react';
import { TranscriptionCard } from './TranscriptionCard';

type Transcription = {
  id: string | number;
  status: string;
  [key: string]: any;
};

type KanbanUrgentProps = {
  title: string;
  status: string;
  color: string;
  count: number;
  transcriptions: Transcription[];
};

export function KanbanUrgent({ title, status, color, count, transcriptions }: KanbanUrgentProps) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    // Drop handling is managed in TranscriptionCard
  };

  return (
    <div className="flex flex-col w-full ">
      {/* Column Header */}
      <div
        className={`p-4 rounded-t-lg border-2 ${color} ${isDragOver ? 'border-blue-500 bg-blue-100' : ''
          }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
            {count}
          </span>
        </div>
      </div>

      {/* Horizontal cards container */}
      <div
        className={`flex p-4 border-2 border-t-0 rounded-b-lg ${color} ${isDragOver ? 'border-blue-500 bg-blue-100' : ''
          } overflow-x-auto`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ minHeight: '200px' }} // adjust as needed
      >
        {transcriptions.length === 0 ? (
          <div className="flex items-center justify-center w-full text-gray-500">
            <p className="text-sm">No transcriptions</p>
          </div>
        ) : (
          <div className="flex space-x-4">
            {transcriptions.map((transcription) => (
              <TranscriptionCard
                key={transcription.id}
                transcription={transcription}
                targetStatus={status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
