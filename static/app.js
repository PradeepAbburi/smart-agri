/* ============================================
   CROP YIELD PREDICTION - APP.JS
   ============================================ */

// Chart.js Global Defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.05)';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 15;

const COLORS = {
    emerald: 'rgba(16, 185, 129, ',
    cyan: 'rgba(6, 182, 212, ',
    violet: 'rgba(139, 92, 246, ',
    amber: 'rgba(245, 158, 11, ',
    rose: 'rgba(244, 63, 94, ',
    blue: 'rgba(59, 130, 246, ',
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    loadAllData();
    initPredictionForm();
});

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

    // Active link tracking
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });
        navAnchors.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });

    // Close mobile nav on link click
    navAnchors.forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.glass-card, .stat-card, .model-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ============================================
// DATA LOADING
// ============================================
async function loadAllData() {
    try {
        const [statsRes, chartRes, metricsRes, featureRes] = await Promise.all([
            fetch('/api/data-stats'),
            fetch('/api/chart-data'),
            fetch('/api/model-metrics'),
            fetch('/api/feature-importance')
        ]);

        const stats = await statsRes.json();
        const chartData = await chartRes.json();
        const metrics = await metricsRes.json();
        const features = await featureRes.json();

        populateHeroStats(stats, metrics);
        populateStatsGrid(stats);
        populateDataTable(stats);
        createDistributionCharts(chartData);
        createScatterCharts(chartData);
        createCorrelationChart(chartData);
        populateModelMetrics(metrics);
        createPredictionCharts(metrics);
        createFeatureImportanceChart(features);
        initChartTabs();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// ============================================
// HERO STATS
// ============================================
function populateHeroStats(stats, metrics) {
    document.getElementById('stat-samples').textContent = stats.shape[0];
    document.getElementById('stat-r2').textContent = metrics.random_forest.r2;
}

// ============================================
// STATS GRID
// ============================================
function populateStatsGrid(stats) {
    const grid = document.getElementById('statsGrid');
    const desc = stats.describe;
    const columns = Object.keys(desc);

    const icons = ['🌧️', '🌡️', '🧪', '🟢', '🟠', '🟣', '🌾'];
    const labels = ['Rainfall', 'Temperature', 'Fertilizer', 'Nitrogen', 'Phosphorus', 'Potassium', 'Yield'];

    grid.innerHTML = columns.map((col, i) => `
        <div class="stat-card">
            <div class="stat-card-icon">${icons[i] || '📊'}</div>
            <div class="stat-card-label">${labels[i] || col}</div>
            <div class="stat-card-value">${desc[col].mean?.toFixed(1) || '--'}</div>
            <div class="stat-card-sub">Range: ${desc[col].min?.toFixed(1)} — ${desc[col].max?.toFixed(1)}</div>
        </div>
    `).join('');
}

// ============================================
// DATA TABLE
// ============================================
function populateDataTable(stats) {
    const table = document.getElementById('dataTable');
    const head = stats.head;
    if (!head || !head.length) return;

    const headers = Object.keys(head[0]);
    table.innerHTML = `
        <thead>
            <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
            ${head.map(row => `
                <tr>${headers.map(h => `<td>${typeof row[h] === 'number' ? row[h].toFixed(2) : row[h]}</td>`).join('')}</tr>
            `).join('')}
        </tbody>
    `;
}

// ============================================
// HISTOGRAM HELPER
// ============================================
function createHistogram(data, bins = 20) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / bins;
    const counts = new Array(bins).fill(0);
    const labels = [];

    for (let i = 0; i < bins; i++) {
        const start = min + i * binWidth;
        labels.push(start.toFixed(1));
    }

    data.forEach(val => {
        let idx = Math.floor((val - min) / binWidth);
        if (idx >= bins) idx = bins - 1;
        if (idx < 0) idx = 0;
        counts[idx]++;
    });

    return { labels, counts };
}

// ============================================
// DISTRIBUTION CHARTS
// ============================================
function createDistributionCharts(chartData) {
    const configs = [
        { id: 'chartRainfall', data: chartData.rainfall, color: COLORS.cyan, label: 'Rainfall (mm)' },
        { id: 'chartTemperature', data: chartData.temperature, color: COLORS.rose, label: 'Temperature (°C)' },
        { id: 'chartFertilizer', data: chartData.fertilizer, color: COLORS.violet, label: 'Fertilizer (kg)' },
        { id: 'chartYield', data: chartData.yield, color: COLORS.emerald, label: 'Yield (Q/acre)' },
    ];

    configs.forEach(cfg => {
        const hist = createHistogram(cfg.data, 25);
        new Chart(document.getElementById(cfg.id), {
            type: 'bar',
            data: {
                labels: hist.labels,
                datasets: [{
                    label: cfg.label,
                    data: hist.counts,
                    backgroundColor: cfg.color + '0.5)',
                    borderColor: cfg.color + '1)',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 1,
                    categoryPercentage: 0.95
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 8, font: { size: 10 } }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.03)' },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    });
}

// ============================================
// SCATTER CHARTS
// ============================================
function createScatterCharts(chartData) {
    const configs = [
        { id: 'chartScatterRain', data: chartData.scatter_rainfall_yield, color: COLORS.cyan, labelX: 'Rainfall (mm)' },
        { id: 'chartScatterTemp', data: chartData.scatter_temp_yield, color: COLORS.rose, labelX: 'Temperature (°C)' },
        { id: 'chartScatterFert', data: chartData.scatter_fertilizer_yield, color: COLORS.violet, labelX: 'Fertilizer (kg)' },
    ];

    configs.forEach(cfg => {
        const scatterData = cfg.data.x.map((x, i) => ({ x, y: cfg.data.y[i] }));
        new Chart(document.getElementById(cfg.id), {
            type: 'scatter',
            data: {
                datasets: [{
                    data: scatterData,
                    backgroundColor: cfg.color + '0.4)',
                    borderColor: cfg.color + '0.8)',
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => `${cfg.labelX}: ${ctx.parsed.x.toFixed(1)}, Yield: ${ctx.parsed.y.toFixed(1)}`
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: cfg.labelX, color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.03)' }
                    },
                    y: {
                        title: { display: true, text: 'Yield (Q/acre)', color: '#94a3b8' },
                        grid: { color: 'rgba(255,255,255,0.03)' }
                    }
                }
            }
        });
    });
}

// ============================================
// CORRELATION HEATMAP
// ============================================
function createCorrelationChart(chartData) {
    const { labels, values } = chartData.correlation;
    const canvas = document.getElementById('chartCorrelation');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const size = Math.min(600, window.innerWidth - 100);
    canvas.width = size;
    canvas.height = size;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    canvas.style.margin = '0 auto';
    canvas.style.display = 'block';

    const n = labels.length;
    const padding = 120;
    const cellSize = (size - padding) / n;

    // Short labels
    const shortLabels = labels.map(l => {
        if (l.includes('Rain')) return 'Rainfall';
        if (l.includes('Temp')) return 'Temp';
        if (l.includes('Fert')) return 'Fertilizer';
        if (l.includes('Nitrogen')) return 'N';
        if (l.includes('Phosphorus')) return 'P';
        if (l.includes('Potassium')) return 'K';
        if (l.includes('Yeild')) return 'Yield';
        return l;
    });

    // Draw cells
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const val = values[i][j];
            const x = padding + j * cellSize;
            const y = padding + i * cellSize;

            // Color mapping
            let r, g, b;
            if (val >= 0) {
                r = Math.round(10 + (1 - val) * 7);
                g = Math.round(185 - (1 - val) * 161);
                b = Math.round(129 - (1 - val) * 105);
            } else {
                r = Math.round(244 + val * 227);
                g = Math.round(63 + val * 39);
                b = Math.round(94 + val * 70);
            }

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + Math.abs(val) * 0.7})`;
            ctx.fillRect(x, y, cellSize - 2, cellSize - 2);

            // Value text
            ctx.fillStyle = Math.abs(val) > 0.5 ? '#f1f5f9' : '#94a3b8';
            ctx.font = `bold ${Math.max(10, cellSize / 4.5)}px Inter`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(val.toFixed(2), x + cellSize / 2 - 1, y + cellSize / 2 - 1);
        }
    }

    // Draw labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = `500 ${Math.max(10, cellSize / 4)}px Inter`;

    // Top labels
    shortLabels.forEach((label, i) => {
        ctx.save();
        ctx.translate(padding + i * cellSize + cellSize / 2, padding - 10);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'left';
        ctx.fillText(label, 0, 0);
        ctx.restore();
    });

    // Left labels
    ctx.textAlign = 'right';
    shortLabels.forEach((label, i) => {
        ctx.fillText(label, padding - 10, padding + i * cellSize + cellSize / 2);
    });
}

// ============================================
// MODEL METRICS
// ============================================
function populateModelMetrics(metrics) {
    const dt = metrics.decision_tree;
    const rf = metrics.random_forest;

    document.getElementById('dt-r2').textContent = dt.r2;
    document.getElementById('dt-mae').textContent = dt.mae;
    document.getElementById('dt-mse').textContent = dt.mse;
    document.getElementById('dt-train').textContent = dt.train_score;

    document.getElementById('rf-r2').textContent = rf.r2;
    document.getElementById('rf-mae').textContent = rf.mae;
    document.getElementById('rf-mse').textContent = rf.mse;
    document.getElementById('rf-train').textContent = rf.train_score;
}

// ============================================
// PREDICTION COMPARISON CHARTS
// ============================================
function createPredictionCharts(metrics) {
    ['DT', 'RF'].forEach(model => {
        const key = model === 'DT' ? 'decision_tree' : 'random_forest';
        const data = metrics[key];
        const color = model === 'DT' ? COLORS.amber : COLORS.emerald;

        // Sort by actual values for cleaner visualization
        const pairs = data.actual.map((a, i) => ({ actual: a, predicted: data.predicted[i] }));
        pairs.sort((a, b) => a.actual - b.actual);

        new Chart(document.getElementById(`chart${model}Predictions`), {
            type: 'line',
            data: {
                labels: pairs.map((_, i) => i + 1),
                datasets: [
                    {
                        label: 'Actual',
                        data: pairs.map(p => p.actual),
                        borderColor: 'rgba(148, 163, 184, 0.6)',
                        backgroundColor: 'rgba(148, 163, 184, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 2,
                    },
                    {
                        label: 'Predicted',
                        data: pairs.map(p => p.predicted),
                        borderColor: color + '1)',
                        backgroundColor: color + '0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 2,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.95)',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                    }
                },
                scales: {
                    x: {
                        display: false
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.03)' },
                        title: { display: true, text: 'Yield (Q/acre)', color: '#64748b' }
                    }
                }
            }
        });
    });
}

// ============================================
// FEATURE IMPORTANCE
// ============================================
function createFeatureImportanceChart(features) {
    const canvas = document.getElementById('chartFeatureImportance');
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: features.features.map(f => {
                if (f.includes('Rain')) return 'Rainfall';
                if (f.includes('Temp')) return 'Temperature';
                if (f.includes('Fert')) return 'Fertilizer';
                if (f.includes('Nitrogen')) return 'Nitrogen';
                if (f.includes('Phosphorus')) return 'Phosphorus';
                if (f.includes('Potassium')) return 'Potassium';
                return f;
            }),
            datasets: [
                {
                    label: 'Decision Tree',
                    data: features.decision_tree,
                    backgroundColor: COLORS.amber + '0.7)',
                    borderColor: COLORS.amber + '1)',
                    borderWidth: 1,
                    borderRadius: 6,
                },
                {
                    label: 'Random Forest',
                    data: features.random_forest,
                    backgroundColor: COLORS.emerald + '0.7)',
                    borderColor: COLORS.emerald + '1)',
                    borderWidth: 1,
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: ctx => `${ctx.dataset.label}: ${(ctx.parsed.x * 100).toFixed(1)}%`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.03)' },
                    title: { display: true, text: 'Importance', color: '#64748b' },
                    ticks: {
                        callback: val => (val * 100).toFixed(0) + '%'
                    }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ============================================
// CHART TABS
// ============================================
function initChartTabs() {
    const tabs = document.querySelectorAll('.chart-tab');
    const panels = document.querySelectorAll('.chart-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`panel-${tab.dataset.chart}`).classList.add('active');
        });
    });
}

// ============================================
// PREDICTION FORM
// ============================================
function initPredictionForm() {
    const form = document.getElementById('predictForm');
    const btn = document.getElementById('predictBtn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        btn.classList.add('loading');

        const data = {
            rainfall: document.getElementById('rainfall').value,
            temperature: document.getElementById('temperature').value,
            fertilizer: document.getElementById('fertilizer').value,
            nitrogen: document.getElementById('nitrogen').value,
            phosphorus: document.getElementById('phosphorus').value,
            potassium: document.getElementById('potassium').value,
        };

        try {
            const res = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (result.success) {
                document.getElementById('resultPlaceholder').style.display = 'none';
                document.getElementById('resultContent').classList.remove('hidden');
                document.getElementById('resultValue').textContent = result.recommended;
                document.getElementById('resultDT').textContent = `${result.decision_tree} Q/acre`;
                document.getElementById('resultRF').textContent = `${result.random_forest} Q/acre`;
            } else {
                alert('Prediction error: ' + result.error);
            }
        } catch (err) {
            alert('Error connecting to server: ' + err.message);
        } finally {
            btn.classList.remove('loading');
        }
    });
}
