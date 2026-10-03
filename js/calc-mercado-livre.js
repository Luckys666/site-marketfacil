// =============================================
// CALCULADORA ML - JAVASCRIPT
// =============================================

// Tabela atualizada de Envios do Mercado Livre (lida da Central de Ajuda em 02/10/2026)
// Linhas = peso, Colunas = faixas de preco (price ranges)
const MATRICES = {
    'default': {
        'weight_0.3': { '<19': 5.65, '<49': 6.85, '<79': 8.15, '<100': 12.95, '<120': 14.95, '<150': 16.95, '<200': 19.05, 'inf': 21.65 },
        'weight_0.5': { '<19': 5.95, '<49': 6.95, '<79': 8.25, '<100': 13.85, '<120': 16.15, '<150': 18.15, '<200': 20.45, 'inf': 23.25 },
        'weight_1': { '<19': 6.05, '<49': 7.15, '<79': 8.45, '<100': 14.45, '<120': 16.85, '<150': 19.05, '<200': 21.35, 'inf': 24.45 },
        'weight_1.5': { '<19': 6.15, '<49': 7.35, '<79': 8.65, '<100': 14.75, '<120': 17.15, '<150': 19.45, '<200': 21.75, 'inf': 25.45 },
        'weight_2': { '<19': 6.25, '<49': 7.45, '<79': 8.75, '<100': 15.05, '<120': 17.65, '<150': 19.85, '<200': 22.25, 'inf': 25.55 },
        'weight_3': { '<19': 6.35, '<49': 8.65, '<79': 9.15, '<100': 16.45, '<120': 19.15, '<150': 21.65, '<200': 24.35, 'inf': 27.05 },
        'weight_4': { '<19': 6.45, '<49': 8.75, '<79': 9.75, '<100': 17.85, '<120': 20.75, '<150': 23.35, '<200': 26.35, 'inf': 29.25 },
        'weight_5': { '<19': 6.55, '<49': 8.85, '<79': 10.25, '<100': 19.75, '<120': 22.85, '<150': 26.05, '<200': 29.25, 'inf': 32.45 },
        'weight_6': { '<19': 6.65, '<49': 8.95, '<79': 10.35, '<100': 25.95, '<120': 29.15, '<150': 33.35, '<200': 36.45, 'inf': 40.85 },
        'weight_7': { '<19': 6.75, '<49': 9.05, '<79': 10.45, '<100': 27.55, '<120': 31.65, '<150': 36.75, '<200': 40.85, 'inf': 45.25 },
        'weight_8': { '<19': 6.85, '<49': 9.25, '<79': 10.55, '<100': 29.45, '<120': 34.35, '<150': 39.25, '<200': 44.15, 'inf': 49.35 },
        'weight_9': { '<19': 6.95, '<49': 9.35, '<79': 10.65, '<100': 30.25, '<120': 35.25, '<150': 40.35, '<200': 45.35, 'inf': 50.75 },
        'weight_10': { '<19': 7.05, '<49': 9.45, '<79': 10.85, '<100': 38.25, '<120': 45.05, '<150': 51.95, '<200': 58.75, 'inf': 65.85 },
        'weight_11': { '<19': 7.05, '<49': 9.65, '<79': 11.05, '<100': 41.65, '<120': 48.55, '<150': 55.45, '<200': 62.35, 'inf': 69.35 },
        'weight_13': { '<19': 7.15, '<49': 10.05, '<79': 11.45, '<100': 42.55, '<120': 49.75, '<150': 56.85, '<200': 63.85, 'inf': 70.95 },
        'weight_15': { '<19': 7.25, '<49': 10.25, '<79': 11.65, '<100': 45.55, '<120': 52.95, '<150': 60.55, '<200': 68.15, 'inf': 75.65 },
        'weight_17': { '<19': 7.35, '<49': 10.45, '<79': 11.85, '<100': 48.95, '<120': 56.55, '<150': 64.05, '<200': 71.35, 'inf': 79.35 },
        'weight_20': { '<19': 7.45, '<49': 10.65, '<79': 12.05, '<100': 55.15, '<120': 64.35, '<150': 73.55, '<200': 82.75, 'inf': 91.95 },
        'weight_25': { '<19': 7.65, '<49': 11.05, '<79': 12.25, '<100': 64.55, '<120': 75.75, '<150': 85.45, '<200': 96.25, 'inf': 106.85 },
        'weight_30': { '<19': 7.75, '<49': 11.25, '<79': 12.45, '<100': 66.45, '<120': 76.05, '<150': 86.25, '<200': 97.15, 'inf': 107.85 },
        'weight_40': { '<19': 7.85, '<49': 11.45, '<79': 12.65, '<100': 68.35, '<120': 79.65, '<150': 89.75, '<200': 100.05, 'inf': 107.95 },
        'weight_50': { '<19': 7.95, '<49': 11.65, '<79': 12.85, '<100': 70.95, '<120': 81.85, '<150': 92.85, '<200': 103.45, 'inf': 111.65 },
        'weight_60': { '<19': 8.05, '<49': 11.85, '<79': 13.05, '<100': 75.55, '<120': 87.25, '<150': 99.05, '<200': 110.25, 'inf': 119.05 },
        'weight_70': { '<19': 8.15, '<49': 12.05, '<79': 13.25, '<100': 80.95, '<120': 93.75, '<150': 105.95, '<200': 118.05, 'inf': 127.45 },
        'weight_80': { '<19': 8.25, '<49': 12.25, '<79': 13.45, '<100': 84.65, '<120': 97.95, '<150': 110.75, '<200': 123.35, 'inf': 133.15 },
        'weight_90': { '<19': 8.35, '<49': 12.45, '<79': 13.65, '<100': 94.05, '<120': 108.35, '<150': 122.95, '<200': 136.95, 'inf': 147.85 },
        'weight_100': { '<19': 8.45, '<49': 12.65, '<79': 13.85, '<100': 107.45, '<120': 124.85, '<150': 140.45, '<200': 156.45, 'inf': 168.85 },
        'weight_125': { '<19': 8.55, '<49': 12.85, '<79': 14.05, '<100': 120.15, '<120': 138.95, '<150': 156.95, '<200': 174.85, 'inf': 188.85 },
        'weight_150': { '<19': 8.65, '<49': 12.85, '<79': 14.25, '<100': 127.45, '<120': 147.05, '<150': 166.55, '<200': 185.55, 'inf': 200.35 },
        'weight_inf': { '<19': 8.75, '<49': 12.85, '<79': 14.45, '<100': 167.05, '<120': 193.35, '<150': 218.45, '<200': 243.45, 'inf': 262.85 }
    },
    'full_super': {
        'weight_0.3': { '<19': 1.00, '<29': 1.20, '<49': 1.60, '<79': 2.40, '<99': 3.20, '<199': 4.80, 'inf': 21.65 },
        'weight_0.5': { '<19': 1.00, '<29': 1.20, '<49': 1.60, '<79': 2.40, '<99': 3.20, '<199': 4.80, 'inf': 23.25 },
        'weight_1': { '<19': 1.00, '<29': 1.20, '<49': 1.60, '<79': 2.40, '<99': 3.20, '<199': 4.80, 'inf': 24.45 },
        'weight_1.5': { '<19': 1.40, '<29': 1.60, '<49': 2.00, '<79': 2.80, '<99': 3.60, '<199': 5.20, 'inf': 25.45 },
        'weight_2': { '<19': 1.40, '<29': 1.60, '<49': 2.00, '<79': 2.80, '<99': 3.60, '<199': 5.20, 'inf': 25.55 },
        'weight_3': { '<19': 1.80, '<29': 2.25, '<49': 2.70, '<79': 3.60, '<99': 4.50, '<199': 6.30, 'inf': 27.05 },
        'weight_4': { '<19': 1.80, '<29': 2.25, '<49': 2.70, '<79': 3.60, '<99': 4.50, '<199': 6.30, 'inf': 29.25 },
        'weight_5': { '<19': 2.75, '<29': 3.85, '<49': 4.40, '<79': 5.50, '<99': 6.60, '<199': 8.25, 'inf': 32.45 },
        'weight_6': { '<19': 2.75, '<29': 3.85, '<49': 4.40, '<79': 5.50, '<99': 6.60, '<199': 8.25, 'inf': 40.85 },
        'weight_7': { '<19': 4.40, '<29': 5.50, '<49': 6.05, '<79': 7.15, '<99': 7.70, '<199': 8.25, 'inf': 45.25 },
        'weight_8': { '<19': 4.40, '<29': 5.50, '<49': 6.05, '<79': 7.15, '<99': 7.70, '<199': 8.25, 'inf': 49.35 },
        'weight_9': { '<19': 5.00, '<29': 7.50, '<49': 9.10, '<79': 9.80, '<99': 10.50, '<199': 11.20, 'inf': 50.75 },
        'weight_10': { '<19': 5.00, '<29': 7.50, '<49': 9.10, '<79': 9.80, '<99': 10.50, '<199': 11.20, 'inf': 65.85 },
        'weight_11': { '<19': 5.00, '<29': 7.50, '<49': 9.10, '<79': 9.80, '<99': 10.50, '<199': 11.20, 'inf': 69.35 },
        'weight_13': { '<19': 5.00, '<29': 7.50, '<49': 9.10, '<79': 9.80, '<99': 10.50, '<199': 11.20, 'inf': 70.95 },
        'weight_15': { '<19': 5.00, '<29': 7.50, '<49': 9.10, '<79': 9.80, '<99': 10.50, '<199': 11.20, 'inf': 75.65 },
        'weight_17': { '<19': 5.00, '<29': 7.50, '<49': 10.35, '<79': 11.75, '<99': 15.00, '<199': 16.00, 'inf': 79.35 },
        'weight_20': { '<19': 5.00, '<29': 7.50, '<49': 10.55, '<79': 11.95, '<99': 15.00, '<199': 16.00, 'inf': 91.95 },
        'weight_25': { '<19': 5.00, '<29': 7.50, '<49': 10.95, '<79': 12.15, '<99': 15.00, '<199': 16.00, 'inf': 106.85 },
        'weight_30': { '<19': 5.00, '<29': 7.50, '<49': 11.15, '<79': 12.35, '<99': 15.00, '<199': 16.00, 'inf': 107.85 },
        'weight_40': { '<19': 5.00, '<29': 7.50, '<49': 11.35, '<79': 12.55, '<99': 15.00, '<199': 16.00, 'inf': 107.95 },
        'weight_50': { '<19': 5.00, '<29': 7.50, '<49': 11.55, '<79': 12.75, '<99': 18.75, '<199': 20.00, 'inf': 111.65 },
        'weight_60': { '<19': 5.00, '<29': 7.50, '<49': 11.75, '<79': 12.95, '<99': 18.75, '<199': 20.00, 'inf': 119.05 },
        'weight_70': { '<19': 5.00, '<29': 7.50, '<49': 11.95, '<79': 13.15, '<99': 18.75, '<199': 20.00, 'inf': 127.45 },
        'weight_80': { '<19': 5.00, '<29': 7.50, '<49': 12.15, '<79': 13.35, '<99': 18.75, '<199': 20.00, 'inf': 133.15 },
        'weight_90': { '<19': 5.00, '<29': 7.50, '<49': 12.35, '<79': 13.55, '<99': 18.75, '<199': 20.00, 'inf': 147.85 },
        'weight_100': { '<19': 5.00, '<29': 7.50, '<49': 12.55, '<79': 13.75, '<99': 18.75, '<199': 20.00, 'inf': 168.85 },
        'weight_125': { '<19': 5.00, '<29': 7.50, '<49': 12.75, '<79': 13.95, '<99': 18.75, '<199': 20.00, 'inf': 188.85 },
        'weight_150': { '<19': 5.00, '<29': 7.50, '<49': 12.75, '<79': 14.15, '<99': 18.75, '<199': 20.00, 'inf': 200.35 },
        'weight_inf': { '<19': 5.00, '<29': 7.50, '<49': 12.75, '<79': 14.35, '<99': 18.75, '<199': 20.00, 'inf': 262.85 }
    },
    'livros': {
        'weight_0.3': { '<19': 2.82, '<49': 3.43, '<79': 4.07, '<100': 12.95, '<120': 14.95, '<150': 16.95, '<200': 19.05, 'inf': 21.65 },
        'weight_0.5': { '<19': 2.98, '<49': 3.48, '<79': 4.13, '<100': 13.85, '<120': 16.15, '<150': 18.15, '<200': 20.45, 'inf': 23.25 },
        'weight_1': { '<19': 3.02, '<49': 3.57, '<79': 4.22, '<100': 14.45, '<120': 16.85, '<150': 19.05, '<200': 21.35, 'inf': 24.45 },
        'weight_1.5': { '<19': 3.08, '<49': 3.68, '<79': 4.33, '<100': 14.75, '<120': 17.15, '<150': 19.45, '<200': 21.75, 'inf': 25.45 },
        'weight_2': { '<19': 3.13, '<49': 3.72, '<79': 4.38, '<100': 15.05, '<120': 17.65, '<150': 19.85, '<200': 22.25, 'inf': 25.55 },
        'weight_3': { '<19': 3.17, '<49': 4.33, '<79': 4.57, '<100': 16.45, '<120': 19.15, '<150': 21.65, '<200': 24.35, 'inf': 27.05 },
        'weight_4': { '<19': 3.22, '<49': 4.38, '<79': 4.88, '<100': 17.85, '<120': 20.75, '<150': 23.35, '<200': 26.35, 'inf': 29.25 },
        'weight_5': { '<19': 3.28, '<49': 4.42, '<79': 5.12, '<100': 19.75, '<120': 22.85, '<150': 26.05, '<200': 29.25, 'inf': 32.45 },
        'weight_6': { '<19': 3.33, '<49': 4.48, '<79': 5.18, '<100': 25.95, '<120': 29.15, '<150': 33.35, '<200': 36.45, 'inf': 40.85 },
        'weight_7': { '<19': 3.37, '<49': 4.53, '<79': 5.23, '<100': 27.55, '<120': 31.65, '<150': 36.75, '<200': 40.85, 'inf': 45.25 },
        'weight_8': { '<19': 3.43, '<49': 4.62, '<79': 5.27, '<100': 29.45, '<120': 34.35, '<150': 39.25, '<200': 44.15, 'inf': 49.35 },
        'weight_9': { '<19': 3.48, '<49': 4.68, '<79': 5.32, '<100': 30.25, '<120': 35.25, '<150': 40.35, '<200': 45.35, 'inf': 50.75 },
        'weight_10': { '<19': 3.52, '<49': 4.73, '<79': 5.43, '<100': 38.25, '<120': 45.05, '<150': 51.95, '<200': 58.75, 'inf': 65.85 },
        'weight_11': { '<19': 3.52, '<49': 4.83, '<79': 5.53, '<100': 41.65, '<120': 48.55, '<150': 55.45, '<200': 62.35, 'inf': 69.35 },
        'weight_13': { '<19': 3.57, '<49': 5.03, '<79': 5.73, '<100': 42.55, '<120': 49.75, '<150': 56.85, '<200': 63.85, 'inf': 70.95 },
        'weight_15': { '<19': 3.63, '<49': 5.12, '<79': 5.82, '<100': 45.55, '<120': 52.95, '<150': 60.55, '<200': 68.15, 'inf': 75.65 },
        'weight_17': { '<19': 3.68, '<49': 5.23, '<79': 5.93, '<100': 48.95, '<120': 56.55, '<150': 64.05, '<200': 71.35, 'inf': 79.35 },
        'weight_20': { '<19': 3.72, '<49': 5.32, '<79': 6.02, '<100': 55.15, '<120': 64.35, '<150': 73.55, '<200': 82.75, 'inf': 91.95 },
        'weight_25': { '<19': 3.83, '<49': 5.53, '<79': 6.13, '<100': 64.55, '<120': 75.75, '<150': 85.45, '<200': 96.25, 'inf': 106.85 },
        'weight_30': { '<19': 3.87, '<49': 5.62, '<79': 6.23, '<100': 66.45, '<120': 76.05, '<150': 86.25, '<200': 97.15, 'inf': 107.85 },
        'weight_40': { '<19': 3.92, '<49': 5.73, '<79': 6.32, '<100': 68.35, '<120': 79.65, '<150': 89.75, '<200': 100.05, 'inf': 107.95 },
        'weight_50': { '<19': 3.98, '<49': 5.82, '<79': 6.43, '<100': 70.95, '<120': 81.85, '<150': 92.85, '<200': 103.45, 'inf': 111.65 },
        'weight_60': { '<19': 4.03, '<49': 5.93, '<79': 6.52, '<100': 75.55, '<120': 87.25, '<150': 99.05, '<200': 110.25, 'inf': 119.05 },
        'weight_70': { '<19': 4.07, '<49': 6.02, '<79': 6.63, '<100': 80.95, '<120': 93.75, '<150': 105.95, '<200': 118.05, 'inf': 127.45 },
        'weight_80': { '<19': 4.13, '<49': 6.13, '<79': 6.72, '<100': 84.65, '<120': 97.95, '<150': 110.75, '<200': 123.35, 'inf': 133.15 },
        'weight_90': { '<19': 4.18, '<49': 6.23, '<79': 6.83, '<100': 94.05, '<120': 108.35, '<150': 122.95, '<200': 136.95, 'inf': 147.85 },
        'weight_100': { '<19': 4.22, '<49': 6.32, '<79': 6.93, '<100': 107.45, '<120': 124.85, '<150': 140.45, '<200': 156.45, 'inf': 168.85 },
        'weight_125': { '<19': 4.27, '<49': 6.43, '<79': 7.02, '<100': 120.15, '<120': 138.95, '<150': 156.95, '<200': 174.85, 'inf': 188.85 },
        'weight_150': { '<19': 4.33, '<49': 6.43, '<79': 7.13, '<100': 127.45, '<120': 147.05, '<150': 166.55, '<200': 185.55, 'inf': 200.35 },
        'weight_inf': { '<19': 4.38, '<49': 6.43, '<79': 7.22, '<100': 167.05, '<120': 193.35, '<150': 218.45, '<200': 243.45, 'inf': 262.85 }
    },
    'especiais': {
        'weight_0.3': { '<19': 5.65, '<49': 6.85, '<79': 8.15, '<100': 19.43, '<120': 22.43, '<150': 25.43, '<200': 28.58, 'inf': 32.48 },
        'weight_0.5': { '<19': 5.95, '<49': 6.95, '<79': 8.25, '<100': 20.78, '<120': 24.23, '<150': 27.23, '<200': 30.68, 'inf': 34.88 },
        'weight_1': { '<19': 6.05, '<49': 7.15, '<79': 8.45, '<100': 21.68, '<120': 25.28, '<150': 28.58, '<200': 32.03, 'inf': 36.68 },
        'weight_1.5': { '<19': 6.15, '<49': 7.35, '<79': 8.65, '<100': 22.13, '<120': 25.73, '<150': 29.18, '<200': 32.63, 'inf': 38.18 },
        'weight_2': { '<19': 6.25, '<49': 7.45, '<79': 8.75, '<100': 22.58, '<120': 26.48, '<150': 29.78, '<200': 33.38, 'inf': 38.33 },
        'weight_3': { '<19': 6.35, '<49': 8.65, '<79': 9.15, '<100': 24.68, '<120': 28.73, '<150': 32.48, '<200': 36.53, 'inf': 40.58 },
        'weight_4': { '<19': 6.45, '<49': 8.75, '<79': 9.75, '<100': 26.78, '<120': 31.13, '<150': 35.03, '<200': 39.53, 'inf': 43.88 },
        'weight_5': { '<19': 6.55, '<49': 8.85, '<79': 10.25, '<100': 29.63, '<120': 34.28, '<150': 39.08, '<200': 43.88, 'inf': 48.68 },
        'weight_6': { '<19': 6.65, '<49': 8.95, '<79': 10.35, '<100': 38.93, '<120': 43.73, '<150': 50.03, '<200': 54.68, 'inf': 61.28 },
        'weight_7': { '<19': 6.75, '<49': 9.05, '<79': 10.45, '<100': 41.33, '<120': 47.48, '<150': 55.13, '<200': 61.28, 'inf': 67.88 },
        'weight_8': { '<19': 6.85, '<49': 9.25, '<79': 10.55, '<100': 44.18, '<120': 51.53, '<150': 58.88, '<200': 66.23, 'inf': 74.03 },
        'weight_9': { '<19': 6.95, '<49': 9.35, '<79': 10.65, '<100': 45.38, '<120': 52.88, '<150': 60.53, '<200': 68.03, 'inf': 76.13 },
        'weight_10': { '<19': 7.05, '<49': 9.45, '<79': 10.85, '<100': 57.38, '<120': 67.58, '<150': 77.93, '<200': 88.13, 'inf': 98.78 },
        'weight_11': { '<19': 7.05, '<49': 9.65, '<79': 11.05, '<100': 62.48, '<120': 72.83, '<150': 83.18, '<200': 93.53, 'inf': 104.03 },
        'weight_13': { '<19': 7.15, '<49': 10.05, '<79': 11.45, '<100': 63.83, '<120': 74.63, '<150': 85.28, '<200': 95.78, 'inf': 106.43 },
        'weight_15': { '<19': 7.25, '<49': 10.25, '<79': 11.65, '<100': 68.33, '<120': 79.43, '<150': 90.83, '<200': 102.23, 'inf': 113.48 },
        'weight_17': { '<19': 7.35, '<49': 10.45, '<79': 11.85, '<100': 73.43, '<120': 84.83, '<150': 96.08, '<200': 107.03, 'inf': 119.03 },
        'weight_20': { '<19': 7.45, '<49': 10.65, '<79': 12.05, '<100': 82.73, '<120': 96.53, '<150': 110.33, '<200': 124.13, 'inf': 137.93 },
        'weight_25': { '<19': 7.65, '<49': 11.05, '<79': 12.25, '<100': 96.83, '<120': 113.63, '<150': 128.18, '<200': 144.38, 'inf': 160.28 },
        'weight_30': { '<19': 7.75, '<49': 11.25, '<79': 12.45, '<100': 99.68, '<120': 114.08, '<150': 129.38, '<200': 145.73, 'inf': 161.78 },
        'weight_40': { '<19': 7.85, '<49': 11.45, '<79': 12.65, '<100': 102.53, '<120': 119.48, '<150': 134.63, '<200': 150.08, 'inf': 161.93 },
        'weight_50': { '<19': 7.95, '<49': 11.65, '<79': 12.85, '<100': 106.43, '<120': 122.78, '<150': 139.28, '<200': 155.18, 'inf': 167.48 },
        'weight_60': { '<19': 8.05, '<49': 11.85, '<79': 13.05, '<100': 113.33, '<120': 130.88, '<150': 148.58, '<200': 165.38, 'inf': 178.58 },
        'weight_70': { '<19': 8.15, '<49': 12.05, '<79': 13.25, '<100': 121.43, '<120': 140.63, '<150': 158.93, '<200': 177.08, 'inf': 191.18 },
        'weight_80': { '<19': 8.25, '<49': 12.25, '<79': 13.45, '<100': 126.98, '<120': 146.93, '<150': 166.13, '<200': 185.03, 'inf': 199.73 },
        'weight_90': { '<19': 8.35, '<49': 12.45, '<79': 13.65, '<100': 141.08, '<120': 162.53, '<150': 184.43, '<200': 205.43, 'inf': 221.78 },
        'weight_100': { '<19': 8.45, '<49': 12.65, '<79': 13.85, '<100': 161.18, '<120': 187.28, '<150': 210.68, '<200': 234.68, 'inf': 253.28 },
        'weight_125': { '<19': 8.55, '<49': 12.85, '<79': 14.05, '<100': 180.23, '<120': 208.43, '<150': 235.43, '<200': 262.28, 'inf': 283.28 },
        'weight_150': { '<19': 8.65, '<49': 12.85, '<79': 14.25, '<100': 191.18, '<120': 220.58, '<150': 249.83, '<200': 278.33, 'inf': 300.53 },
        'weight_inf': { '<19': 8.75, '<49': 12.85, '<79': 14.45, '<100': 250.58, '<120': 290.03, '<150': 327.68, '<200': 365.18, 'inf': 394.28 }
    },
    'pets': {},
    'usados': {
        'weight_0.3': { '<19': 8.07, '<49': 9.79, '<79': 11.64, 'inf': 43.30 },
        'weight_0.5': { '<19': 8.50, '<49': 9.93, '<79': 11.79, 'inf': 46.50 },
        'weight_1': { '<19': 8.64, '<49': 10.21, '<79': 12.07, 'inf': 48.90 },
        'weight_1.5': { '<19': 8.79, '<49': 10.50, '<79': 12.36, 'inf': 50.90 },
        'weight_2': { '<19': 8.93, '<49': 10.64, '<79': 12.50, 'inf': 51.10 },
        'weight_3': { '<19': 9.07, '<49': 12.36, '<79': 13.07, 'inf': 54.10 },
        'weight_4': { '<19': 9.21, '<49': 12.50, '<79': 13.93, 'inf': 58.50 },
        'weight_5': { '<19': 9.36, '<49': 12.64, '<79': 14.64, 'inf': 64.90 },
        'weight_6': { '<19': 9.50, '<49': 12.79, '<79': 14.79, 'inf': 81.70 },
        'weight_7': { '<19': 9.64, '<49': 12.93, '<79': 14.93, 'inf': 90.50 },
        'weight_8': { '<19': 9.79, '<49': 13.21, '<79': 15.07, 'inf': 98.70 },
        'weight_9': { '<19': 9.93, '<49': 13.36, '<79': 15.21, 'inf': 101.50 },
        'weight_10': { '<19': 10.07, '<49': 13.50, '<79': 15.50, 'inf': 131.70 },
        'weight_11': { '<19': 10.07, '<49': 13.79, '<79': 15.79, 'inf': 138.70 },
        'weight_13': { '<19': 10.21, '<49': 14.36, '<79': 16.36, 'inf': 141.90 },
        'weight_15': { '<19': 10.36, '<49': 14.64, '<79': 16.64, 'inf': 151.30 },
        'weight_17': { '<19': 10.50, '<49': 14.93, '<79': 16.93, 'inf': 158.70 },
        'weight_20': { '<19': 10.64, '<49': 15.21, '<79': 17.21, 'inf': 183.90 },
        'weight_25': { '<19': 10.93, '<49': 15.79, '<79': 17.50, 'inf': 213.70 },
        'weight_30': { '<19': 11.07, '<49': 16.07, '<79': 17.79, 'inf': 215.70 },
        'weight_40': { '<19': 11.21, '<49': 16.36, '<79': 18.07, 'inf': 215.90 },
        'weight_50': { '<19': 11.36, '<49': 16.64, '<79': 18.36, 'inf': 223.30 },
        'weight_60': { '<19': 11.50, '<49': 16.93, '<79': 18.64, 'inf': 238.10 },
        'weight_70': { '<19': 11.64, '<49': 17.21, '<79': 18.93, 'inf': 254.90 },
        'weight_80': { '<19': 11.79, '<49': 17.50, '<79': 19.21, 'inf': 266.30 },
        'weight_90': { '<19': 11.93, '<49': 17.79, '<79': 19.50, 'inf': 295.70 },
        'weight_100': { '<19': 12.07, '<49': 18.07, '<79': 19.79, 'inf': 337.70 },
        'weight_125': { '<19': 12.21, '<49': 18.36, '<79': 20.07, 'inf': 377.70 },
        'weight_150': { '<19': 12.36, '<49': 18.36, '<79': 20.36, 'inf': 400.70 },
        'weight_inf': { '<19': 12.50, '<49': 18.36, '<79': 20.64, 'inf': 525.70 }
    }
};

