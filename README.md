# Entre Laços

> *"Às vezes, a mesma história parece completamente diferente do outro lado."*

**Entre Laços** é um jogo web narrativo sobre crescer, cuidar e aprender a viver em família. O jogador vivencia situações cotidianas comuns sob perspectivas alternadas — experimentando a mesma cena ora pelos olhos do cuidador, ora pelos olhos da criança ou do adolescente, e eventualmente pelo jovem adulto que aquela criança se tornou.

Inspirado em pesquisas de desenvolvimento infantil, neuropsicologia, diretrizes de parentalidade protetiva (OMS/UNICEF) e nos princípios fundamentais do Estatuto da Criança e do Adolescente (ECA - Lei 8.069/1990), o projeto afasta-se de cartilhas expositivas, questionários morais e simuladores de "pais perfeitos". Em vez de pontuações de certo/errado, o jogo revela as consequências das decisões diretamente no comportamento, na linguagem corporal, na confiança e na disponibilidade relacional dos personagens.

---

## 📸 Imagens do Jogo

Capturas reais do capítulo jogável **A Porta Fechada**.

### Tela inicial

Menu para iniciar a história, consultar memórias e ajustar a experiência.

![Tela inicial de Entre Laços com os botões Nova história, Modo Família, Memórias e Configurações](docs/images/tela-inicial.png)

### Escolhas de Alex

Na perspectiva do cuidador, cada resposta afeta o vínculo e registra memórias da relação.

![Cena de Alex diante da porta fechada, com quatro opções de resposta à adolescente](docs/images/escolhas-alex.png)

### A perspectiva de Lia

A história muda para o interior do quarto, revelando os pensamentos e sentimentos de Lia.

![Perspectiva de Lia dentro do quarto, com diálogo, pensamento interno e escolhas](docs/images/perspectiva-lia.png)

### Configurações de acessibilidade

Controles de tamanho de texto, contraste, velocidade dos diálogos, indicadores sonoros e movimento.

![Janela de configurações com opções de leitura, alto contraste e redução de animações](docs/images/acessibilidade.png)

---

## 🎯 Pilares Centrais do Projeto

1. **Duas Perspectivas:** Intenção e impacto coexistem. Uma atitude pensada como proteção pode ser sentida como invasão ou desamparo.
2. **Sistema Relacional Multidimensional Oculto:** Vínculos familiares não são barras lineares de 0 a 100%. Avaliamos internamente variáveis como segurança percebida, abertura para revelar erros, autonomia apoiada e previsibilidade.
3. **Memória Relacional Cumulativa:** Escolhas feitas em uma idade ecoam em diálogos futuros. Confiança conquistada ou perdida altera o que os personagens compartilham.
4. **Ecos Intergeracionais:** O cuidador revisita flashes de sua própria infância e adolescência, percebendo repetições automáticas de padrões e recebendo a oportunidade de interrompê-los ou transformá-los.
5. **Mecânica de Reparação:** O erro faz parte da parentalidade real. Um conflito não é um "Game Over": o jogo modela passos concretos de reconhecimento, escuta, pedido de desculpas autêntico e mudança de atitude.
6. **Limites não são Abuso:** Parentalidade protetiva exige regras claras, segurança e intervenções proporcionais. O jogo ensina que firmeza e respeito caminham juntos.
7. **ECA Invisível e Cards Opcionais:** Os direitos fundamentais operam como regras estruturais de design da narrativa. Ao final das cenas, cards opcionais de *"Entenda Melhor"* conectam a vivência à legislação oficial e a consensos científicos.
8. **Privacidade e Proteção Absoluta:** O jogo funciona 100% localmente no navegador (localStorage). Nenhum dado pessoal de crianças, adolescentes ou famílias é coletado ou transmitido para servidores.

---

## 🚀 Status do Projeto: Vertical Slice (M1)

Atualmente implementado na versão **v0.1.0**:
- **Capítulo Piloto:** *"A Porta Fechada"* (Lia, 13 anos).
- **Conflito:** Lia chega da escola introspectiva após um atrito com colegas, fecha a porta do quarto e recusa contato inicial. O cuidador (Alex) precisa equilibrar o dever de proteção com o respeito à privacidade emergente da adolescência.
- **Mecânicas Ativas:**
  - Alternância de perspectiva (Cuidador Alex ⇄ Adolescente Lia);
  - Eco Intergeracional (memória do cuidador sobre maçaneta removida na adolescência);
  - Janela de Reparação pós-atrito;
  - 3 desfechos narrativos distintos para o capítulo;
  - Cards pedagógicos/jurídicos opcionais baseados na Lei 8.069/1990 e literatura da OMS;
  - Botão permanente de apoio e salvaguarda com canais oficiais (Disque 100, Conselho Tutelar, CVV 188);
  - Suite de Acessibilidade (fontes escaláveis, alto contraste, controle de velocidade de texto, modo sem tempo, navegação por teclado e leitor de tela);
  - Painel de Debug Narrativo para desenvolvedores e revisores técnicos.

