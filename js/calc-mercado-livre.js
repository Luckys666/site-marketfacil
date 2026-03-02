// =============================================
// CALCULADORA ML - JAVASCRIPT
// =============================================

class Calculator {
    constructor() {
        this.products = [];
        this.container = document.getElementById('products-container');
        this.template = document.getElementById('product-template');

        // Global inputs
        this.globalRevenue = document.getElementById('global-revenue');
        this.globalFixedCost = document.getElementById('global-fixed-cost');
        this.globalTax = document.getElementById('global-tax');
        this.globalOpCost = document.getElementById('global-op-cost');

        this.init();
    }

    init() {
        // Add first product
        this.addProduct();

        // Add product button
        document.getElementById('btn-add-product').addEventListener('click', () => this.addProduct());

        // Theme toggle
        const btnTheme = document.getElementById('theme-toggle');
        if (btnTheme) {
            btnTheme.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
            btnTheme.addEventListener('click', () => {
                document.body.classList.toggle('dark');
                btnTheme.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
            });
        }

        // Advanced Mode toggle
        const advancedToggle = document.getElementById('advanced-mode');
        advancedToggle.addEventListener('change', () => {
            document.body.classList.toggle('advanced', advancedToggle.checked);
        });

        // Export CSV
        document.getElementById('btn-export').addEventListener('click', () => this.exportCSV());

        // Global inputs
        [this.globalRevenue, this.globalFixedCost, this.globalTax].forEach(el => {
            el.addEventListener('input', () => {
                this.updateOpCost();
                this.recalculateAll();
            });
        });

        this.updateOpCost();
    }