// Helper: converte peso em kg para a chave weight_* correspondente da tabela
function getWeightKeyFromKg(kg) {
    if (kg <= 0.3) return 'weight_0.3';
    if (kg <= 0.5) return 'weight_0.5';
    if (kg <= 1) return 'weight_1';
    if (kg <= 1.5) return 'weight_1.5';
    if (kg <= 2) return 'weight_2';
    if (kg <= 3) return 'weight_3';
    if (kg <= 4) return 'weight_4';
    if (kg <= 5) return 'weight_5';
    if (kg <= 6) return 'weight_6';
    if (kg <= 7) return 'weight_7';
    if (kg <= 8) return 'weight_8';
    if (kg <= 9) return 'weight_9';
    if (kg <= 10) return 'weight_10';
    if (kg <= 11) return 'weight_11';
    if (kg <= 13) return 'weight_13';
    if (kg <= 15) return 'weight_15';
    if (kg <= 17) return 'weight_17';
    if (kg <= 20) return 'weight_20';
    if (kg <= 25) return 'weight_25';
    if (kg <= 30) return 'weight_30';
    if (kg <= 40) return 'weight_40';
    if (kg <= 50) return 'weight_50';
    if (kg <= 60) return 'weight_60';
    if (kg <= 70) return 'weight_70';
    if (kg <= 80) return 'weight_80';
    if (kg <= 90) return 'weight_90';
    if (kg <= 100) return 'weight_100';
    if (kg <= 125) return 'weight_125';
    if (kg <= 150) return 'weight_150';
    return 'weight_inf';
}

