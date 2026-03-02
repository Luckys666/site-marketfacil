# Especificações Técnicas e Guia de Estilo (Site MarketFacil)

Este documento contém as especificações arquiteturais e de design para a criação de novas ferramentas e calculadoras no projeto `site-marketfacil`. Estas diretrizes devem ser seguidas por qualquer agente trabalhando neste projeto para garantir consistência visual e estrutural ao longo de novas integrações.

## 1. Stack Tecnológico
- **HTML5**: Código semântico, focado na responsividade e clareza da estrutura.
- **CSS3 (Vanilla)**: Utilização extensiva de CSS Variables (Custom Properties) para temas dinâmicos (claro/escuro), Flexbox e CSS Grid para layouts flexíveis. Evitar o uso de frameworks externos de CSS como Bootstrap ou Tailwind.
- **JavaScript (Vanilla/ES6)**: Padrão de Programação Orientada a Objetos (Classes ES6). Sem uso de dependências pesadas como jQuery ou frameworks não requeridos neste estágio para manter performance máxima.

## 2. Padrões de Layout e CSS

### 2.1. Variáveis e Sistema de Temas
As cores primárias e de fundo (background) estão mapeadas a variáveis na pseudo-classe `:root` e são substituídas na classe `body.dark` para suportar o modo escuro nativamente.
- **Exemplo de Variáveis**: `--bg`, `--bg-card`, `--bg-input`, `--border`, `--primary`, `--success`, `--danger`, `--text`, `--radius`.
- A inversão da paleta de cores é realizada pelo acionador do tema adicionando a classe `.dark` ao nó `<body>`.

### 2.2. Arquitetura do CSS (Prefixo / BEM simplificado)
A fim de prevenir conflitos entre CSS global ou outros projetos, é utilizado o prefixo de componente `mf-` (MarketFacil) para nomear as classes.
- `.mf-calc`: Define o contêiner principal para limitar largura.
- `.mf-header`: Estilização do cabeçalho da ferramenta.
- `.mf-section`: Elementos agrupados visualmente com uma borda sutil e sombreamento (shadow card).
- `.mf-grid-2`, `.mf-grid-3`: Utilitários fáceis para colunas em formato de Grid.
- `.mf-field`: Encapsulamento de labels (`<label>`) e inputs (`<input>`) permitindo alinhamento através do Flex `.

### 2.3. Diretrizes em UI/UX
- **Campos de Formulário**: Utilizam raio de borda suave (`border-radius: 6px`) e oferecem bom feedback de *focus* visual (mudança da borda com efeito de boxShadow para indicar seleção contínua).
- **Premium Look (High-end UI)**: Componentes responsáveis por expor o resultado final principal (no caso da calculadora de preços: "Preço de Venda" ou "Lucro") utilizam leve formatação gradient com cores dinâmicas e efeitos estendidos por sombra visual. Evitar backgrounds chapados para grandes focos.
- **Simplicidade Oculta (Modo Avançado)**: Informação extremamente detalhada que o usuário normal pode não necessitar é mantida sobre a classe `.mf-advanced`, onde o elemento possui display: none. Ela será ativada visivelmente apenas se o pai `<body class="advanced">` contiver tal switch globalmente posicionado.
- **Tipografia Moderna**: A propriedade de fonte global é atribuída diretamente a familia `Inter`. A hierarquia visual acontece fortemente pelo peso, tamanho (`font-weight`, `font-size`) e estilo para rótulos em *uppercase* pequenos e valores de variáveis expressivas grandes.

## 3. Padrões de JavaScript

### 3.1. Arquitetura Orientada a Objetos
O código isola perfeitamente domínios operacionais usando Classes JavaScript.
- **Global Controller** (ex: `Calculator`): Fica em nível global lidando com a estrutura macro da página, gerenciando inserção de outros componentes, trocas de temas (`body.dark`), switches e exportações em múltiplos módulos e dados.
- **Entidade Interna** (ex: `Product`): Representação granular em instâncias de objetos no mundo da regra de negócio (e.g. controle para inputs únicos de uma "linha de pedido"). É contida na sua classe principal sem vazar estado para elementos externos.

### 3.2. Manipulação do DOM
- O boilerplate em HTML da entidade principal é geralmente mantido invisível num nó `<template id="product-template">` em vez de criado intermitentemente via string templating no código (`innerHTML`), o que possibilita limpesa visual no JS.
- Utilizar referências relativas a clonagem com `content.cloneNode(true)`.
- Reatividade Ad Hoc (two-way binding leve): Ao instânciar seus elementos visuais, a classe se inscreve para rastrear as mudanças dos input com eventos como `.addEventListener('input', () => this.calculate())` a acionar as respostas matematicas em *real time*.

### 3.3. Reatividade de Dados Reversos / Iteração
Sempre que possível, na criação de calculadoras e interfaces matemáticas, possibilite edição bidirecional; em vez de apenas campos calcularem "resultados travados" os resultados também são "input" passiveis de alterar os dados fixos que as geraram inicialmente (Ex: Editar "Lucro alvo", processa novamente o valor necessário para o "Preço de venda").

## 4. Estrutura de Arquivos
- `/css/style.css`: A folha de estilo global abrangendo root e estilos generalistas.
- `/js/{nome-modulo}.js`: O gerenciador lógico encapsulado respectivo a cada calculadora ou página.
- `{nome-modulo}.html`: A marcação final da ferramenta ou demais páginas seguindo este padrão (ex: relatórios, etc).

Mantenha estes preceitos visando escalabilidade e padronização visual completa para novos passos no projeto MarketFacil.