    exportCSV() {
        const headers = ['SKU', 'Custo', 'ML%', 'Peso', 'Envio', 'TACOS%', 'Margem%', 'Contrib%', 'Preco', 'Lucro', 'ROI%'];
        const rows = this.products.map(p => {
            return [
                p.element.querySelector('.input-sku')?.value || '',
                p.element.querySelector('.input-cost')?.value || '0',
                p.element.querySelector('.input-ml')?.value || '16.5',
                p.element.querySelector('.input-weight')?.options[p.element.querySelector('.input-weight').selectedIndex].text || '',
                p.element.querySelector('.input-frete')?.value || '0',
                p.element.querySelector('.input-tacos')?.value || '0',
                p.element.querySelector('.input-margin')?.value || '27',
                p.element.querySelector('.output-contrib')?.value || '0%',
                p.element.querySelector('.input-price')?.value || '0',
                p.element.querySelector('.input-profit')?.value || '0',
                p.element.querySelector('.output-roi')?.value || '0%'
            ].join(';');
        });

        // UTF-8 BOM + CSV content
        const BOM = '\uFEFF';
        const csvContent = BOM + headers.join(';') + '\r\n' + rows.join('\r\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, 'precos-ml.csv');
        } else {
            // Other browsers
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'precos-ml.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }
    }

    getGlobalRevenue() { return parseFloat(this.globalRevenue.value) || 0; }
    getGlobalFixedCost() { return parseFloat(this.globalFixedCost.value) || 0; }
    getGlobalTaxRate() { return (parseFloat(this.globalTax.value) || 0) / 100; }

    getOpCostRate() {
        const rev = this.getGlobalRevenue();
        const fixed = this.getGlobalFixedCost();
        return rev > 0 ? fixed / rev : 0;
    }

    updateOpCost() {
        const rate = this.getOpCostRate() * 100;
        this.globalOpCost.value = this.fmtPerc(rate);
    }

    recalculateAll() {
        this.products.forEach(p => p.calculate('margin'));
    }

    addProduct() {
        const clone = this.template.content.cloneNode(true);
        const card = clone.querySelector('.product-card');
        this.container.appendChild(card);

        const product = new Product(card, this);
        this.products.push(product);
    }

    removeProduct(product) {
        if (this.products.length <= 1) return;
        product.element.remove();
        const idx = this.products.indexOf(product);
        if (idx > -1) this.products.splice(idx, 1);
    }

    // Utilities
    parse(val) {
        if (!val) return 0;
        if (typeof val === 'number') return val;
        if (typeof val === 'string' && val.includes(',')) {
            val = val.replace(/\./g, '').replace(',', '.');
        }
        return parseFloat(val) || 0;
    }

    fmtMoney(val) {
        return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    fmtPerc(val) {
        return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
    }
}

class Product {
    constructor(element, calc) {
        this.element = element;
        this.calc = calc;

        // Inputs
        this.inputCost = element.querySelector('.input-cost');
        this.inputMl = element.querySelector('.input-ml');
        this.inputWeight = element.querySelector('.input-weight');
        this.inputFrete = element.querySelector('.input-frete'); // Now disabled, showing table value
        this.inputTacos = element.querySelector('.input-tacos');
        this.inputMarginSlider = element.querySelector('.input-margin-slider');
        this.inputMargin = element.querySelector('.input-margin');
        this.inputPrice = element.querySelector('.input-price');
        this.inputProfit = element.querySelector('.input-profit');

        // Outputs
        this.outputContrib = element.querySelector('.output-contrib');
        this.outputRoi = element.querySelector('.output-roi');
        this.outputCommissionVal = element.querySelector('.output-commission-val');
        this.outputCommissionPerc = element.querySelector('.output-commission-perc');
        this.outputTaxesVal = element.querySelector('.output-taxes-val');
        this.outputGross = element.querySelector('.output-gross');
        this.outputGrossAfterTax = element.querySelector('.output-gross-after-tax');
        this.outputOpCost = element.querySelector('.output-op-cost');

        this.initEvents();
        this.calculate('margin');
    }

    initEvents() {
        // Direct inputs -> recalculate from margin
        [this.inputCost, this.inputMl, this.inputWeight, this.inputTacos].forEach(el => {
            if (el) el.addEventListener('input', () => this.calculate('margin'));
        });

        // Margin slider
        this.inputMarginSlider.addEventListener('input', (e) => {
            this.inputMargin.value = e.target.value;
            this.calculate('margin');
        });

        // Margin input
        this.inputMargin.addEventListener('input', (e) => {
            this.inputMarginSlider.value = e.target.value;
            this.calculate('margin');
        });

        // Price -> recalculate margin
        this.inputPrice.addEventListener('input', () => this.calculate('price'));
        this.inputPrice.addEventListener('blur', () => {
            this.inputPrice.value = this.calc.fmtMoney(this.calc.parse(this.inputPrice.value));
        });

        // Profit -> recalculate price
        this.inputProfit.addEventListener('input', () => this.calculate('profit'));
        this.inputProfit.addEventListener('blur', () => {
            this.inputProfit.value = this.calc.fmtMoney(this.calc.parse(this.inputProfit.value));
        });

        // Remove button
        this.element.querySelector('.btn-remove').addEventListener('click', () => {
            this.calc.removeProduct(this);
        });

        // Nerds toggle button
        const btnNerds = this.element.querySelector('.btn-nerds');
        const nerdsRow = this.element.querySelector('.nerds-row');
        if (btnNerds && nerdsRow) {
            btnNerds.addEventListener('click', () => {
                nerdsRow.classList.toggle('mf-hidden');
                btnNerds.innerHTML = nerdsRow.classList.contains('mf-hidden') ? 'Cálculos para Nerds 📊' : 'Fechar Cálculos ✕';
            });
        }
    }

    calculate(source) {
        const cost = this.calc.parse(this.inputCost.value);
        const mlRate = this.calc.parse(this.inputMl.value) / 100;
        const tacosRate = this.calc.parse(this.inputTacos.value) / 100;
        const taxRate = this.calc.getGlobalTaxRate();
        const opRate = this.calc.getOpCostRate();
        const weightKey = this.inputWeight.value; // e.g., 'weight_0.3'

        let price = 0;
        let marginRate = 0;
        let freteObj = 0;

        // Tabela atualizada de Envios do Mercado Livre (Março 2026)
        // Linhas = peso, Colunas = faixas de preco (price ranges)
        const SHIPPING_MATRIX = {
            'weight_0.3': { '<19': 5.65, '<49': 6.55, '<79': 7.75, '<100': 12.35, '<120': 14.35, '<150': 16.45, '<200': 18.45, 'inf': 20.95 },
            'weight_0.5': { '<19': 5.95, '<49': 6.65, '<79': 7.85, '<100': 13.25, '<120': 15.45, '<150': 17.65, '<200': 19.85, 'inf': 22.55 },
            'weight_1': { '<19': 6.05, '<49': 6.75, '<79': 7.95, '<100': 13.85, '<120': 16.15, '<150': 18.45, '<200': 20.75, 'inf': 23.65 },
            'weight_1.5': { '<19': 6.15, '<49': 6.85, '<79': 8.05, '<100': 14.15, '<120': 16.45, '<150': 18.85, '<200': 21.15, 'inf': 24.65 },
            'weight_2': { '<19': 6.25, '<49': 6.95, '<79': 8.15, '<100': 14.45, '<120': 16.85, '<150': 19.25, '<200': 21.65, 'inf': 24.65 },
            'weight_3': { '<19': 6.35, '<49': 7.95, '<79': 8.55, '<100': 15.75, '<120': 18.35, '<150': 21.05, '<200': 23.65, 'inf': 26.25 },
            'weight_4': { '<19': 6.45, '<49': 8.15, '<79': 8.95, '<100': 17.05, '<120': 19.85, '<150': 22.65, '<200': 25.55, 'inf': 28.35 },
            'weight_5': { '<19': 6.55, '<49': 8.35, '<79': 9.75, '<100': 18.45, '<120': 21.55, '<150': 24.65, '<200': 27.75, 'inf': 30.75 },
            'weight_6': { '<19': 6.65, '<49': 8.55, '<79': 9.95, '<100': 25.45, '<120': 28.55, '<150': 32.65, '<200': 35.75, 'inf': 39.75 },
            'weight_7': { '<19': 6.75, '<49': 8.75, '<79': 10.15, '<100': 27.05, '<120': 31.05, '<150': 36.05, '<200': 40.05, 'inf': 44.05 },
            'weight_8': { '<19': 6.85, '<49': 8.95, '<79': 10.35, '<100': 28.85, '<120': 33.65, '<150': 38.45, '<200': 43.25, 'inf': 48.05 },
            'weight_9': { '<19': 6.95, '<49': 9.15, '<79': 10.55, '<100': 29.65, '<120': 34.55, '<150': 39.55, '<200': 44.45, 'inf': 49.35 },
            'weight_11': { '<19': 7.05, '<49': 9.55, '<79': 10.95, '<100': 41.25, '<120': 48.05, '<150': 54.95, '<200': 61.75, 'inf': 68.65 },
            'weight_13': { '<19': 7.15, '<49': 9.95, '<79': 11.35, '<100': 42.15, '<120': 49.25, '<150': 56.25, '<200': 63.25, 'inf': 70.25 },
            'weight_15': { '<19': 7.25, '<49': 10.15, '<79': 11.55, '<100': 45.05, '<120': 52.45, '<150': 59.95, '<200': 67.45, 'inf': 74.95 },
            'weight_17': { '<19': 7.35, '<49': 10.35, '<79': 11.75, '<100': 48.55, '<120': 56.05, '<150': 63.55, '<200': 70.75, 'inf': 78.65 },
            'weight_20': { '<19': 7.45, '<49': 10.55, '<79': 11.95, '<100': 54.75, '<120': 63.85, '<150': 72.95, '<200': 82.05, 'inf': 91.15 },
            'weight_25': { '<19': 7.65, '<49': 10.95, '<79': 12.15, '<100': 64.05, '<120': 75.05, '<150': 84.75, '<200': 95.35, 'inf': 105.95 },
            'weight_30': { '<19': 7.75, '<49': 11.15, '<79': 12.35, '<100': 65.95, '<120': 75.45, '<150': 85.55, '<200': 96.25, 'inf': 106.95 },
            'weight_40': { '<19': 7.85, '<49': 11.35, '<79': 12.55, '<100': 67.75, '<120': 78.95, '<150': 88.95, '<200': 99.15, 'inf': 107.05 },
            'weight_50': { '<19': 7.95, '<49': 11.55, '<79': 12.75, '<100': 70.25, '<120': 81.05, '<150': 92.05, '<200': 102.55, 'inf': 110.75 },
            'weight_60': { '<19': 8.05, '<49': 11.75, '<79': 12.95, '<100': 74.95, '<120': 86.45, '<150': 98.15, '<200': 109.35, 'inf': 118.15 },
            'weight_70': { '<19': 8.15, '<49': 11.95, '<79': 13.15, '<100': 80.25, '<120': 92.95, '<150': 105.05, '<200': 117.15, 'inf': 126.55 },
            'weight_80': { '<19': 8.25, '<49': 12.15, '<79': 13.35, '<100': 83.95, '<120': 97.05, '<150': 109.85, '<200': 122.45, 'inf': 132.25 },
            'weight_90': { '<19': 8.35, '<49': 12.35, '<79': 13.55, '<100': 93.25, '<120': 107.45, '<150': 122.05, '<200': 136.05, 'inf': 146.95 },
            'weight_100': { '<19': 8.45, '<49': 12.55, '<79': 13.75, '<100': 106.55, '<120': 123.95, '<150': 139.55, '<200': 155.55, 'inf': 167.95 },
            'weight_125': { '<19': 8.55, '<49': 12.75, '<79': 13.95, '<100': 119.25, '<120': 138.05, '<150': 156.05, '<200': 173.95, 'inf': 187.95 },
            'weight_150': { '<19': 8.65, '<49': 12.75, '<79': 14.15, '<100': 126.55, '<120': 146.15, '<150': 165.65, '<200': 184.65, 'inf': 199.45 },
            'weight_inf': { '<19': 8.75, '<49': 12.95, '<79': 14.35, '<100': 166.15, '<120': 192.45, '<150': 217.55, '<200': 242.55, 'inf': 261.95 }
        };

        const calcFreteML = (precoVenda) => {
            if (precoVenda <= 0) return 0;
            const row = SHIPPING_MATRIX[weightKey] || SHIPPING_MATRIX['weight_0.3'];
            let baseFrete = 0;

            if (precoVenda < 19) baseFrete = row['<19'];
            else if (precoVenda < 49) baseFrete = row['<49'];
            else if (precoVenda < 79) baseFrete = row['<79'];
            else if (precoVenda < 100) baseFrete = row['<100'];
            else if (precoVenda < 120) baseFrete = row['<120'];
            else if (precoVenda < 150) baseFrete = row['<150'];
            else if (precoVenda < 200) baseFrete = row['<200'];
            else baseFrete = row['inf'];

            // Regra do Teto de 50% para produtos menores que R$ 19,00
            if (precoVenda < 19 && baseFrete > (precoVenda * 0.5)) {
                return precoVenda * 0.5;
            }
            return baseFrete;
        };

        if (source === 'price') {
            // User typed price -> calculate margin
            price = this.calc.parse(this.inputPrice.value);
            freteObj = calcFreteML(price);
            if (price > 0) {
                marginRate = 1 - ((cost + freteObj) / price) - mlRate - taxRate - tacosRate - opRate;
            }
            this.updateMarginUI(marginRate * 100);

        } else if (source === 'profit') {
            // User typed profit -> calculate price 
            const targetProfit = this.calc.parse(this.inputProfit.value);
            const denom = 1 - mlRate - taxRate - tacosRate - opRate;

            // Iterar para encontrar preço correto com frete pulando de tabela
            for (let i = 0; i < 15; i++) {
                if (denom > 0.01) {
                    price = (targetProfit + cost + freteObj) / denom;
                }
                freteObj = calcFreteML(price);
            }
            this.inputPrice.value = this.calc.fmtMoney(price);

            if (price > 0) {
                marginRate = targetProfit / price;
            }
            this.updateMarginUI(marginRate * 100);

        } else {
            // Margin driven -> calculate price
            marginRate = this.calc.parse(this.inputMargin.value) / 100;
            const denom = 1 - marginRate - mlRate - taxRate - tacosRate - opRate;

            // Iterar para encontrar preço correto com frete pulando de tabela
            for (let i = 0; i < 15; i++) {
                if (denom > 0.01) {
                    price = (cost + freteObj) / denom;
                }
                freteObj = calcFreteML(price);
            }
            this.inputPrice.value = this.calc.fmtMoney(price);
        }

        // Atualizar campo de frete de leitura com valor calculado (seja teto ou matriz)
        this.inputFrete.value = this.calc.fmtMoney(freteObj);

        // === DERIVED VALUES ===
        const commissionVal = price * mlRate;
        const commissionPerc = price > 0 ? (commissionVal / price) : 0;
        const taxesVal = price * taxRate;
        const tacosVal = price * tacosRate;
        const opCostVal = price * opRate;

        // Profit
        const profitNet = price * marginRate;
        if (source !== 'profit') {
            this.inputProfit.value = this.calc.fmtMoney(profitNet);
        }

        // Contribution Margin = (Price - Variable Costs) / Price
        const variableCosts = cost + freteObj + commissionVal + taxesVal + tacosVal;
        const contribRate = price > 0 ? ((price - variableCosts) / price) : 0;
        this.outputContrib.value = this.calc.fmtPerc(contribRate * 100);

        // ROI = Profit / Cost
        const roi = cost > 0 ? (profitNet / cost) * 100 : 0;
        this.outputRoi.value = this.calc.fmtPerc(roi);

        // Gross Profit = Price - Cost - Commission
        const grossProfit = price - cost - commissionVal;

        // Gross Profit After Tax
        const grossAfterTax = grossProfit - taxesVal;

        // Nerd outputs
        this.outputCommissionVal.textContent = 'R$ ' + this.calc.fmtMoney(commissionVal);
        this.outputCommissionPerc.textContent = this.calc.fmtPerc(commissionPerc * 100);
        this.outputTaxesVal.textContent = 'R$ ' + this.calc.fmtMoney(taxesVal);
        this.outputGross.textContent = 'R$ ' + this.calc.fmtMoney(grossProfit);
        this.outputGrossAfterTax.textContent = 'R$ ' + this.calc.fmtMoney(grossAfterTax);
        this.outputOpCost.textContent = 'R$ ' + this.calc.fmtMoney(opCostVal);
    }

    updateMarginUI(val) {
        const v = val.toFixed(2);
        if (document.activeElement !== this.inputMargin) {
            this.inputMargin.value = v;
        }
        this.inputMarginSlider.value = v;
    }
}

// Initialize
const initCalculator = () => {
    if (document.getElementById('products-container') && !window.mfCalcInitialized) {
        window.mfCalcInitialized = true;
        new Calculator();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
} else {
    // DOM já carregou, executa direto! Importante para WordPress.
    initCalculator();
}
