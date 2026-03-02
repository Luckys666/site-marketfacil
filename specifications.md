# Especificações Técnicas e Guia de Estilo (Site MarketFacil)

Este documento contém as especificações arquiteturais e de design globais para a criação de sites e ferramentas no projeto `site-marketfacil`. Estas diretrizes devem ser seguidas por qualquer desenvolvedor ou agente trabalhando neste projeto para garantir consistência visual e estrutural ao longo de novas integrações.

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
- `.mf-calc` ou `.mf-container`: Define o contêiner principal para limitar largura e centralizar conteúdo.
- `.mf-header`: Estilização do cabeçalho global.
- `.mf-section`: Elementos agrupados visualmente com uma borda sutil e sombreamento (shadow card) para destacar blocos de conteúdo.
- `.mf-grid-2`, `.mf-grid-3`: Utilitários globais para exibição em colunas no formato de CSS Grid.
- `.mf-field`: Encapsulamento de labels (`<label>`) e inputs (`<input>`) permitindo alinhamento através do Flexbox.

### 2.3. Diretrizes em UI/UX Globais
- **Campos de Formulário**: Utilizam raio de borda suave (`border-radius: 6px`) e oferecem bom feedback de *focus* visual (mudança da cor da borda com efeito de boxShadow sutil para indicar o elemento focado).
- **Premium Look (High-end UI)**: Componentes responsáveis por expor o resultado final principal da aplicação devem utilizar design de "Caixa Alta" (High-end), podendo usar formatação gradient leve com cores dinâmicas e efeitos estendidos por sombra visual. Evitar backgrounds chapados para grandes focos.
- **Simplicidade Oculta (Modo Avançado)**: Informação extremamente detalhada que um usuário novato pode não necessitar é mantida sob a classe utilitária `.mf-advanced`, onde o elemento possui `display: none`. Ela será ativada visivelmente apenas se um switch global ligado a um wrapper (geralmente pai) alterar o estado. Isto permite UIs limpas com poder progressivo.
- **Tipografia Moderna**: A propriedade de fonte global é atribuída diretamente a familia `Inter` e fontes secundárias como `Outfit` para cabeçalhos. A hierarquia visual deve acontecer pelo peso e tamanho (`font-weight`, `font-size`) em união com rótulos em *uppercase* pequenos para subtítulos contextuais.

## 3. Padrões de JavaScript

### 3.1. Arquitetura Orientada a Objetos
O código isola perfeitamente domínios operacionais usando Classes JavaScript em aplicações interativas.
- **Global Controller** (ex: Gerenciador de Página): Fica em nível global lidando com a estrutura macro da página, gerenciando inserção de outros componentes subjacentes, trocas de temas (`body.dark`) e exportações de dados.
- **Entidade Interna** (ex: Componente de Lista, Item individual): Representação granular em instâncias de objetos no mundo da regra de negócio. É autocontida sem vazar manipulação de estado ou eventos para outros elementos externos indevidamente.

### 3.2. Manipulação do DOM
- O boilerplate em HTML da entidade principal interativa repetível é geralmente mantido invisível dentro de tags `<template id="...">` em vez de criado intermitentemente via string templating no código CSS/JS (`innerHTML`), o que possibilita limpeza visual e manutenção facilitada diretamente no arquivo HTML.
- Utilizar referências relativas a clonagem com `content.cloneNode(true)`.
- Reatividade Ad Hoc (Event Listeners leves): Ao instânciar seus elementos visuais, classes interativas devem se inscrever para rastrear as mudanças necessárias (exemplo: inputs textuais possuindo `.addEventListener('input', ...)`).

## 4. Estrutura de Arquivos
A fim de manter organização em módulos:
- `/css/style.css`: A folha de estilo global abrangendo o `:root`, resets básicos e estilos descritos acima (também aplicável a novas aplicações ou sites da marca).
- `/js/{nome-modulo}.js`: O gerenciador lógico encapsulado respectivo a cada tela ou ferramenta.
- `{nome-modulo}.html`: A marcação da ferramenta, página ou painel (ex: relatórios, calculadoras).
