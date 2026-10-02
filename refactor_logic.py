import sys

path = r"c:\Users\Lucas Sertori\Documents\site-marketfacil\js\calc-shopee.js"
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Replace Product class logic
start_str = "class Product {"
# We find where Product ends by looking for Modal logic
end_str = "// Modal logic for Ads popup"

start_idx = text.find(start_str)
end_idx = text.find(end_str)

new_product_class = """class Product {
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
"""

text = text[:start_idx] + new_product_class + text[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(text)

