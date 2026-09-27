import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Sparkles, BookOpen, AlertCircle, HeartHandshake } from 'lucide-react';
import { SceneNode, GameState, SceneChoice } from '../../types';
import { getBehavioralCues } from '../../engine/relationshipManager';
import { evaluateCondition } from '../../engine/conditionEvaluator';

interface GameScreenProps {
  scene: SceneNode;
  state: GameState;
  onMakeChoice: (choice: SceneChoice) => void;
  onOpenEducationalCard: (cardId: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  scene,
  state,
  onMakeChoice,
  onOpenEducationalCard,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setInterval>>();

  // Efeito de digitação com controle de velocidade de acessibilidade
  useEffect(() => {
    const fullText = scene.dialogue || '';
    if (state.accessibility.textSpeed === 'instant' || state.accessibility.reducedMotion || !fullText) {
      setDisplayedText(fullText);
      setIsTypingComplete(true);
      return;
    }

    setDisplayedText('');
    setIsTypingComplete(false);

    const speedMs = state.accessibility.textSpeed === 'slow' ? 35 : 18;
    let i = 0;

    const timer = setInterval(() => {
      i++;
      setDisplayedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(timer);
        setIsTypingComplete(true);
      }
    }, speedMs);
    typingTimer.current = timer;

    return () => clearInterval(timer);
  }, [scene.id, scene.dialogue, state.accessibility.textSpeed, state.accessibility.reducedMotion]);

