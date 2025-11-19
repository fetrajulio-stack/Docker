import React, { useState } from 'react';
import { Transcription, TranscriptionCard } from './TranscriptionCard';


type KanbanColumnProps = {
  title: string;
  status: string;
  color: string;
  count: number;
  transcriptions: Transcription[];
};

export function KanbanColumn({ title, status, color, count, transcriptions }: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
    console.log("over")
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    // The drop handling is managed in TranscriptionCard
  };

  return (
    <div className="flex flex-col h-full">
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

      {/* Column Content with scrollbar */}
      <div
        className={`flex-1 p-4 border-2 border-t-0 rounded-b-lg ${color} ${isDragOver ? 'border-blue-500 bg-blue-100' : ''
          } overflow-y-auto`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{ maxHeight: '600px' }} // you can tweak or make it full h-screen if needed
      >
        <div className="space-y-4">
          {transcriptions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No transcriptions</p>
            </div>
          ) : (
            transcriptions.map((transcription) => (
              <TranscriptionCard
                key={transcription.id}
                transcription={transcription}
                targetStatus={status}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
