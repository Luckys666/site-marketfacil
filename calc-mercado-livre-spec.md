# Especificações da Calculadora Mercado Livre

Este documento detalha as regras de negócio, layout e funcionalidades específicas da Calculadora de Preços para Mercado Livre (`calc-mercado-livre.html` e `js/calc-mercado-livre.js`).

## 1. Layout e Hierarquia Visual

### 1.1. Estrutura do Card de Produto (`.product-card`)
O layout do produto adota uma estrutura em grid dividindo a responsabilidade da interface:
- **Lado Esquerdo (Inputs & Controles)**: Área de inserção de dados pelo usuário, dividida em linhas lógicas (SKU, Custo base, Taxas, Frete e Ads na primeira linha; Margem de Lucro na segunda).
- **Lado Direito (Resultados)**: Uma coluna vertical (`.results-section`) de altura total que apresenta os resultados cruciais (Preço de Venda, Lucro, ROI). Estes campos utilizam design premium com gradientes suaves e foco numérico para clareza rápida.

### 1.2. Painel "Nerds" oculto (`.nerds-row`)
Abaixo da estrutura primária do card, reside uma seção expansível revelando cálculos detalhados da operação:
- Comissão (Valor R$ e Percentagem real)
- Impostos (R$)
- Lucro Bruto e Lucro após Imp.
- Rateio Custo Fixo

## 2. Padrões Funcionais e Regras de Negócio

### 2.1. Modo Avançado (`.mf-advanced`)
Uma chave seletora global ("Modo Avançado") revela funcionalidades complexas que estariam ocultas para o usuário básico:
- Botões de Adicionar/Remover múltiplos produtos.
- Input de Gasto com Ads (TACOS %).
- Tabela de Resultados do ROI (Retorno sobre Investimento).
- Botão expansor do painel de "Cálculos para Nerds".

### 2.2. Reatividade e Vinculação Bidirecional (Two-Way Binding)
A calculadora não permite apenas um fluxo de cálculo. O usuário pode editar variáveis de resultado para influenciar a base:
- **Fluxo Normal**: Alterar o Custo, Margem (%) ou Peso gera o Preço de Venda necessário.
- **Fluxo Reverso**: Alterar o "Preço de Venda" recálcula a "Margem (%)", revelando o lucro real se praticar aquele preço competitivo. O painel final inclui 3 campos reversos: **Preço de Venda**, **Lucro** ou **ROI (%)**. Ao informar o ROI desejado, o sistema recalculará o Lucro Ideal e interativamente encontrará o Preço exato englobando fretes progressivos.

### 2.3. Parâmetros e Custos do Mercado Livre
A lógica principal abrange:
- **Taxa ML (%)**: O comissionamento clássico ou premium da plataforma (geralmente entre 11% e 20%).
- **Frete por Peso e Categoria**: O custo do Mercado Envios depende do peso do produto e da categoria/logística. Uma nova chave de seleção "Categoria de Envio" suporta múltiplas tabelas (Março/2026):
  - **Padrão Geral**: Regra convencional. O frete máximo para produtos abaixo de R$19,00 é limitado a 50% do valor do produto.
  - **Mercado Envios Full (Super)**: Possui custos distintos. O frete máximo para produtos da categoria supermercado custando menos de R$ 29,00 é limitado a 25% do valor do produto.
  - **Livros**, **Categorias Especiais**, **Alimento para Pets**: Matrizes matemáticas subsidiadas com regras progressivas únicas por faixa de peso e preço.
  - **Usados / Grátis**: Se o vendedor resolver oferecer frete grátis nessas categorias de baixo patrocínio, não conta com o limite do teto de 50%.
- **Comissão Total (R$ e %)**: Trata-se da junção estrita e somada entre o valor tirado da Taxa ML base somado o Frete repassado ao usuário.
- **TACOS (Total Advertising Cost of Sale)**: Um percentual adicional representando gasto com Mercado Ads sobre a venda bruta.

## 3. Diretrizes Adicionais de UI/UX
- **Tooltips Explicativos**: Todos os campos da calculadora (globais e produtos) incluem a propriedade `title` contendo brevíssimos resumos (tooltips nativos). Isso facilita que usuários novatos entendam o que cada métrica compõe sem necessidade de um onboarding externo severo longo.

## 4. Exportação de Dados (CSV Export)
A calculadora permite exportar as simulações em formato tabular amigável (Excel).
O processo deve garantir compatibilidade regional do Brasil:
- **Delimitador**: Obrigatório uso de Ponto e Vírgula (`;`) para correta separação em versões locais do Excel.
- **Encoding**: Utilização do **UTF-8 BOM** (`\uFEFF`) no início do blob para assegurar a leitura nativa de acentuações ("Preço de Venda", "Operação", etc) no Excel do Windows.
- As colunas de output do CSV são em formato legível, traduzindo as variáveis de sistema (ex: "Preço Final" ao invés de `precoVenda`, e valores formatados monetariamente com vírgula).
