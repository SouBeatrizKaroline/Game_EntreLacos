import React from 'react';
import { Shield, Settings, History, Terminal, Home } from 'lucide-react';
import { Perspective } from '../../types';

interface HeaderProps {
  perspective?: Perspective;
  currentLocation?: string;
  onOpenSafety: () => void;
  onOpenSettings: () => void;
  onOpenHistory?: () => void;
  onToggleDebug: () => void;
  onGoHome?: () => void;
  showInGameControls?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  perspective,
  currentLocation,
  onOpenSafety,
  onOpenSettings,
  onOpenHistory,
  onToggleDebug,
  onGoHome,
  showInGameControls = false,
}) => {
  const getPerspectiveBadge = () => {
    switch (perspective) {
      case 'caregiver':
        return {
          label: 'Perspectiva: Alex (Cuidador)',
          bg: 'bg-terracotta/10 text-terracotta-dark border-terracotta/30',
        };
      case 'child':
        return {
          label: 'Perspectiva: Lia (13 anos)',
          bg: 'bg-sage/15 text-sage-dark border-sage/40',
        };
      case 'echo_past':
        return {
          label: 'Eco do Passado: Alex (1996)',
          bg: 'bg-amber-900/15 text-amber-900 border-amber-800/40',
        };
      default:
        return null;
    }
  };

  const badge = getPerspectiveBadge();

  return (
    <header className="w-full bg-warm-100/90 backdrop-blur border-b border-warm-200 px-4 py-3 sticky top-0 z-30 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Logo / Título */}
        <div className="flex items-center gap-3">
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="p-1.5 rounded-lg hover:bg-warm-200 text-navy/80 hover:text-navy transition-colors focus:ring-2 focus:ring-terracotta"
              title="Ir para o Menu Principal"
              aria-label="Voltar para a tela inicial"
            >
              <Home className="w-5 h-5" />
            </button>
          )}
          <div>
            <span className="font-serif font-bold text-lg tracking-tight text-navy">
              ENTRE LAÇOS
            </span>
            {currentLocation && (
              <span className="hidden sm:inline-block ml-3 text-xs px-2.5 py-0.5 rounded-full bg-warm-200/80 text-warm-800 font-medium">
                {currentLocation}
              </span>
            )}
          </div>
        </div>

        {/* Badge de Perspectiva (quando em jogo) */}
        {showInGameControls && badge && (
          <div
            className={`text-xs px-3 py-1 rounded-full border font-medium transition-all ${badge.bg}`}
            role="status"
            aria-live="polite"
          >
            {badge.label}
          </div>
        )}

        {/* Ações e Salvaguardas */}
        <div className="flex items-center gap-2">
          {/* Botão Preciso de Ajuda (Salvaguarda prioritária e discreta) */}
          <button
            onClick={onOpenSafety}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition-colors shadow-sm"
            aria-label="Abrir central de ajuda e canais de proteção"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Preciso de ajuda</span>
          </button>

          {showInGameControls && onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="p-2 rounded-lg hover:bg-warm-200 text-navy/70 hover:text-navy transition-colors"
              title="Ver histórico recente de diálogos"
              aria-label="Abrir histórico de falas"
            >
              <History className="w-4 h-4" />
            </button>
          )}

          {/* Configurações & Acessibilidade */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-warm-200 text-navy/70 hover:text-navy transition-colors"
            title="Acessibilidade e Configurações"
            aria-label="Abrir opções de acessibilidade e configurações"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Narrative Debug Panel Toggle (Modo DEV) */}
          {import.meta.env.DEV && <button
            onClick={onToggleDebug}
            className="p-2 rounded-lg hover:bg-warm-200 text-navy/50 hover:text-navy transition-colors"
            title="Painel de Debug Narrativo"
            aria-label="Alternar painel de testes narrativos"
          >
            <Terminal className="w-4 h-4" />
          </button>}
        </div>
      </div>
    </header>
  );
};
