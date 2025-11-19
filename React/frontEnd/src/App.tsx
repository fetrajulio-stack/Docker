import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import logo from './assets/logo.png';
import { KanbanBoard } from './components/KanbanBoard';
import { LoginPage } from './components/LoginPage';
import { TranscriptionProvider } from './contexts/TranscriptionContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, user, login, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const disabledMenu = (libelle :string) =>{
     
    const hasPermission = user?.roles?.features?.some(
      (feature) => feature.libelle === libelle
    )
    return !hasPermission;
  }

  console.log(user)
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="h-8 w-auto" />
            </div>

            <div className="flex items-center space-x-4">
              {/* Menu principal */}
              <nav className="flex items-end space-x-6">
                <button disabled={disabledMenu("Transcription")} className="disabled:bg-slate-50
                  disabled:text-slate-400
                  disabled:cursor-not-allowed
                  disabled:border-slate-200 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Transcription
                </button>
                <button disabled={disabledMenu("Gestion Utilisateur")}
                className="disabled:bg-slate-50
                disabled:text-slate-400
                disabled:cursor-not-allowed
                disabled:border-slate-200 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Gestion utilisateur
                </button>
              </nav>

              {/* User Menu */}
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.nom}</span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filtre déplacé en bas du header */}
          <div className="mt-8 flex items-center space-x-4 justify-center">
            <div className="relative flex-1 max-w-xl">
              <input
                type="text"
                placeholder="Search transcriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
                />
              </svg>
            </div>

            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <span>Filter</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <KanbanBoard searchTerm={searchTerm} />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TranscriptionProvider>
        <AppContent />
      </TranscriptionProvider>
    </AuthProvider>
  );
};

export default App;
