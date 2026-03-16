import re
import os

path = r"c:\Users\Lucas Sertori\Documents\site-marketfacil\js\calc-shopee.js"
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Remove MATRICES completely
text = re.sub(r'const MATRICES = \{.*?\};\n', '', text, flags=re.DOTALL)

# Add globalCpf logic
text = text.replace(
"""        this.globalTax = document.getElementById('global-tax');
        this.globalOpCost = document.getElementById('global-op-cost');""",
"""        this.globalTax = document.getElementById('global-tax');
        this.globalOpCost = document.getElementById('global-op-cost');
        this.globalCpf = document.getElementById('global-cpf');"""
)

text = text.replace(
"""        // Global inputs
        [this.globalRevenue, this.globalFixedCost, this.globalTax].forEach(el => {""",
"""        // Global inputs
        [this.globalRevenue, this.globalFixedCost, this.globalTax, this.globalCpf].forEach(el => {"""
)

text = text.replace(
"""    getOpCostRate() {""",
"""    isCpfActive() { return this.globalCpf && this.globalCpf.checked; }

    getOpCostRate() {"""
)

# Export CSV fixes
text = text.replace(
"""        const headers = ['SKU', 'Custo', 'ML%', 'Peso', 'Envio', 'TACOS%', 'Margem%', 'Contrib%', 'Preco', 'Lucro', 'ROI%'];""",
"""        const headers = ['SKU', 'Custo', 'Shopee%', 'TaxaFixa(R$)', 'TACOS%', 'Margem%', 'Contrib%', 'Preco', 'Lucro', 'ROI%'];"""
)

text = text.replace(
"""                p.element.querySelector('.input-cost')?.value || '0',
                p.element.querySelector('.input-ml')?.value || '16.5',
                p.element.querySelector('.input-weight')?.options[p.element.querySelector('.input-weight').selectedIndex].text || '',
                p.element.querySelector('.input-frete')?.value || '0',""",
"""                p.element.querySelector('.input-cost')?.value || '0',
                p.element.querySelector('.input-shopee-comm')?.value || '0',
                p.element.querySelector('.input-shopee-fixed')?.value || '0',"""
)

text = text.replace('precos-ml.csv', 'precos-shopee.csv')

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)
