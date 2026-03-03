// =============================================
// CALCULADORA ML - JAVASCRIPT
// =============================================

// Tabela atualizada de Envios do Mercado Livre (Março 2026)
// Linhas = peso, Colunas = faixas de preco (price ranges)

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
        this.globalCpf = document.getElementById('global-cpf');
        this.globalPix = document.getElementById('global-pix');

        this.init();
    }

    init() {
        // Add first product
        this.addProduct();

        // Add product button
        document.getElementById('btn-add-product').addEventListener('click', () => this.addProduct());

        // Advanced Mode toggle
        const advancedToggle = document.getElementById('advanced-mode');
        advancedToggle.addEventListener('change', () => {
            document.querySelector('.mf-calc').classList.toggle('advanced', advancedToggle.checked);
        });

        // Recommendations Mode toggle
        const recToggle = document.getElementById('recommendations-mode');
        if (recToggle) {
            // Apply initial state if already checked
            document.querySelector('.mf-calc').classList.toggle('recommendations-active', recToggle.checked);

            recToggle.addEventListener('change', () => {
                document.querySelector('.mf-calc').classList.toggle('recommendations-active', recToggle.checked);
                this.updateOpCost();   // Force visual update on global inputs
                this.recalculateAll(); // Force visual update on all products
            });
        }

        // Export CSV
        document.getElementById('btn-export').addEventListener('click', () => this.exportCSV());

        // Global inputs
        [this.globalRevenue, this.globalFixedCost, this.globalTax, this.globalCpf, this.globalPix].forEach(el => {
            if (!el) return;
            el.addEventListener('input', () => {
                this.updateOpCost();
                this.recalculateAll();
            });
        });

        this.updateOpCost();
    }

    exportCSV() {
        const headers = ['SKU', 'Custo', 'Shopee%', 'TaxaFixa(R$)', 'TACOS%', 'Margem%', 'Contrib%', 'Preco', 'Lucro', 'ROI%'];
        const rows = this.products.map(p => {
            return [
                p.element.querySelector('.input-sku')?.value || '',
                p.element.querySelector('.input-cost')?.value || '0',
                p.element.querySelector('.input-shopee-comm')?.value || '0',
                p.element.querySelector('.input-shopee-fixed')?.value || '0',
                p.element.querySelector('.input-tacos')?.value || '0',
                p.element.querySelector('.input-margin')?.value || '27',
                p.element.querySelector('.output-contrib')?.value || '0%',
                p.element.querySelector('.input-price')?.value || '0',
                p.element.querySelector('.input-profit')?.value || '0',
                p.element.querySelector('.input-roi')?.value || '0'
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
            navigator.msSaveBlob(blob, 'precos-shopee.csv');
        } else {
            // Other browsers
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'precos-shopee.csv');
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

    isCpfActive() { return this.globalCpf && this.globalCpf.checked; }
    isPixActive() { return this.globalPix && this.globalPix.checked; }

    getOpCostRate() {
        const rev = this.getGlobalRevenue();
        const fixed = this.getGlobalFixedCost();
        return rev > 0 ? fixed / rev : 0;
    }

    recalculateAll() {
        this.products.forEach(p => p.calculate('margin'));
    }

    updateOpCost() {
        const rate = this.getOpCostRate() * 100;
        this.globalOpCost.value = this.fmtPerc(rate);

        // Marketfacil recommendation: Op Cost <= 10%
        if (rate > 10.01) {
            this.globalOpCost.parentElement.classList.add('mf-warning');
            this.globalOpCost.parentElement.classList.remove('mf-healthy');
        } else {
            this.globalOpCost.parentElement.classList.remove('mf-warning');
            this.globalOpCost.parentElement.classList.add('mf-healthy');
        }
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
        this.inputShopeeComm = element.querySelector('.input-shopee-comm');
        this.inputShopeeFixed = element.querySelector('.input-shopee-fixed');
        this.inputTacos = element.querySelector('.input-tacos');
        this.inputMarginSlider = element.querySelector('.input-margin-slider');
        this.inputMargin = element.querySelector('.input-margin');
        this.inputPrice = element.querySelector('.input-price');
        this.inputProfit = element.querySelector('.input-profit');
        this.inputRoi = element.querySelector('.input-roi');

        // Outputs
        this.outputContrib = element.querySelector('.output-contrib');
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
        [this.inputCost, this.inputTacos].forEach(el => {
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

        // ROI -> recalculate price and profit
        this.inputRoi.addEventListener('input', () => this.calculate('roi'));

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

    getShopeeFees(price) {
        if (price <= 0) return { commRate: 0, fixedFee: 0 };

        let commRate = price < 80 ? 0.20 : 0.14;
        let fixedFee = 0;

        if (price < 8) fixedFee = price * 0.50;
        else if (price < 12) fixedFee = 4.00 + (price * 0.05);
        else if (price < 80) fixedFee = 4.00;
        else if (price < 100) fixedFee = 16.00;
        else if (price < 200) fixedFee = 20.00;
        else fixedFee = 26.00;

        if (this.calc.isCpfActive()) {
            fixedFee += 3.00;
        }

        if (this.calc.isPixActive() && price >= 80) {
            if (price < 500) commRate -= 0.05;
            else commRate -= 0.08;

            // Garantir que a comissão não zere bizarramente em cenários futuros
            if (commRate < 0) commRate = 0;
        }

        return { commRate, fixedFee };
    }

    calculate(source) {
        const cost = this.calc.parse(this.inputCost.value);
        const tacosRate = this.calc.parse(this.inputTacos.value) / 100;
        const taxRate = this.calc.getGlobalTaxRate();
        const opRate = this.calc.getOpCostRate();

        let price = 0;
        let marginRate = 0;
        let shopeeFees = { commRate: 0, fixedFee: 0 };

        if (source === 'price') {
            price = this.calc.parse(this.inputPrice.value);
            shopeeFees = this.getShopeeFees(price);
            if (price > 0) {
                // Margin = 1 - (Cost + FixedFee)/Price - CommRate - Tax - Tacos - OpCost
                marginRate = 1 - ((cost + shopeeFees.fixedFee) / price) - shopeeFees.commRate - taxRate - tacosRate - opRate;
            }
            this.updateMarginUI(marginRate * 100);

        } else if (source === 'profit') {
            const targetProfit = this.calc.parse(this.inputProfit.value);

            for (let i = 0; i < 20; i++) {
                let denom = 1 - shopeeFees.commRate - taxRate - tacosRate - opRate;
                if (denom > 0.01) {
                    price = (targetProfit + cost + shopeeFees.fixedFee) / denom;
                }
                shopeeFees = this.getShopeeFees(price);
            }
            this.inputPrice.value = this.calc.fmtMoney(price);

            if (price > 0) {
                marginRate = targetProfit / price;
            }
            this.updateMarginUI(marginRate * 100);

        } else if (source === 'roi') {
            const targetRoi = this.calc.parse(this.inputRoi.value) / 100;
            const targetProfit = targetRoi * cost;

            for (let i = 0; i < 20; i++) {
                let denom = 1 - shopeeFees.commRate - taxRate - tacosRate - opRate;
                if (denom > 0.01) {
                    price = (targetProfit + cost + shopeeFees.fixedFee) / denom;
                }
                shopeeFees = this.getShopeeFees(price);
            }
            this.inputPrice.value = this.calc.fmtMoney(price);

            if (price > 0) {
                marginRate = targetProfit / price;
            }
            this.updateMarginUI(marginRate * 100);

        } else {
            // Margin driven
            marginRate = this.calc.parse(this.inputMargin.value) / 100;

            for (let i = 0; i < 20; i++) {
                let denom = 1 - marginRate - shopeeFees.commRate - taxRate - tacosRate - opRate;
                if (denom > 0.01) {
                    price = (cost + shopeeFees.fixedFee) / denom;
                }
                shopeeFees = this.getShopeeFees(price);
            }
            this.inputPrice.value = this.calc.fmtMoney(price);
        }

        // Atualizar campos de visualização da Shopee
        if (this.inputShopeeComm) this.inputShopeeComm.value = (shopeeFees.commRate * 100).toFixed(0) + '%';
        if (this.inputShopeeFixed) this.inputShopeeFixed.value = this.calc.fmtMoney(shopeeFees.fixedFee);

        // === DERIVED VALUES ===
        const commissionVal = (price * shopeeFees.commRate) + shopeeFees.fixedFee;
        const commissionPerc = price > 0 ? (commissionVal / price) : 0;
        const taxesVal = price * taxRate;
        const tacosVal = price * tacosRate;
        const opCostVal = price * opRate;

        // Profit
        const profitNet = price * marginRate;
        if (source !== 'profit') {
            this.inputProfit.value = this.calc.fmtMoney(profitNet);
        }

        const variableCosts = cost + commissionVal + taxesVal + tacosVal;
        const contribRate = price > 0 ? ((price - variableCosts) / price) : 0;
        this.outputContrib.value = this.calc.fmtPerc(contribRate * 100);

        // ROI
        const roi = cost > 0 ? (profitNet / cost) * 100 : 0;
        if (source !== 'roi' && document.activeElement !== this.inputRoi) {
            this.inputRoi.value = roi.toFixed(1);
        }

        // Gross Profit 
        const grossProfit = price - cost - commissionVal;
        const grossAfterTax = grossProfit - taxesVal;

        // Nerd outputs
        this.outputCommissionVal.textContent = 'R$ ' + this.calc.fmtMoney(commissionVal);
        this.outputCommissionPerc.textContent = this.calc.fmtPerc(commissionPerc * 100);
        this.outputTaxesVal.textContent = 'R$ ' + this.calc.fmtMoney(taxesVal);
        this.outputGross.textContent = 'R$ ' + this.calc.fmtMoney(grossProfit);
        this.outputGrossAfterTax.textContent = 'R$ ' + this.calc.fmtMoney(grossAfterTax);
        this.outputOpCost.textContent = 'R$ ' + this.calc.fmtMoney(opCostVal);

        // Marketfacil recommendations
        if (contribRate < 0.1999) {
            this.outputContrib.parentElement.classList.add('mf-warning');
            this.outputContrib.parentElement.classList.remove('mf-healthy');
        } else {
            this.outputContrib.parentElement.classList.remove('mf-warning');
            this.outputContrib.parentElement.classList.add('mf-healthy');
        }

        if (marginRate < 0.0999) {
            this.inputProfit.closest('.result-box').classList.add('mf-warning');
            this.inputMargin.closest('.mf-field').classList.add('mf-warning');
            this.inputProfit.closest('.result-box').classList.remove('mf-healthy');
            this.inputMargin.closest('.mf-field').classList.remove('mf-healthy');
        } else {
            this.inputProfit.closest('.result-box').classList.remove('mf-warning');
            this.inputMargin.closest('.mf-field').classList.remove('mf-warning');
            this.inputProfit.closest('.result-box').classList.add('mf-healthy');
            this.inputMargin.closest('.mf-field').classList.add('mf-healthy');
        }
    }

    updateMarginUI(val) {
        const v = val.toFixed(2);
        if (document.activeElement !== this.inputMargin) {
            this.inputMargin.value = v;
        }
        this.inputMarginSlider.value = v;
    }
}
// Modal logic for Ads popup
function openAdsModal() {
    const modal = document.getElementById('mf-ads-modal');
    if (modal) modal.classList.add('active');
}

function closeAdsModal() {
    const modal = document.getElementById('mf-ads-modal');
    if (modal) modal.classList.remove('active');
}

// Close modal if clicked outside of content
window.addEventListener('click', (event) => {
    const modal = document.getElementById('mf-ads-modal');
    if (event.target === modal) {
        closeAdsModal();
    }
});

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