---

## 🛠️ Tecnologias Utilizadas

- **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) com paleta acolhedora customizada (Terracota, Sálvia, Âmbar, Caramelo, Azul Noturno)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Persistência:** LocalStorage com tipagem estrita e validação de schema
- **Arquitetura Narrativa:** Engine data-driven baseada em grafos de nós modulares (`Scene`, `Choice`, `Condition`, `Effect`, `Memory`)

---

## 📂 Estrutura do Projeto

```text
entre-lacos/
├── public/                 # Assets estáticos e favicon
├── src/
│   ├── app/                # Layout e orquestração da aplicação
│   ├── components/         # Componentes de interface e gameplay
│   │   ├── accessibility/  # Controles de acessibilidade e barra de suporte
│   │   ├── game/           # Tela de jogo, visual novel view, exploração
│   │   ├── narrative/      # Diálogos, pensamentos internos, opções
│   │   ├── debug/          # Narrative Debug Panel (somente DEV)
│   │   └── modals/         # Cards "Entenda Melhor", Ajuda/ECA, Configurações
│   ├── content/            # Conteúdo narrativo e educacional data-driven
│   │   ├── chapters/       # Roteiros estruturados (ex: door_13.ts)
│   │   ├── educational/    # Cards de direitos ECA e psicologia do desenvolvimento
│   │   └── safety/         # Protocolos de segurança e canais de proteção
│   ├── engine/             # Motor narrativo independente da UI
│   │   ├── stateManager.ts # Gerenciador de estado e persistência local
│   │   ├── conditionEvaluator.ts # Avaliador de prerequisitos e flags
│   │   ├── relationshipManager.ts # Atualizador de variáveis relacionais
│   │   └── memoryStore.ts  # Gerenciador de memórias cumulativas
│   ├── types/              # Definições completas TypeScript
│   └── styles/             # Configurações de Tailwind e temas de contraste
├── docs/                   # Documentação detalhada de pesquisa e arquitetura
├── ARCHITECTURE.md         # Detalhamento de arquitetura de software
├── GAME_DESIGN.md          # GDD completo do projeto
├── NARRATIVE_SYSTEM.md     # Bíblia narrativa, personagens e roteiros
├── SAFETY.md               # Salvaguardas, ética e proteção de menores
├── ACCESSIBILITY.md        # Diretrizes e implementações de acessibilidade
├── CONTENT_GUIDELINES.md   # Taxonomia de conflitos e limites
├── ROADMAP.md              # Planejamento de marcos e expansões futuras
└── CONTRIBUTING.md         # Guia de contribuição e pipeline de revisão
```

---

## 💻 Como Instalar e Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn/pnpm

### Passos de Execução
```bash
# 1. Clonar o repositório
git clone https://github.com/SouBeatrizKaroline/entre-lacos.git
cd entre-lacos

# 2. Instalar dependências
npm install

# 3. Executar o servidor de desenvolvimento
npm run dev

# 4. Compilar para produção
npm run build

# 5. Pré-visualizar a compilação de produção
npm run preview
```

---

## ⚖️ Limites Clínicos e Jurídicos

- **Não é Ferramenta Clínica:** O jogo não diagnostica transtornos de apego, TDAH, autismo, depressão, ansiedade ou trauma. Não substitui psicoterapia, avaliação neuropsicológica ou perícia forense.
- **Não é Aconselhamento Jurídico:** Os cards informativos refletem dispositivos públicos da Lei Federal nº 8.069/1990 (ECA), Lei nº 13.010/2014 (Lei Menino Bernardo) e Lei nº 13.431/2017 (Sistema de Garantia de Direitos da Criança e do Adolescente Vítima ou Testemunha de Violência). Eles não substituem consulta jurídica individual nem atuação do Conselho Tutelar ou Ministério Público.
- **Ajuda e Denúncia:** Em qualquer situação de suspeita ou confirmação de violação de direitos contra crianças e adolescentes no Brasil, acione o **Disque 100** (ligação gratuita, anônima, 24 horas) ou o **Conselho Tutelar** de sua região. Em emergências de saúde ou risco iminente, ligue **190** (Polícia Militar) ou **192** (SAMU).

---

## 📜 Licença

Licença a ser formalizada no lançamento institucional. Todos os direitos de design, universo e narrativa reservados à equipe criativa do projeto Entre Laços.
