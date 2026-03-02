// =============================================
// CALCULADORA ML - JAVASCRIPT
// =============================================

// Tabela atualizada de Envios do Mercado Livre (Março 2026)
// Linhas = peso, Colunas = faixas de preco (price ranges)
const MATRICES = {
    'default': {
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
    },
    'full_super': {
        'weight_0.3': { '<19': 1.25, '<29': 1.50, '<49': 2.00, '<79': 3.00, '<99': 4.00, '<199': 6.00, 'inf': 20.95 },
        'weight_0.5': { '<19': 1.25, '<29': 1.50, '<49': 2.00, '<79': 3.00, '<99': 4.00, '<199': 6.00, 'inf': 22.55 },
        'weight_1': { '<19': 1.25, '<29': 1.50, '<49': 2.00, '<79': 3.00, '<99': 4.00, '<199': 6.00, 'inf': 23.65 },
        'weight_1.5': { '<19': 1.75, '<29': 2.00, '<49': 2.50, '<79': 3.50, '<99': 4.50, '<199': 6.50, 'inf': 24.65 },
        'weight_2': { '<19': 1.75, '<29': 2.00, '<49': 2.50, '<79': 3.50, '<99': 4.50, '<199': 6.50, 'inf': 24.65 },
        'weight_3': { '<19': 2.00, '<29': 2.50, '<49': 3.00, '<79': 4.00, '<99': 5.00, '<199': 7.00, 'inf': 26.25 },
        'weight_4': { '<19': 2.00, '<29': 2.50, '<49': 3.00, '<79': 4.00, '<99': 5.00, '<199': 7.00, 'inf': 28.35 },
        'weight_5': { '<19': 2.50, '<29': 3.50, '<49': 4.00, '<79': 5.00, '<99': 6.00, '<199': 7.50, 'inf': 30.75 },
        'weight_6': { '<19': 2.50, '<29': 3.50, '<49': 4.00, '<79': 5.00, '<99': 6.00, '<199': 7.50, 'inf': 39.75 },
        'weight_7': { '<19': 4.00, '<29': 5.00, '<49': 5.50, '<79': 6.50, '<99': 7.00, '<199': 7.50, 'inf': 44.05 },
        'weight_8': { '<19': 4.00, '<29': 5.00, '<49': 5.50, '<79': 6.50, '<99': 7.00, '<199': 7.50, 'inf': 48.05 },
        'weight_9': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 49.35 },
        'weight_11': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 68.65 },
        'weight_13': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 70.25 },
        'weight_15': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 74.95 },
        'weight_17': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 78.65 },
        'weight_20': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 91.15 },
        'weight_25': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 105.95 },
        'weight_30': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 106.95 },
        'weight_40': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 107.05 },
        'weight_50': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 110.75 },
        'weight_60': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 118.15 },
        'weight_70': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 126.55 },
        'weight_80': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 132.25 },
        'weight_90': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 146.95 },
        'weight_100': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 167.95 },
        'weight_125': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 187.95 },
        'weight_150': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 199.45 },
        'weight_inf': { '<19': 5.00, '<29': 6.00, '<49': 6.50, '<79': 7.00, '<99': 7.50, '<199': 8.00, 'inf': 261.95 }
    },
    'livros': {
        'weight_0.3': { '<19': 2.82, '<49': 3.28, '<79': 3.87, '<100': 12.35, '<120': 14.35, '<150': 16.45, '<200': 18.45, 'inf': 20.95 },
        'weight_0.5': { '<19': 2.97, '<49': 3.32, '<79': 3.92, '<100': 13.25, '<120': 15.45, '<150': 17.65, '<200': 19.85, 'inf': 22.55 },
        'weight_1': { '<19': 3.02, '<49': 3.37, '<79': 3.98, '<100': 13.85, '<120': 16.15, '<150': 18.45, '<200': 20.75, 'inf': 23.65 },
        'weight_1.5': { '<19': 3.08, '<49': 3.43, '<79': 4.02, '<100': 14.15, '<120': 16.45, '<150': 18.85, '<200': 21.15, 'inf': 24.65 },
        'weight_2': { '<19': 3.13, '<49': 3.48, '<79': 4.07, '<100': 14.45, '<120': 16.85, '<150': 19.25, '<200': 21.65, 'inf': 24.65 },
        'weight_3': { '<19': 3.17, '<49': 3.98, '<79': 4.27, '<100': 15.75, '<120': 18.35, '<150': 21.05, '<200': 23.65, 'inf': 26.25 },
        'weight_4': { '<19': 3.22, '<49': 4.07, '<79': 4.48, '<100': 17.05, '<120': 19.85, '<150': 22.65, '<200': 25.55, 'inf': 28.35 },
        'weight_5': { '<19': 3.28, '<49': 4.18, '<79': 4.88, '<100': 18.45, '<120': 21.55, '<150': 24.65, '<200': 27.75, 'inf': 30.75 },
        'weight_6': { '<19': 3.32, '<49': 4.27, '<79': 4.97, '<100': 25.45, '<120': 28.55, '<150': 32.65, '<200': 35.75, 'inf': 39.75 },
        'weight_7': { '<19': 3.37, '<49': 4.37, '<79': 5.07, '<100': 27.05, '<120': 31.05, '<150': 36.05, '<200': 40.05, 'inf': 44.05 },
        'weight_8': { '<19': 3.43, '<49': 4.48, '<79': 5.18, '<100': 28.85, '<120': 33.65, '<150': 38.45, '<200': 43.25, 'inf': 48.05 },
        'weight_9': { '<19': 3.48, '<49': 4.57, '<79': 5.27, '<100': 29.65, '<120': 34.55, '<150': 39.55, '<200': 44.45, 'inf': 49.35 },
        'weight_11': { '<19': 3.52, '<49': 4.77, '<79': 5.47, '<100': 41.25, '<120': 48.05, '<150': 54.95, '<200': 61.75, 'inf': 68.65 },
        'weight_13': { '<19': 3.57, '<49': 4.97, '<79': 5.67, '<100': 42.15, '<120': 49.25, '<150': 56.25, '<200': 63.25, 'inf': 70.25 },
        'weight_15': { '<19': 3.63, '<49': 5.07, '<79': 5.77, '<100': 45.05, '<120': 52.45, '<150': 59.95, '<200': 67.45, 'inf': 74.95 },
        'weight_17': { '<19': 3.67, '<49': 5.18, '<79': 5.88, '<100': 48.55, '<120': 56.05, '<150': 63.55, '<200': 70.75, 'inf': 78.65 },
        'weight_20': { '<19': 3.72, '<49': 5.27, '<79': 5.97, '<100': 54.75, '<120': 63.85, '<150': 72.95, '<200': 82.05, 'inf': 91.15 },
        'weight_25': { '<19': 3.83, '<49': 5.47, '<79': 6.08, '<100': 64.05, '<120': 75.05, '<150': 84.75, '<200': 95.35, 'inf': 105.95 },
        'weight_30': { '<19': 3.87, '<49': 5.58, '<79': 6.17, '<100': 65.95, '<120': 75.45, '<150': 85.55, '<200': 96.25, 'inf': 106.95 },
        'weight_40': { '<19': 3.92, '<49': 5.67, '<79': 6.28, '<100': 67.75, '<120': 78.95, '<150': 88.95, '<200': 99.15, 'inf': 107.05 },
        'weight_50': { '<19': 3.98, '<49': 5.77, '<79': 6.37, '<100': 70.25, '<120': 81.05, '<150': 92.05, '<200': 102.55, 'inf': 110.75 },
        'weight_60': { '<19': 4.02, '<49': 5.88, '<79': 6.47, '<100': 74.95, '<120': 86.45, '<150': 98.15, '<200': 109.35, 'inf': 118.15 },
        'weight_70': { '<19': 4.07, '<49': 5.97, '<79': 6.58, '<100': 80.25, '<120': 92.95, '<150': 105.05, '<200': 117.15, 'inf': 126.55 },
        'weight_80': { '<19': 4.13, '<49': 6.08, '<79': 6.67, '<100': 83.95, '<120': 97.05, '<150': 109.85, '<200': 122.45, 'inf': 132.25 },
        'weight_90': { '<19': 4.18, '<49': 6.17, '<79': 6.78, '<100': 93.25, '<120': 107.45, '<150': 122.05, '<200': 136.05, 'inf': 146.95 },
        'weight_100': { '<19': 4.22, '<49': 6.28, '<79': 6.87, '<100': 106.55, '<120': 123.95, '<150': 139.55, '<200': 155.55, 'inf': 167.95 },
        'weight_125': { '<19': 4.27, '<49': 6.37, '<79': 6.98, '<100': 119.25, '<120': 138.05, '<150': 156.05, '<200': 173.95, 'inf': 187.95 },
        'weight_150': { '<19': 4.33, '<49': 6.37, '<79': 7.07, '<100': 126.55, '<120': 146.15, '<150': 165.65, '<200': 184.65, 'inf': 199.45 },
        'weight_inf': { '<19': 4.37, '<49': 6.37, '<79': 7.17, '<100': 166.15, '<120': 192.45, '<150': 217.55, '<200': 242.55, 'inf': 261.95 }
    },
    'especiais': {
        'weight_0.3': { '<19': 5.65, '<49': 6.55, '<79': 7.75, '<100': 18.52, '<120': 21.52, '<150': 24.67, '<200': 27.67, 'inf': 31.42 },
        'weight_0.5': { '<19': 5.95, '<49': 6.65, '<79': 7.85, '<100': 19.87, '<120': 23.17, '<150': 26.47, '<200': 29.77, 'inf': 33.82 },
        'weight_1': { '<19': 6.05, '<49': 6.75, '<79': 7.95, '<100': 20.77, '<120': 24.22, '<150': 27.67, '<200': 31.12, 'inf': 35.47 },
        'weight_1.5': { '<19': 6.15, '<49': 6.85, '<79': 8.05, '<100': 21.22, '<120': 24.67, '<150': 28.27, '<200': 31.72, 'inf': 36.97 },
        'weight_2': { '<19': 6.25, '<49': 6.95, '<79': 8.15, '<100': 21.67, '<120': 25.27, '<150': 28.87, '<200': 32.47, 'inf': 36.97 },
        'weight_3': { '<19': 6.35, '<49': 7.95, '<79': 8.55, '<100': 23.62, '<120': 27.52, '<150': 31.57, '<200': 35.47, 'inf': 39.37 },
        'weight_4': { '<19': 6.45, '<49': 8.15, '<79': 8.95, '<100': 25.57, '<120': 29.77, '<150': 33.97, '<200': 38.32, 'inf': 42.52 },
        'weight_5': { '<19': 6.55, '<49': 8.35, '<79': 9.75, '<100': 27.67, '<120': 32.32, '<150': 36.97, '<200': 41.62, 'inf': 46.12 },
        'weight_6': { '<19': 6.65, '<49': 8.55, '<79': 9.95, '<100': 38.17, '<120': 42.82, '<150': 48.97, '<200': 53.62, 'inf': 59.62 },
        'weight_7': { '<19': 6.75, '<49': 8.75, '<79': 10.15, '<100': 40.57, '<120': 46.57, '<150': 54.07, '<200': 60.07, 'inf': 66.07 },
        'weight_8': { '<19': 6.85, '<49': 8.95, '<79': 10.35, '<100': 43.27, '<120': 50.47, '<150': 57.67, '<200': 64.87, 'inf': 72.07 },
        'weight_9': { '<19': 6.95, '<49': 9.15, '<79': 10.55, '<100': 44.47, '<120': 51.82, '<150': 59.32, '<200': 66.67, 'inf': 74.02 },
        'weight_11': { '<19': 7.05, '<49': 9.55, '<79': 10.95, '<100': 61.87, '<120': 72.07, '<150': 82.42, '<200': 92.62, 'inf': 102.97 },
        'weight_13': { '<19': 7.15, '<49': 9.95, '<79': 11.35, '<100': 63.22, '<120': 73.87, '<150': 84.37, '<200': 94.87, 'inf': 105.37 },
        'weight_15': { '<19': 7.25, '<49': 10.15, '<79': 11.55, '<100': 67.57, '<120': 78.67, '<150': 89.92, '<200': 101.17, 'inf': 112.42 },
        'weight_17': { '<19': 7.35, '<49': 10.35, '<79': 11.75, '<100': 72.82, '<120': 84.07, '<150': 95.32, '<200': 106.12, 'inf': 117.97 },
        'weight_20': { '<19': 7.45, '<49': 10.55, '<79': 11.95, '<100': 82.12, '<120': 95.77, '<150': 109.42, '<200': 123.07, 'inf': 136.72 },
        'weight_25': { '<19': 7.65, '<49': 10.95, '<79': 12.15, '<100': 96.07, '<120': 112.57, '<150': 127.12, '<200': 143.02, 'inf': 158.92 },
        'weight_30': { '<19': 7.75, '<49': 11.15, '<79': 12.35, '<100': 98.92, '<120': 113.17, '<150': 128.32, '<200': 144.37, 'inf': 160.42 },
        'weight_40': { '<19': 7.85, '<49': 11.35, '<79': 12.55, '<100': 101.62, '<120': 118.42, '<150': 133.42, '<200': 148.72, 'inf': 160.57 },
        'weight_50': { '<19': 7.95, '<49': 11.55, '<79': 12.75, '<100': 105.37, '<120': 121.57, '<150': 138.07, '<200': 153.82, 'inf': 166.12 },
        'weight_60': { '<19': 8.05, '<49': 11.75, '<79': 12.95, '<100': 112.42, '<120': 129.67, '<150': 147.22, '<200': 164.02, 'inf': 177.22 },
        'weight_70': { '<19': 8.15, '<49': 11.95, '<79': 13.15, '<100': 120.37, '<120': 139.42, '<150': 157.57, '<200': 175.72, 'inf': 189.82 },
        'weight_80': { '<19': 8.25, '<49': 12.15, '<79': 13.35, '<100': 125.92, '<120': 145.57, '<150': 164.77, '<200': 183.67, 'inf': 198.37 },
        'weight_90': { '<19': 8.35, '<49': 12.35, '<79': 13.55, '<100': 139.87, '<120': 161.17, '<150': 183.07, '<200': 204.07, 'inf': 220.42 },
        'weight_100': { '<19': 8.45, '<49': 12.55, '<79': 13.75, '<100': 159.82, '<120': 185.92, '<150': 209.32, '<200': 233.32, 'inf': 251.92 },
        'weight_125': { '<19': 8.55, '<49': 12.75, '<79': 13.95, '<100': 178.87, '<120': 207.07, '<150': 234.07, '<200': 260.92, 'inf': 281.92 },
        'weight_150': { '<19': 8.65, '<49': 12.75, '<79': 14.15, '<100': 189.82, '<120': 219.22, '<150': 248.47, '<200': 276.97, 'inf': 299.17 },
        'weight_inf': { '<19': 8.75, '<49': 12.75, '<79': 14.35, '<100': 249.22, '<120': 288.67, '<150': 326.32, '<200': 363.82, 'inf': 392.92 }
    },
    'pets': {},
    'usados': {
        'weight_0.3': { '<19': 8.07, '<49': 9.36, '<79': 11.07, 'inf': 41.90 },
        'weight_0.5': { '<19': 8.50, '<49': 9.50, '<79': 11.21, 'inf': 45.10 },
        'weight_1': { '<19': 8.64, '<49': 9.64, '<79': 11.36, 'inf': 47.30 },
        'weight_1.5': { '<19': 8.79, '<49': 9.79, '<79': 11.50, 'inf': 49.30 },
        'weight_2': { '<19': 8.93, '<49': 9.93, '<79': 11.64, 'inf': 49.30 },
        'weight_3': { '<19': 9.07, '<49': 11.36, '<79': 12.21, 'inf': 52.50 },
        'weight_4': { '<19': 9.21, '<49': 11.64, '<79': 12.79, 'inf': 56.70 },
        'weight_5': { '<19': 9.36, '<49': 11.93, '<79': 13.93, 'inf': 61.50 },
        'weight_6': { '<19': 9.50, '<49': 12.21, '<79': 14.21, 'inf': 79.50 },
        'weight_7': { '<19': 9.64, '<49': 12.50, '<79': 14.50, 'inf': 88.10 },
        'weight_8': { '<19': 9.79, '<49': 12.79, '<79': 14.79, 'inf': 96.10 },
        'weight_9': { '<19': 9.93, '<49': 13.07, '<79': 15.07, 'inf': 98.70 },
        'weight_11': { '<19': 10.07, '<49': 13.64, '<79': 15.64, 'inf': 137.30 },
        'weight_13': { '<19': 10.21, '<49': 14.21, '<79': 16.21, 'inf': 140.50 },
        'weight_15': { '<19': 10.36, '<49': 14.50, '<79': 16.50, 'inf': 149.90 },
        'weight_17': { '<19': 10.50, '<49': 14.79, '<79': 16.79, 'inf': 157.30 },
        'weight_20': { '<19': 10.64, '<49': 15.07, '<79': 17.07, 'inf': 182.30 },
        'weight_25': { '<19': 10.93, '<49': 15.64, '<79': 17.36, 'inf': 211.90 },
        'weight_30': { '<19': 11.07, '<49': 15.93, '<79': 17.64, 'inf': 213.90 },
        'weight_40': { '<19': 11.21, '<49': 16.21, '<79': 17.93, 'inf': 214.10 },
        'weight_50': { '<19': 11.36, '<49': 16.50, '<79': 18.21, 'inf': 221.50 },
        'weight_60': { '<19': 11.50, '<49': 16.79, '<79': 18.50, 'inf': 236.30 },
        'weight_70': { '<19': 11.64, '<49': 17.07, '<79': 18.79, 'inf': 253.10 },
        'weight_80': { '<19': 11.79, '<49': 17.36, '<79': 19.07, 'inf': 264.50 },
        'weight_90': { '<19': 11.93, '<49': 17.64, '<79': 19.36, 'inf': 293.90 },
        'weight_100': { '<19': 12.07, '<49': 17.93, '<79': 19.64, 'inf': 335.90 },
        'weight_125': { '<19': 12.21, '<49': 18.21, '<79': 19.93, 'inf': 375.90 },
        'weight_150': { '<19': 12.36, '<49': 18.21, '<79': 20.21, 'inf': 398.90 },
        'weight_inf': { '<19': 12.50, '<49': 18.21, '<79': 20.50, 'inf': 523.90 }
    }
};

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

    getGlobalRevenue() { return parseFloat(this.globalRevenue.value) || 0; }
    getGlobalFixedCost() { return parseFloat(this.globalFixedCost.value) || 0; }
    getGlobalTaxRate() { return (parseFloat(this.globalTax.value) || 0) / 100; }

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
        [this.inputCost, this.inputMl, this.inputWeight, this.inputTacos, this.inputCustomFreight].forEach(el => {
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
        const weightKey = this.inputWeight.value; // e.g., 'weight_0.3'
        const categoryKey = this.inputCategory.value; // e.g., 'default', 'full_super'

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

        // Profit Margin >= 10%
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