  // Atalhos de teclado (1, 2, 3, 4) para escolhas
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.altKey || e.metaKey || document.querySelector('[aria-modal="true"]')) return;
      if (e.target instanceof HTMLElement && (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= availableChoices.length) {
        e.preventDefault();
        onMakeChoice(availableChoices[num - 1]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Filtragem de escolhas disponíveis de acordo com condições
  const availableChoices = scene.choices.filter((choice) =>
    evaluateCondition(choice.condition, state)
  );

  // Pistas de comportamento calculadas para a perspectiva atual
  const behavioralCues = getBehavioralCues(state.relationalState, scene.perspective);

  return (
    <main
      className="max-w-4xl mx-auto px-4 py-8 space-y-6"
      aria-label="Cena narrativa em andamento"
    >
      {/* 1. Barra de Ambiente e Som Descritivo */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-warm-700 pb-2 border-b border-warm-200">
        <span className="font-semibold tracking-wide uppercase text-warm-900">
          📍 {scene.location}
        </span>
        {state.accessibility.soundIndicators && scene.soundCue && (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-warm-200/70 text-warm-900 border border-warm-300/60"
            role="note"
            aria-label="Efeito sonoro da cena"
          >
            <Volume2 className="w-3.5 h-3.5 text-terracotta" />
            <span className="italic">{scene.soundCue}</span>
          </div>
        )}
      </div>

      {/* 2. Banner de Transição de Perspectiva ou Eco */}
      {(scene.isEchoSequence || scene.perspective === 'echo_past') && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 shadow-sm"
          role="region"
          aria-label="Transição de memória intergeracional"
        >
          <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <strong className="font-semibold block text-amber-950">
              Eco Intergeracional
            </strong>
            <p>
              Por um instante, o presente se dissolve em uma lembrança de quando o próprio cuidador tinha 13 anos.
              O passado não obriga a repetir o padrão; ele apenas oferece contexto.
            </p>
          </div>
        </div>
      )}

      {scene.perspective === 'child' && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl bg-sage/15 border border-sage/30 text-sage-dark shadow-sm"
          role="region"
          aria-label="Inversão de perspectiva"
        >
          <Sparkles className="w-5 h-5 text-sage flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <strong className="font-semibold block text-emerald-900">
              A Outra Perspectiva: O Interior do Quarto
            </strong>
            <p>
              Você agora vivencia a cena pelos olhos de Lia. A mesma porta que parecia uma barreira do lado de fora é sentida aqui dentro como o único escudo contra a exposição e a vergonha.
            </p>
          </div>
        </div>
      )}

      {scene.isRepairOpportunity && (
        <div
          className="flex items-start gap-3 p-4 rounded-xl bg-terracotta/10 border border-terracotta/30 text-terracotta-dark shadow-sm"
          role="region"
          aria-label="Janela de reparação disponível"
        >
          <HeartHandshake className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <strong className="font-semibold block text-terracotta-dark">
              Janela de Reparação
            </strong>
            <p>
              Conflitos e reações impulsivas acontecem em qualquer família real. A capacidade de reconhecer o impacto, escutar sem punir e sustentar limites respeitosos é o que reconstrói a segurança.
            </p>
          </div>
        </div>
      )}

      {/* 3. Detalhes Sensoriais do Ambiente */}
      {scene.sensoryDetails && (
        <div className="p-4 rounded-xl bg-warm-100/60 border border-warm-200/80 text-warm-800 text-sm sm:text-base leading-relaxed italic">
          {scene.sensoryDetails}
        </div>
      )}

      {/* 4. Caixa de Diálogo & Pensamento Interno */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-sm border border-warm-200 space-y-5">
        {/* Identificação do Personagem */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                scene.speaker.id === 'lia'
                  ? 'bg-sage'
                  : scene.speaker.id === 'alex'
                  ? 'bg-terracotta'
                  : 'bg-amber-700'
              }`}
            />
            <div>
              <h2 className="font-bold text-base sm:text-lg text-navy">
                {scene.speaker.name}
              </h2>
              <p className="text-xs text-warm-600">{scene.speaker.role}</p>
            </div>
          </div>

          {/* Card Educativo associado (se houver) */}
          {scene.educationalCardId && (
            <button
              onClick={() => onOpenEducationalCard(scene.educationalCardId!)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-warm-100 hover:bg-warm-200 text-terracotta-dark border border-warm-300 text-xs font-semibold transition-colors"
              title="Abrir conteúdo complementar oficial sobre direitos e psicologia"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Entenda melhor</span>
            </button>
          )}
        </div>

        {/* Fala / Diálogo Principal */}
        {scene.dialogue && (
          <div
            className="text-base sm:text-lg text-navy font-serif leading-relaxed"
          >
            <span aria-hidden="true">“{displayedText}”</span>
            <span className="sr-only" aria-live="polite">“{scene.dialogue}”</span>
          </div>
        )}

        {/* Monólogo Interno (O que não é dito em voz alta) */}
        {scene.internalMonologue && (
          <div className="pt-3 border-t border-warm-100 text-xs sm:text-sm text-warm-700 italic space-y-1">
            <span className="font-sans not-italic font-semibold text-warm-900 block">
              💭 Pensamento interno:
            </span>
            <p>“{scene.internalMonologue}”</p>
          </div>
        )}

        {/* Pistas Comportamentais Não Verbais (Feedback Relacional Oculto) */}
        {behavioralCues.length > 0 && (
          <div className="pt-2 text-xs text-warm-600 space-y-1">
            <span className="font-semibold block text-warm-800">
              Linguagem corporal e sinais observáveis:
            </span>
            <ul className="list-disc list-inside space-y-0.5">
              {behavioralCues.map((cue, idx) => (
                <li key={idx}>{cue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 5. Lista de Escolhas */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-warm-600 px-1">
          <span className="font-semibold uppercase tracking-wider">
            O que fazer a seguir?
          </span>
          <span className="hidden sm:inline">Use as teclas [1, 2, 3...] para escolher</span>
        </div>

        <div className="grid gap-3" role="group" aria-label="Opções de resposta">
          {availableChoices.map((choice, index) => (
            <button
              key={choice.id}
              onClick={() => onMakeChoice(choice)}
              className="w-full text-left p-4 sm:p-5 rounded-xl bg-warm-100/90 hover:bg-warm-200 border border-warm-300/80 text-navy font-medium text-sm sm:text-base transition-all hover:shadow-sm transform hover:-translate-y-0.5 focus:ring-2 focus:ring-terracotta flex items-start gap-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warm-300/70 text-warm-900 flex items-center justify-center text-xs font-bold font-mono">
                {index + 1}
              </span>
              <span className="flex-grow leading-snug">{choice.text}</span>
            </button>
          ))}
        </div>

        {!isTypingComplete && state.accessibility.textSpeed !== 'instant' && (
          <div className="text-center">
            <button
              onClick={() => {
                clearInterval(typingTimer.current);
                setDisplayedText(scene.dialogue || '');
                setIsTypingComplete(true);
              }}
              className="text-xs text-warm-600 hover:text-warm-900 underline"
            >
              Exibir texto completo imediatamente
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
