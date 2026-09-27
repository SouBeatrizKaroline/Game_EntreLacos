import React from 'react';
import { X, Type, Eye, Volume2, Clock, Trash2 } from 'lucide-react';
import { AccessibilitySettings } from '../../types';

interface SettingsModalProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
  onResetGame: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetGame,
  onClose,
}) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-settings-title"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-xl border border-warm-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <h2 id="modal-settings-title" className="font-serif text-2xl font-bold text-navy">
            Configurações & Acessibilidade
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-warm-100 text-warm-600 hover:text-navy transition-colors"
            aria-label="Fechar configurações"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6 divide-y divide-warm-200">
          {/* 1. Tamanho de Fonte */}
          <div className="pt-4 first:pt-0 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-navy text-sm">
              <Type className="w-4 h-4 text-terracotta" />
              <span>Tamanho do Texto</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'normal', 'large', 'extra-large'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                    settings.fontSize === size
                      ? 'bg-terracotta text-white border-terracotta shadow-sm'
                      : 'bg-warm-50 hover:bg-warm-100 text-navy border-warm-200'
                  }`}
                >
                  {size === 'sm'
                    ? 'Pequeno'
                    : size === 'normal'
                    ? 'Padrão'
                    : size === 'large'
                    ? 'Grande'
                    : 'Máximo'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Alto Contraste */}
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-semibold text-navy text-sm">
                <Eye className="w-4 h-4 text-terracotta" />
                <span>Modo Alto Contraste</span>
              </div>
              <p className="text-xs text-warm-600">
                Fundo preto com texto em branco puro e realces amarelos (WCAG AAA).
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.highContrast ? 'bg-terracotta' : 'bg-warm-300'
              }`}
              role="switch"
              aria-label="Modo Alto Contraste"
              aria-checked={settings.highContrast}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3. Velocidade de Texto */}
          <div className="pt-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-navy text-sm">
              <Clock className="w-4 h-4 text-terracotta" />
              <span>Velocidade de Exibição dos Diálogos</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['slow', 'normal', 'instant'] as const).map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdateSettings({ textSpeed: speed })}
                  className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                    settings.textSpeed === speed
                      ? 'bg-terracotta text-white border-terracotta shadow-sm'
                      : 'bg-warm-50 hover:bg-warm-100 text-navy border-warm-200'
                  }`}
                >
                  {speed === 'slow' ? 'Tranquilo' : speed === 'normal' ? 'Normal' : 'Instantâneo'}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Indicadores Visuais de Som */}
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 font-semibold text-navy text-sm">
                <Volume2 className="w-4 h-4 text-terracotta" />
                <span>Legendas e Indicadores Sonoros</span>
              </div>
              <p className="text-xs text-warm-600">
                Exibe tags visuais descritivas para efeitos de som e portas batendo.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ soundIndicators: !settings.soundIndicators })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundIndicators ? 'bg-terracotta' : 'bg-warm-300'
              }`}
              role="switch"
              aria-label="Legendas e Indicadores Sonoros"
              aria-checked={settings.soundIndicators}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.soundIndicators ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 5. Redução de Movimento */}
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-navy text-sm block">Reduzir Animações</span>
              <p className="text-xs text-warm-600">
                Desativa transições bruscas e efeitos de movimento na tela.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ reducedMotion: !settings.reducedMotion })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.reducedMotion ? 'bg-terracotta' : 'bg-warm-300'
              }`}
              role="switch"
              aria-label="Reduzir Animações"
              aria-checked={settings.reducedMotion}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 6. Fonte Amigável para Dislexia */}
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-navy text-sm block">
                Tipografia para Dislexia
              </span>
              <p className="text-xs text-warm-600">
                Aumenta o espaçamento entre palavras e caracteres para facilitar a leitura.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({ dyslexicFont: !settings.dyslexicFont })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.dyslexicFont ? 'bg-terracotta' : 'bg-warm-300'
              }`}
              role="switch"
              aria-label="Tipografia para Dislexia"
              aria-checked={settings.dyslexicFont}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  settings.dyslexicFont ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 7. Gerenciamento de Dados Locais */}
          <div className="pt-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-semibold text-navy text-sm block">
                Excluir Progresso Local
              </span>
              <p className="text-xs text-warm-600">
                Limpa todos os dados salvos no navegador e reinicia o jogo do zero.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Tem certeza de que deseja apagar todo o progresso local?')) {
                  onResetGame();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar dados</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-navy hover:bg-navy-dark text-white font-medium text-sm transition-colors"
          >
            Salvar e fechar
          </button>
        </div>
      </div>
    </div>
  );
};
