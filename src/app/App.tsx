import React, { useState, useEffect } from 'react';
import { Header } from '../components/ui/Header';
import { HomeScreen } from '../components/game/HomeScreen';
import { GameScreen } from '../components/game/GameScreen';
import { ReflectionScreen } from '../components/game/ReflectionScreen';
import { EducationalCardModal } from '../components/modals/EducationalCardModal';
import { SafetyModal } from '../components/modals/SafetyModal';
import { SettingsModal } from '../components/modals/SettingsModal';
import { FamilyModeModal } from '../components/modals/FamilyModeModal';
import { MemoriesModal } from '../components/modals/MemoriesModal';
import { AboutModal } from '../components/modals/AboutModal';
import { NarrativeDebugPanel } from '../components/debug/NarrativeDebugPanel';

import { stateManager } from '../engine/stateManager';
import { applyRelationalDeltas } from '../engine/relationshipManager';
import { createMemory } from '../engine/memoryStore';
import { CHAPTER_DOOR_13_SCENES } from '../content/chapters/door_13';
import { GameState, SceneChoice } from '../types';

export const App: React.FC = () => {
  const [state, setState] = useState<GameState>(() => stateManager.getState());
  const [screen, setScreen] = useState<'home' | 'game' | 'reflection'>('home');

  // Modais
  const [activeEducationalCardId, setActiveEducationalCardId] = useState<string | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFamilyModeModalOpen, setIsFamilyModeModalOpen] = useState(false);
  const [isMemoriesModalOpen, setIsMemoriesModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isDebugOpen, setIsDebugOpen] = useState(false);

  // Keep keyboard navigation inside the active dialog and restore focus on close.
  useEffect(() => {
    const dialogs = document.querySelectorAll<HTMLElement>('[aria-modal="true"]');
    const dialog = dialogs[dialogs.length - 1];
    if (!dialog) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]'));
    controls()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        controls()[0]?.click();
      }
      if (event.key !== 'Tab') return;
      const items = controls();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => { document.removeEventListener('keydown', handleKey); if (previousFocus?.isConnected) previousFocus.focus(); };
  }, [activeEducationalCardId, isSafetyModalOpen, isSettingsModalOpen, isFamilyModeModalOpen, isMemoriesModalOpen, isAboutModalOpen]);

  // Inscrição no StateManager
  useEffect(() => {
    const unsubscribe = stateManager.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Aplicação das classes de acessibilidade ao elemento body
  useEffect(() => {
    const a11y = state.accessibility;
    const body = document.body;
    document.documentElement.style.fontSize = ({ sm: '14px', normal: '16px', large: '18.4px', 'extra-large': '20.8px' })[a11y.fontSize];

    // Classe de fonte
    body.classList.remove('font-size-sm', 'font-size-normal', 'font-size-large', 'font-size-extra-large');
    body.classList.add(`font-size-${a11y.fontSize}`);

    // Alto contraste
    if (a11y.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Redução de movimento
    if (a11y.reducedMotion) {
      body.classList.add('reduced-motion');
    } else {
      body.classList.remove('reduced-motion');
    }

    // Fonte disléxica
    if (a11y.dyslexicFont) {
      body.classList.add('dyslexic-font');
    } else {
      body.classList.remove('dyslexic-font');
    }
  }, [state.accessibility]);

  // Cena atual resolvida
  const currentScene = CHAPTER_DOOR_13_SCENES[state.currentSceneId] || CHAPTER_DOOR_13_SCENES['door_01_corridor_arrival'];

  // Manipulador de escolhas do jogador
  const handleMakeChoice = (choice: SceneChoice) => {
    const effects = choice.effects;

    stateManager.updateState((prev) => {
      // 1. Atualizar variáveis relacionais
      const updatedRelational = applyRelationalDeltas(prev.relationalState, effects.relationalDeltas);

      // 2. Acumular novas memórias
      const newMemories = effects.addMemories
        ? effects.addMemories.map((m) => createMemory(m))
        : [];

      // 3. Atualizar flags
      const updatedFlags = { ...prev.flags, ...(effects.setFlags || {}) };

      // 4. Determinar próxima perspectiva
      let nextPerspective = prev.perspective;
      if (effects.triggerPerspectiveSwitch) {
        nextPerspective = effects.triggerPerspectiveSwitch.targetPerspective;
      }

      // 5. Histórico de diálogo
      const historyEntry = {
        sceneId: prev.currentSceneId,
        speakerName: currentScene.speaker.name,
        text: currentScene.dialogue || '',
        chosenOptionText: choice.text,
      };

      // 6. Verificar se a próxima cena é a tela de reflexão
      if (choice.nextSceneId === 'chapter_reflection_screen') {
        return {
          ...prev,
          relationalState: updatedRelational,
          memories: [...prev.memories, ...newMemories],
          flags: updatedFlags,
          chapterFinished: true,
          history: [...prev.history, historyEntry],
        };
      }

      const nextNode = CHAPTER_DOOR_13_SCENES[choice.nextSceneId];

      return {
        ...prev,
        currentSceneId: choice.nextSceneId,
        perspective: nextNode ? nextNode.perspective : nextPerspective,
        relationalState: updatedRelational,
        memories: [...prev.memories, ...newMemories],
        flags: updatedFlags,
        currentEnding: nextNode?.endingType ?? prev.currentEnding,
        seenSceneIds: Array.from(new Set([...prev.seenSceneIds, choice.nextSceneId])),
        history: [...prev.history, historyEntry],
      };
    });

    if (choice.nextSceneId === 'chapter_reflection_screen') {
      setScreen('reflection');
    }

    if (effects.educationalCardId) {
      setActiveEducationalCardId(effects.educationalCardId);
    }
  };

  const handleStartNewStory = () => {
    stateManager.resetGame();
    setScreen('game');
  };

  const handleContinueStory = () => {
    if (state.chapterFinished) {
      setScreen('reflection');
    } else {
      setScreen('game');
    }
  };

  const handleRestartChapter = () => {
    stateManager.resetGame();
    setScreen('game');
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-50 text-navy transition-colors">
      <Header
        perspective={screen === 'game' ? currentScene.perspective : undefined}
        currentLocation={screen === 'game' ? currentScene.location : undefined}
        showInGameControls={screen === 'game'}
        onOpenSafety={() => setIsSafetyModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onToggleDebug={() => setIsDebugOpen((prev) => !prev)}
        onGoHome={screen !== 'home' ? () => setScreen('home') : undefined}
      />

      <div className="flex-grow">
        {screen === 'home' && (
          <HomeScreen
            hasSavedGame={state.seenSceneIds.length > 1}
            onContinue={handleContinueStory}
            onNewStory={handleStartNewStory}
            onOpenFamilyMode={() => setIsFamilyModeModalOpen(true)}
            onOpenMemories={() => setIsMemoriesModalOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenAbout={() => setIsAboutModalOpen(true)}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            scene={currentScene}
            state={state}
            onMakeChoice={handleMakeChoice}
            onOpenEducationalCard={(cardId) => setActiveEducationalCardId(cardId)}
          />
        )}

        {screen === 'reflection' && (
          <ReflectionScreen
            state={state}
            onRestartChapter={handleRestartChapter}
            onOpenMemories={() => setIsMemoriesModalOpen(true)}
            onOpenEducationalCard={(cardId) => setActiveEducationalCardId(cardId)}
            onGoHome={() => setScreen('home')}
          />
        )}
      </div>

      {/* Modais do Sistema */}
      {activeEducationalCardId && (
        <EducationalCardModal
          cardId={activeEducationalCardId}
          onClose={() => setActiveEducationalCardId(null)}
        />
      )}

      {isSafetyModalOpen && (
        <SafetyModal onClose={() => setIsSafetyModalOpen(false)} />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          settings={state.accessibility}
          onUpdateSettings={(newSettings) => stateManager.updateAccessibility(newSettings)}
          onResetGame={() => { stateManager.clearAll(); setScreen('home'); }}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      )}

      {isFamilyModeModalOpen && (
        <FamilyModeModal onClose={() => setIsFamilyModeModalOpen(false)} />
      )}

      {isMemoriesModalOpen && (
        <MemoriesModal
          memories={state.memories}
          onClose={() => setIsMemoriesModalOpen(false)}
        />
      )}

      {isAboutModalOpen && (
        <AboutModal onClose={() => setIsAboutModalOpen(false)} />
      )}

      {/* Painel de Debug Narrativo para desenvolvedores e QA */}
      {import.meta.env.DEV && isDebugOpen && (
        <NarrativeDebugPanel
          state={state}
          onJumpToScene={(sceneId) => {
            stateManager.updateState((prev) => ({
              ...prev,
              currentSceneId: sceneId,
              perspective: CHAPTER_DOOR_13_SCENES[sceneId]?.perspective || prev.perspective,
            }));
          }}
          onClose={() => setIsDebugOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