// Helper: extrai peso numérico (kg) da chave weight_*
function getKgFromWeightKey(key) {
    if (key === 'weight_inf') return 999;
    return parseFloat(key.replace('weight_', '')) || 0;
}

class Calculator {
    constructor() {
        this.products = [];
        this.container = document.getElementById('products-container');
        this.template = document.getElementById('product-template');

        // Global inputs
        this.globalTax = document.getElementById('global-tax');
        this.globalOpCost = document.getElementById('global-op-cost');

        // Método de custeio (custo operacional opcional)
        this.opCostMode = document.getElementById('op-cost-mode');
        this.costingBadge = document.getElementById('costing-treatment-badge');

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
        [this.globalTax, this.globalOpCost].forEach(el => {
            if (el) el.addEventListener('input', () => {
                this.updateOpCost();
                this.recalculateAll();
            });
        });

        // Custo operacional opcional: Custeio por Absorção (ligado) x Custeio Variável (desligado)
        if (this.opCostMode) {
            this.opCostMode.addEventListener('change', () => this.applyCostingMode());
        }

        this.applyCostingMode();
    }

    isOpCostEnabled() {
        return this.opCostMode ? this.opCostMode.checked : true;
    }

    applyCostingMode() {
        const enabled = this.isOpCostEnabled();
        const calcEl = document.querySelector('.mf-calc');
        if (calcEl) calcEl.classList.toggle('variable-costing', !enabled);
        // Sem o custo operacional o campo não é usado: trava para edição
        if (this.globalOpCost) this.globalOpCost.disabled = !enabled;
        // Selo do método (muda com o toggle). Pleno (RKW) rateia custos+despesas; Variável não (margem de contribuição).
        if (this.costingBadge) {
            this.costingBadge.textContent = enabled ? 'Custeio Pleno (RKW)' : 'Custeio Variável · margem de contribuição';
        }
        this.products.forEach(p => p.applyCostingMode(enabled));
        this.updateOpCost();
        this.recalculateAll();
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

    getGlobalTaxRate() { return (parseFloat(this.globalTax.value) || 0) / 100; }

    getOpCostRate() {
        // Custeio Variável: o custo operacional não entra no preço
        if (!this.isOpCostEnabled()) return 0;
        // O usuário digita o % direto (ex: 10 => 0.10)
        return this.parse(this.globalOpCost.value) / 100;
    }

    recalculateAll() {
        this.products.forEach(p => p.calculate('margin'));
    }

    updateOpCost() {
        // O usuário digita o % direto. Recomendação Marketfacil: Custo Operacional <= 10%
        const rate = this.parse(this.globalOpCost.value); // já em %
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
        product.applyCostingMode(this.isOpCostEnabled());
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
        this.inputCategory = element.querySelector('.input-category');
        this.inputCost = element.querySelector('.input-cost');
        this.inputMl = element.querySelector('.input-ml');
        this.inputWeight = element.querySelector('.input-weight');
        this.inputCustomFreight = element.querySelector('.input-custom-freight');
        this.fieldCustomFreight = element.querySelector('.field-custom-freight');
        this.inputFrete = element.querySelector('.input-frete'); // Now disabled, showing table value
        this.inputTacos = element.querySelector('.input-tacos');
        this.inputMarginSlider = element.querySelector('.input-margin-slider');
        this.inputMargin = element.querySelector('.input-margin');
        this.inputPrice = element.querySelector('.input-price');
        this.inputProfit = element.querySelector('.input-profit');
        this.inputRoi = element.querySelector('.input-roi');

        // Dimension inputs (peso cubado)
        this.inputDimHeight = element.querySelector('.input-dim-height');
        this.inputDimWidth = element.querySelector('.input-dim-width');
        this.inputDimLength = element.querySelector('.input-dim-length');
        this.fieldCubadoResult = element.querySelector('.field-cubado-result');
        this.cubadoInfo = element.querySelector('.cubado-info');
        this.cubadoValue = element.querySelector('.cubado-value');
        this.cubadoStatus = element.querySelector('.cubado-status');

        // Rótulos dinâmicos e ponto de equilíbrio (método de custeio)
        this.marginLabel = element.querySelector('.margin-label');
        this.profitLabel = element.querySelector('.profit-label');
        this.fieldMargin = element.querySelector('.field-margin');
        this.fieldContrib = element.querySelector('.field-contrib');
        this.profitBox = element.querySelector('.result-profit');
        this.roiLabel = element.querySelector('.roi-label');
        this.roiBox = element.querySelector('.result-roi');

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
        [this.inputCost, this.inputMl, this.inputWeight, this.inputTacos, this.inputCustomFreight,
         this.inputDimHeight, this.inputDimWidth, this.inputDimLength].forEach(el => {
            if (el) el.addEventListener('input', () => this.calculate('margin'));
        });

        // Category -> toggle visibility of custom freight vs weight, then recalculate
        if (this.inputCategory) {
            this.inputCategory.addEventListener('input', () => {
                const isCustom = this.inputCategory.value === 'custom';
                const fieldWeight = this.inputWeight.closest('.mf-field');

                if (isCustom) {
                    fieldWeight.classList.add('mf-hidden');
                    this.fieldCustomFreight.classList.remove('mf-hidden');
                } else {
                    fieldWeight.classList.remove('mf-hidden');
                    this.fieldCustomFreight.classList.add('mf-hidden');
                }

                this.calculate('margin');
            });
        }

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

    calculate(source) {
        const cost = this.calc.parse(this.inputCost.value);
        const mlRate = this.calc.parse(this.inputMl.value) / 100;
        const tacosRate = this.calc.parse(this.inputTacos.value) / 100;
        const taxRate = this.calc.getGlobalTaxRate();
        const opRate = this.calc.getOpCostRate();
        const selectedWeightKey = this.inputWeight.value; // e.g., 'weight_0.3'
        const categoryKey = this.inputCategory.value; // e.g., 'default', 'full_super'

        // === PESO CUBADO: Maior entre peso real e cubado ===
        const dimH = this.calc.parse(this.inputDimHeight.value);
        const dimW = this.calc.parse(this.inputDimWidth.value);
        const dimL = this.calc.parse(this.inputDimLength.value);
        let cubadoKg = 0;
        let useCubado = false;

        if (dimH > 0 && dimW > 0 && dimL > 0) {
            cubadoKg = (dimH * dimW * dimL) / 6000;
            const realKg = getKgFromWeightKey(selectedWeightKey);
            const cubadoWeightKey = getWeightKeyFromKg(cubadoKg);
            const cubadoFaixaKg = getKgFromWeightKey(cubadoWeightKey);

            // Usa cubado se for maior que o peso real selecionado
            useCubado = cubadoFaixaKg > realKg;

            // Mostra o container de resultado do cubado
            if (this.fieldCubadoResult) {
                this.fieldCubadoResult.classList.remove('mf-hidden');
            }

            // Atualiza info visual do cubado
            if (this.cubadoInfo) {
                this.cubadoValue.textContent = cubadoKg.toFixed(2) + ' kg';
                if (useCubado) {
                    this.cubadoStatus.textContent = 'Frete calculado pelo PESO CUBADO';
                    this.cubadoStatus.className = 'cubado-status cubado-warning';
                } else {
                    this.cubadoStatus.textContent = 'Frete calculado pelo PESO DA CAIXA';
                    this.cubadoStatus.className = 'cubado-status cubado-ok';
                }
            }
        } else {
            // Se dimensões não preenchidas, esconde o container
            if (this.fieldCubadoResult) {
                this.fieldCubadoResult.classList.add('mf-hidden');
            }
        }

        // Usa o maior peso (real vs cubado) para buscar na tabela de frete
        const weightKey = useCubado ? getWeightKeyFromKg(cubadoKg) : selectedWeightKey;

        let price = 0;
        let marginRate = 0;
        let freteObj = 0;

        const calcFreteML = (precoVenda) => {
            if (precoVenda <= 0) return 0;

            // Handle custom category
            if (categoryKey === 'custom') {
                return this.calc.parse(this.inputCustomFreight.value);
            }

            // Busca a matriz adequada (se estiver vazia no código, cai na 'default' para não quebrar)
            const matrix = (MATRICES[categoryKey] && Object.keys(MATRICES[categoryKey]).length > 0) ? MATRICES[categoryKey] : MATRICES['default'];
            const row = matrix[weightKey] || MATRICES['default']['weight_0.3'];
            let baseFrete = 0;

            // Busca range adequado
            if (precoVenda < 19 && row['<19']) baseFrete = row['<19'];
            else if (precoVenda < 29 && row['<29']) baseFrete = row['<29']; // Supermercado/específicos
            else if (precoVenda < 49 && row['<49']) baseFrete = row['<49'];
            else if (precoVenda < 79 && row['<79']) baseFrete = row['<79'];
            else if (precoVenda < 99 && row['<99']) baseFrete = row['<99']; // Usados/específicos
            else if (precoVenda < 100 && row['<100']) baseFrete = row['<100'];
            else if (precoVenda < 120 && row['<120']) baseFrete = row['<120'];
            else if (precoVenda < 150 && row['<150']) baseFrete = row['<150'];
            else if (precoVenda < 200 && row['<200']) baseFrete = row['<200'];
            else baseFrete = row['inf'];

            // Regra do Teto de 50% para produtos menores que R$ 19,00 (Regra Geral/Padrão)
            if (categoryKey !== 'full_super' && categoryKey !== 'usados') {
                if (precoVenda < 19 && baseFrete > (precoVenda * 0.5)) {
                    return precoVenda * 0.5;
                }
            }

            // Regra Específica Full Super: Se custa menos de R$ 29, frete máximo é 25% do valor do produto.
            if (categoryKey === 'full_super') {
                if (precoVenda < 29 && baseFrete > (precoVenda * 0.25)) {
                    return precoVenda * 0.25;
                }
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

        } else if (source === 'roi') {
            // User typed ROI -> calculate profit target first, then price
            const targetRoi = this.calc.parse(this.inputRoi.value) / 100;
            const targetProfit = targetRoi * cost;
            const denom = 1 - mlRate - taxRate - tacosRate - opRate;

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
        const commissionVal = (price * mlRate) + freteObj; // Inclusão do frete no total pago ao ML
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
        // Nota: commissionVal agora já embute o frete
        const variableCosts = cost + commissionVal + taxesVal + tacosVal;
        const contribRate = price > 0 ? ((price - variableCosts) / price) : 0;
        this.outputContrib.value = this.calc.fmtPerc(contribRate * 100);

        // ROI = Profit / Cost
        const roi = cost > 0 ? (profitNet / cost) * 100 : 0;
        if (source !== 'roi' && document.activeElement !== this.inputRoi) {
            this.inputRoi.value = roi.toFixed(1); // One decimal place for ROI visually
        }

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

        // Marketfacil recommendations
        // Contrib >= 20% (ajustado para precisão decimal)
        if (contribRate < 0.1999) {
            this.outputContrib.parentElement.classList.add('mf-warning');
            this.outputContrib.parentElement.classList.remove('mf-healthy');
        } else {
            this.outputContrib.parentElement.classList.remove('mf-warning');
            this.outputContrib.parentElement.classList.add('mf-healthy');
        }

        // Meta de margem Marketfacil: >= 20% (tanto o lucro, com custo operacional, quanto a contribuição, sem)
        const marginThreshold = 0.1999;
        if (marginRate < marginThreshold) {
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

        // ROI >= 20% (Recomendação Marketfacil)
        if (roi < 19.99) {
            this.inputRoi.closest('.result-box').classList.add('mf-warning');
            this.inputRoi.closest('.result-box').classList.remove('mf-healthy');
        } else {
            this.inputRoi.closest('.result-box').classList.remove('mf-warning');
            this.inputRoi.closest('.result-box').classList.add('mf-healthy');
        }
    }

    updateMarginUI(val) {
        const v = val.toFixed(2);
        if (document.activeElement !== this.inputMargin) {
            this.inputMargin.value = v;
        }
        this.inputMarginSlider.value = v;
    }

    // Troca rótulos e método conforme o custo operacional estar ligado (Absorção) ou desligado (Variável)
    applyCostingMode(enabled) {
        if (this.marginLabel) {
            this.marginLabel.textContent = enabled ? 'Margem de Lucro (%)' : 'Margem de Contribuição (%)';
        }
        if (this.profitLabel) {
            this.profitLabel.textContent = enabled ? '✅ LUCRO' : '🟡 SOBRA DA VENDA (R$)';
        }
        if (this.fieldMargin) {
            this.fieldMargin.title = enabled
                ? 'Margem de lucro líquido desejada sobre o faturamento'
                : 'Margem de contribuição desejada: o que sobra após os custos variáveis para pagar os custos fixos e gerar lucro';
        }
        if (this.profitBox) {
            this.profitBox.title = enabled
                ? 'Lucro Líquido final na venda desta unidade (Pode ser alterado para inverter o cálculo)'
                : 'O que sobra desta venda após os custos variáveis. Ainda precisa pagar seus custos fixos antes de virar lucro (margem de contribuição).';
        }
        // ROI honesto: no Custeio Variável ele é retorno sobre a contribuição, não sobre o lucro
        if (this.roiLabel) {
            this.roiLabel.textContent = enabled ? '📈 ROI (%)' : '📈 RETORNO S/ CUSTO (%)';
        }
        if (this.roiBox) {
            this.roiBox.title = enabled
                ? 'Retorno sobre o Investimento - Lucro / Custo do Produto (Pode ser alterado para achar o Preço via ROI)'
                : 'Quanto cada R$1 gasto no produto retorna de contribuição (antes de pagar os custos fixos). Não é lucro final.';
        }
        // Em Custeio Variável o output "Margem de Contribuição" fica redundante com o input,
        // então escondemos para não duplicar a informação.
        if (this.fieldContrib) {
            this.fieldContrib.classList.toggle('mf-hidden', !enabled);
        }
        this.calculate('margin');
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
