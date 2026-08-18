/* ==========================================================================
   SMART AGRICULTURAL INTELLIGENCE PLATFORM - CORE JAVASCRIPT ENGINE
   Modern Responsive Interactivity, Dual Sliders, Presets & Theme Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigation();
    initAnimations();
    initRangeSliders();
    initPresets();
    loadAllData();
    initPredictionForm();
    initHistory();
    loadLastPrediction();
    initGuideModal();
});

// Global state variables
let globalDataStats = null;
let globalChartData = null;
let globalModelMetrics = null;
let globalFeatureImportance = null;
let lastPrediction = null;

// Premium Color Palette
const COLORS = {
    emerald: 'rgba(16, 185, 129, ',
    cyan: 'rgba(6, 182, 212, ',
    violet: 'rgba(139, 92, 246, ',
    amber: 'rgba(245, 158, 11, ',
    rose: 'rgba(244, 63, 94, ',
    blue: 'rgba(59, 130, 246, ',
    mint: 'rgba(52, 211, 153, '
};

// ============================================
// THEME ENGINE (LIGHT / DARK TOGGLE)
// ============================================
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('agri_theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('agri_theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    };

    applyTheme(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
}

// ============================================
// SINGLE PAGE NAVIGATION & MOBILE DRAWER
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .sub-nav-link, .nav-logo');
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    window.switchView = function(viewId) {
        document.querySelectorAll('.app-view').forEach(view => {
            view.classList.remove('active-view');
        });
        document.querySelectorAll('.nav-link, .sub-nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) {
            targetView.classList.add('active-view');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const targetLink = document.querySelectorAll(`[data-view="${viewId}"]`);
        targetLink.forEach(link => link.classList.add('active'));

        if (viewId === 'dashboard' || viewId === 'comparison') {
            window.dispatchEvent(new Event('resize'));
        }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetView = link.getAttribute('data-view');
            if (targetView) {
                e.preventDefault();
                switchView(targetView);
                if (navLinksContainer) navLinksContainer.classList.remove('open');
            }
        });
    });

    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });
    }

    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'about', 'predict', 'advisory', 'dashboard', 'comparison', 'history', 'enhancements'].includes(hash)) {
        switchView(hash);
    }
}

// ============================================
// DUAL SYNCHRONIZED RANGE SLIDERS & BADGES
// ============================================
function initRangeSliders() {
    const fields = [
        { id: 'rainfall', range: 'rainfallRange', badge: 'rainfallBadge', unit: 'mm' },
        { id: 'temperature', range: 'temperatureRange', badge: 'temperatureBadge', unit: '°C' },
        { id: 'fertilizer', range: 'fertilizerRange', badge: 'fertilizerBadge', unit: 'kg' },
        { id: 'nitrogen', range: 'nitrogenRange', badge: 'nitrogenBadge', unit: '' },
        { id: 'phosphorus', range: 'phosphorusRange', badge: 'phosphorusBadge', unit: '' },
        { id: 'potassium', range: 'potassiumRange', badge: 'potassiumBadge', unit: '' },
        { id: 'land', range: 'landRange', badge: 'landBadge', unit: 'Acres' }
    ];

    fields.forEach(field => {
        const numInput = document.getElementById(field.id);
        const rangeInput = document.getElementById(field.range);
        const badge = document.getElementById(field.badge);

        if (!numInput || !rangeInput || !badge) return;

        const updateVal = (val) => {
            numInput.value = val;
            rangeInput.value = val;
            badge.textContent = `${val} ${field.unit}`.trim();
        };

        rangeInput.addEventListener('input', (e) => updateVal(e.target.value));
        numInput.addEventListener('input', (e) => updateVal(e.target.value));
        updateVal(numInput.value || rangeInput.value);
    });
}

// ============================================
// AGRICULTURAL PRESET QUICK-FILLS
// ============================================
function initPresets() {
    const presetData = {
        wheat: { rainfall: 280, temperature: 22, fertilizer: 140, nitrogen: 110, phosphorus: 55, potassium: 70, land: 5 },
        corn: { rainfall: 350, temperature: 28, fertilizer: 180, nitrogen: 135, phosphorus: 65, potassium: 85, land: 5 },
        rice: { rainfall: 420, temperature: 30, fertilizer: 160, nitrogen: 120, phosphorus: 60, potassium: 90, land: 5 },
        drought: { rainfall: 90, temperature: 42, fertilizer: 40, nitrogen: 30, phosphorus: 25, potassium: 35, land: 5 }
    };

    const presetBtns = document.querySelectorAll('.preset-btn');
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            presetBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const key = btn.getAttribute('data-preset');
            const data = presetData[key];
            if (!data) return;

            Object.keys(data).forEach(param => {
                const numInput = document.getElementById(param);
                const rangeInput = document.getElementById(`${param}Range`);
                const badge = document.getElementById(`${param}Badge`);

                if (numInput && rangeInput) {
                    numInput.value = data[param];
                    rangeInput.value = data[param];
                    if (badge) {
                        const unit = param === 'rainfall' ? 'mm' : param === 'temperature' ? '°C' : param === 'fertilizer' ? 'kg' : param === 'land' ? 'Acres' : '';
                        badge.textContent = `${data[param]} ${unit}`.trim();
                    }
                }
            });

            // Trigger prediction submit
            const form = document.getElementById('agriPredictForm');
            if (form) form.dispatchEvent(new Event('submit'));
        });
    });
}

// ============================================
// MICRO-ANIMATIONS & STAT COUNTERS
// ============================================
function initAnimations() {
    const counters = document.querySelectorAll('.stat-val[data-target]');
    const runCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const duration = 1200;
            const intervalTime = 25;
            const step = Math.ceil(target / (duration / intervalTime));

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = current + suffix;
                }
            }, intervalTime);
        });
    };
    setTimeout(runCounters, 200);
}

// ============================================
// CORE DATA LOADER
// ============================================
async function loadAllData() {
    try {
        const [statsRes, chartRes, metricsRes, featureRes] = await Promise.all([
            fetch('/api/data-stats'),
            fetch('/api/chart-data'),
            fetch('/api/model-metrics'),
            fetch('/api/feature-importance')
        ]);

        globalDataStats = await statsRes.json();
        globalChartData = await chartRes.json();
        globalModelMetrics = await metricsRes.json();
        globalFeatureImportance = await featureRes.json();

        populateModelComparison();
        renderDashboardCharts();
    } catch (err) {
        console.error("Failed to load backend intelligence data:", err);
    }
}

// ============================================
// MODEL COMPARISON PANEL
// ============================================
function populateModelComparison() {
    if (!globalModelMetrics) return;

    const dt = globalModelMetrics.decision_tree;
    const rf = globalModelMetrics.random_forest;

    document.getElementById('compDtMae').textContent = dt.mae;
    document.getElementById('compDtMse').textContent = dt.mse;
    document.getElementById('compDtRmse').textContent = dt.rmse || Math.sqrt(dt.mse).toFixed(4);
    document.getElementById('compDtR2').textContent = (dt.r2 * 100).toFixed(2) + '%';

    document.getElementById('compRfMae').textContent = rf.mae;
    document.getElementById('compRfMse').textContent = rf.mse;
    document.getElementById('compRfRmse').textContent = rf.rmse || Math.sqrt(rf.mse).toFixed(4);
    document.getElementById('compRfR2').textContent = (rf.r2 * 100).toFixed(2) + '%';

    const canvas = document.getElementById('chartModelMetricsAccuracy');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['MAE (Error)', 'MSE (Variance)', 'RMSE'],
            datasets: [
                {
                    label: 'Decision Tree',
                    data: [dt.mae, dt.mse, dt.rmse || Math.sqrt(dt.mse)],
                    backgroundColor: COLORS.rose + '0.7)',
                    borderColor: COLORS.rose + '1)',
                    borderWidth: 2,
                    borderRadius: 8
                },
                {
                    label: 'Random Forest (Ensemble)',
                    data: [rf.mae, rf.mse, rf.rmse || Math.sqrt(rf.mse)],
                    backgroundColor: COLORS.emerald + '0.7)',
                    borderColor: COLORS.emerald + '1)',
                    borderWidth: 2,
                    borderRadius: 8
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { font: { family: "'Space Grotesk', sans-serif", weight: '600' } } }
            },
            scales: {
                y: { grid: { color: 'rgba(148, 163, 184, 0.1)' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// ============================================
// ANALYTICS CHARTS GENERATOR
// ============================================
function renderDashboardCharts() {
    if (!globalChartData) return;

    const renderHist = (canvasId, data, color, label) => {
        const el = document.getElementById(canvasId);
        if (!el) return;
        const min = Math.min(...data);
        const max = Math.max(...data);
        const bins = 12;
        const width = (max - min) / bins;
        const counts = new Array(bins).fill(0);
        const labels = [];

        for (let i = 0; i < bins; i++) {
            labels.push((min + i * width).toFixed(1));
        }
        data.forEach(val => {
            let idx = Math.floor((val - min) / width);
            if (idx >= bins) idx = bins - 1;
            counts[idx]++;
        });

        new Chart(el, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label,
                    data: counts,
                    backgroundColor: color + '0.6)',
                    borderColor: color + '1)',
                    borderWidth: 2,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(148, 163, 184, 0.1)' } }
                }
            }
        });
    };

    renderHist('chartRainfallModern', globalChartData.rainfall, COLORS.cyan, 'Rainfall (mm)');
    renderHist('chartTemperatureModern', globalChartData.temperature, COLORS.rose, 'Temperature (°C)');
    renderHist('chartFertilizerModern', globalChartData.fertilizer, COLORS.violet, 'Fertilizer (kg)');

    const yieldData = globalChartData.yield;
    const lowCount = yieldData.filter(y => y < 30).length;
    const medCount = yieldData.filter(y => y >= 30 && y <= 50).length;
    const highCount = yieldData.filter(y => y > 50).length;

    const pieEl = document.getElementById('chartYieldDistributionModern');
    if (pieEl) {
        new Chart(pieEl, {
            type: 'doughnut',
            data: {
                labels: ['Low Yield (<30 Q/Acre)', 'Medium Yield (30-50 Q/Acre)', 'High Yield (>50 Q/Acre)'],
                datasets: [{
                    data: [lowCount, medCount, highCount],
                    backgroundColor: [COLORS.rose + '0.8)', COLORS.amber + '0.8)', COLORS.emerald + '0.8)'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    const renderScatter = (canvasId, scatterObj, color, xLabel) => {
        const el = document.getElementById(canvasId);
        if (!el) return;
        const scatterData = scatterObj.x.map((xVal, idx) => ({ x: xVal, y: scatterObj.y[idx] }));
        new Chart(el, {
            type: 'scatter',
            data: {
                datasets: [{
                    data: scatterData,
                    backgroundColor: color + '0.6)',
                    borderColor: color + '1)',
                    borderWidth: 1,
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: xLabel }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
                    y: { title: { display: true, text: 'Yield (Q/Acre)' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } }
                }
            }
        });
    };

    renderScatter('chartScatterRainModern', globalChartData.scatter_rainfall_yield, COLORS.cyan, 'Rainfall (mm)');
    renderScatter('chartScatterTempModern', globalChartData.scatter_temp_yield, COLORS.rose, 'Temperature (°C)');
    renderScatter('chartScatterFertModern', globalChartData.scatter_fertilizer_yield, COLORS.violet, 'Fertilizer (kg)');

    const tabBtns = document.querySelectorAll('[data-chart-grp]');
    const panels = document.querySelectorAll('.dashboard-panel');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active-panel'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-chart-grp');
            document.getElementById(`panel-${target}`)?.classList.add('active-panel');
        });
    });
}

// ============================================
// PREDICTION SUBMISSION & VALIDATION
// ============================================
function initPredictionForm() {
    const form = document.getElementById('agriPredictForm');
    const predictBtn = document.getElementById('predictBtn');
    const validationError = document.getElementById('validationError');

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        validationError.textContent = "";

        const rainfall = parseFloat(document.getElementById('rainfall').value);
        const temp = parseFloat(document.getElementById('temperature').value);
        const fertilizer = parseFloat(document.getElementById('fertilizer').value);
        const nitrogen = parseFloat(document.getElementById('nitrogen').value);
        const phosphorus = parseFloat(document.getElementById('phosphorus').value);
        const potassium = parseFloat(document.getElementById('potassium').value);
        const land = parseFloat(document.getElementById('land').value || 1);

        if (isNaN(rainfall) || rainfall < 0 || rainfall > 500) {
            validationError.textContent = "Rainfall must be between 0 and 500 mm.";
            return;
        }
        if (isNaN(temp) || temp < 0 || temp > 50) {
            validationError.textContent = "Temperature must be between 0 and 50 °C.";
            return;
        }
        if (isNaN(fertilizer) || fertilizer < 0 || fertilizer > 500) {
            validationError.textContent = "Fertilizer must be between 0 and 500 kg.";
            return;
        }

        predictBtn.disabled = true;
        predictBtn.innerHTML = `<span><i class="fa-solid fa-spinner fa-spin"></i> Calculating ML Prediction...</span>`;

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rainfall, temperature: temp, fertilizer, nitrogen, phosphorus, potassium })
            });

            const res = await response.json();
            if (res.success) {
                const yieldVal = parseFloat(res.recommended).toFixed(2);
                const dtYield = parseFloat(res.decision_tree).toFixed(2);
                const rfYield = parseFloat(res.random_forest).toFixed(2);
                const totalYield = (parseFloat(res.recommended) * land).toFixed(2);

                document.getElementById('resultPlaceholder').style.display = 'none';
                document.getElementById('resultContent').classList.remove('hidden');
                document.getElementById('resultValue').textContent = yieldVal;

                document.getElementById('resRfVal').textContent = `${rfYield} Q/Acre`;
                document.getElementById('resDtVal').textContent = `${dtYield} Q/Acre`;

                const totalValEl = document.getElementById('resultTotalValue');
                const totalAcresEl = document.getElementById('resultTotalAcres');
                if (totalValEl && totalAcresEl) {
                    totalValEl.textContent = totalYield;
                    totalAcresEl.textContent = land;
                }

                const yieldNum = parseFloat(res.recommended);
                let category = "Low";
                let categoryClass = "badge-danger";
                if (yieldNum >= 45.0) {
                    category = "High";
                    categoryClass = "badge-success";
                } else if (yieldNum >= 25.0) {
                    category = "Medium";
                    categoryClass = "badge-warning";
                }

                const catBadge = document.getElementById('resCategory');
                if (catBadge) {
                    catBadge.className = `meta-val badge ${categoryClass}`;
                    catBadge.textContent = category;
                }

                const confidence = res.confidence || 94;
                const confEl = document.getElementById('resConfidence');
                const confFill = document.getElementById('resConfidenceFill');
                if (confEl && confFill) {
                    confEl.textContent = confidence + '%';
                    confFill.style.width = confidence + '%';
                }

                const advisoryObj = computeAdvisories(rainfall, temp, nitrogen, phosphorus, potassium, yieldVal);
                updateAdvisoryUI(advisoryObj);

                lastPrediction = {
                    date: new Date().toLocaleString(),
                    inputs: { rainfall, temp, nitrogen, phosphorus, potassium, fertilizer, land },
                    yield: yieldVal,
                    dtYield: dtYield,
                    rfYield: rfYield,
                    totalYield: totalYield,
                    category,
                    confidence: confidence,
                    advisory: advisoryObj
                };
                localStorage.setItem('agri_last_prediction', JSON.stringify(lastPrediction));
                saveToHistory(lastPrediction);
            } else {
                validationError.textContent = "Error: " + res.error;
            }
        } catch (err) {
            validationError.textContent = "Unable to connect to prediction engine.";
        } finally {
            predictBtn.disabled = false;
            predictBtn.innerHTML = `<span>🌾 Calculate Expected Yield</span> <i class="fa-solid fa-bolt"></i>`;
        }
    });

    document.getElementById('btnGoToAdvisory')?.addEventListener('click', () => switchView('advisory'));
    document.getElementById('btnDownloadReport')?.addEventListener('click', () => downloadPDFReport());
}

// ============================================
// FARM ADVISORY LOGIC
// ============================================
function computeAdvisories(rain, temp, n, p, k, yieldVal) {
    const advice = {
        rainfall: { check: true, text: "Optimal rainfall parameters for target crop" },
        nitrogen: { check: true, text: "Sufficient Nitrogen (N) concentration" },
        potassium: { check: true, text: "Balanced Potassium (K) index" },
        performance: { check: true, text: "High crop performance forecast" },
        influential: "Rainfall",
        risk: "Low",
        action: "Maintain balanced irrigation & fertilizer schedule"
    };

    if (rain < 150) {
        advice.rainfall = { check: false, text: "Low rainfall detected - Implement drip/sprinkler irrigation" };
    } else if (rain > 400) {
        advice.rainfall = { check: false, text: "High precipitation - Ensure proper field drainage" };
    }

    if (n < 60) {
        advice.nitrogen = { check: false, text: "Nitrogen deficit - Apply urea or ammonium nitrate" };
    } else if (n > 150) {
        advice.nitrogen = { check: false, text: "Excessive Nitrogen - Reduce urea to prevent crop lodging" };
    }

    if (k < 70) {
        advice.potassium = { check: false, text: "Potassium deficient - Supplement with muriate of potash" };
    }

    if (yieldVal < 30) {
        advice.performance = { check: false, text: "Sub-optimal harvest forecast - Nutrient remediation recommended" };
        advice.risk = "High";
        advice.action = "Conduct full soil testing and add balanced NPK fertilizer";
    } else if (yieldVal < 45) {
        advice.risk = "Medium";
    }

    return advice;
}

function updateAdvisoryUI(advisory) {
    const content = document.getElementById('advisoryContent');
    if (content) content.classList.remove('hidden');

    const updateRow = (iconId, textId, rule) => {
        const iconEl = document.getElementById(iconId);
        const textEl = document.getElementById(textId);
        if (iconEl && textEl) {
            iconEl.innerHTML = rule.check ? 
                `<i class="fa-solid fa-circle-check" style="color: var(--primary);"></i>` : 
                `<i class="fa-solid fa-triangle-exclamation" style="color: var(--accent-amber);"></i>`;
            textEl.textContent = rule.text;
        }
    };

    updateRow('checkRainfallIcon', 'checkRainfallText', advisory.rainfall);
    updateRow('checkNitrogenIcon', 'checkNitrogenText', advisory.nitrogen);
    updateRow('checkPotassiumIcon', 'checkPotassiumText', advisory.potassium);
    updateRow('checkPerformanceIcon', 'checkPerformanceText', advisory.performance);

    const infEl = document.getElementById('dssInfluential');
    const riskEl = document.getElementById('dssRisk');
    const actEl = document.getElementById('dssAction');

    if (infEl) infEl.textContent = advisory.influential;
    if (riskEl) {
        riskEl.textContent = advisory.risk;
        riskEl.style.color = advisory.risk === 'Low' ? 'var(--primary)' : advisory.risk === 'Medium' ? 'var(--accent-amber)' : 'var(--accent-rose)';
    }
    if (actEl) actEl.textContent = advisory.action;
}

// ============================================
// PREDICTION REGISTRY HISTORY MANAGER
// ============================================
function initHistory() {
    renderHistoryTable();
    populateAdvisorySelector();

    document.getElementById('btnClearHistory')?.addEventListener('click', () => {
        localStorage.removeItem('agri_prediction_history');
        localStorage.removeItem('agri_last_prediction');
        renderHistoryTable();
        populateAdvisorySelector();
    });

    document.getElementById('advisoryPredictionSelect')?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val !== "") {
            const index = parseInt(val);
            let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');
            if (history[index]) {
                lastPrediction = history[index];
                updateAdvisoryUI(lastPrediction.advisory);
            }
        }
    });
}

function saveToHistory(record) {
    let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');
    history.unshift(record);
    localStorage.setItem('agri_prediction_history', JSON.stringify(history));
    renderHistoryTable();
    populateAdvisorySelector();
}

function populateAdvisorySelector() {
    const select = document.getElementById('advisoryPredictionSelect');
    if (!select) return;

    let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');
    if (history.length === 0) {
        select.innerHTML = `<option value="">-- No predictions recorded in history --</option>`;
        return;
    }

    let options = `<option value="">-- Select Saved Record to View Advisory --</option>`;
    history.forEach((rec, idx) => {
        options += `<option value="${idx}">Prediction on ${rec.date} (Yield: ${rec.yield} Q/Acre)</option>`;
    });
    select.innerHTML = options;
}

function renderHistoryTable() {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return;
    let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');

    if (history.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
                    No prediction history recorded yet. Run a calculation above.
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = history.map((rec, index) => {
        const landVal = rec.inputs.land || 1;
        const totalVal = rec.totalYield || (parseFloat(rec.yield) * landVal).toFixed(2);
        const inpStr = `Rain: ${rec.inputs.rainfall}mm | Temp: ${rec.inputs.temp}°C | Fert: ${rec.inputs.fertilizer}kg | NPK: ${rec.inputs.nitrogen}-${rec.inputs.phosphorus}-${rec.inputs.potassium}`;
        return `
            <tr>
                <td>${rec.date}</td>
                <td><small>${inpStr}</small></td>
                <td><strong style="color: var(--primary);">${rec.yield} Q/Acre</strong><br><small style="color: var(--text-muted);">Total: ${totalVal} Q</small></td>
                <td>${rec.advisory?.action || 'Maintain schedule'}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="downloadSpecificReport(${index})">
                        <i class="fa-solid fa-file-pdf"></i> PDF
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

window.downloadSpecificReport = function(index) {
    let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');
    if (history[index]) {
        lastPrediction = history[index];
        downloadPDFReport();
    }
};

// ============================================
// PDF REPORT GENERATOR
// ============================================
function downloadPDFReport() {
    if (!lastPrediction) {
        alert("Please calculate a prediction first to generate a report.");
        return;
    }

    let jsPDFClass = null;
    if (window.jspdf && window.jspdf.jsPDF) {
        jsPDFClass = window.jspdf.jsPDF;
    } else if (window.jsPDF) {
        jsPDFClass = window.jsPDF;
    }

    if (jsPDFClass) {
        try {
            const doc = new jsPDFClass({ orientation: 'portrait', unit: 'mm', format: 'a4' });

            // Header Banner
            doc.setFillColor(16, 185, 129);
            doc.rect(0, 0, 210, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(18);
            doc.text("Smart Agricultural Intelligence Platform", 15, 18);

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(11);
            doc.text("Crop Yield Prediction & Advisory Report", 15, 26);
            doc.text(`Generated: ${lastPrediction.date}`, 15, 33);

            // Inputs Section
            doc.setTextColor(15, 23, 42);
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(13);
            doc.text("Input Soil & Weather Parameters", 15, 52);
            doc.line(15, 55, 195, 55);

            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);
            let y = 63;
            const inp = lastPrediction.inputs;

            const rows = [
                ["Rainfall", `${inp.rainfall} mm`, "Nitrogen (N)", `${inp.nitrogen}`],
                ["Temperature", `${inp.temp} °C`, "Phosphorus (P)", `${inp.phosphorus}`],
                ["Fertilizer", `${inp.fertilizer} kg`, "Potassium (K)", `${inp.potassium}`],
                ["Land Area", `${inp.land || 1} Acres`, "", ""]
            ];

            rows.forEach(r => {
                doc.text(`${r[0]}: ${r[1]}`, 15, y);
                if (r[2]) doc.text(`${r[2]}: ${r[3]}`, 110, y);
                y += 7;
            });

            // Yield Section
            y += 5;
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(13);
            doc.text("Yield Calculation Output", 15, y);
            doc.line(15, y + 3, 195, y + 3);

            y += 10;
            doc.setFillColor(241, 245, 249);
            doc.rect(15, y - 5, 180, 20, 'F');

            doc.setTextColor(16, 185, 129);
            doc.setFontSize(16);
            doc.text(`${lastPrediction.yield} Quintals / Acre`, 20, y + 5);

            doc.setTextColor(15, 23, 42);
            doc.setFontSize(10);
            const totalYieldStr = lastPrediction.totalYield || (parseFloat(lastPrediction.yield) * (inp.land || 1)).toFixed(2);
            doc.text(`Total Harvest: ${totalYieldStr} Quintals (${inp.land || 1} Acres)`, 20, y + 11);

            doc.text(`Model: Random Forest Regressor`, 115, y + 5);
            doc.text(`Confidence: ${lastPrediction.confidence || 94}%`, 115, y + 11);

            // Advisory Section
            y += 25;
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(13);
            doc.text("Agronomic Advisory Summary", 15, y);
            doc.line(15, y + 3, 195, y + 3);

            y += 10;
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(10);

            const checklist = [
                lastPrediction.advisory?.rainfall?.text || "Optimal rainfall parameters",
                lastPrediction.advisory?.nitrogen?.text || "Sufficient Nitrogen concentration",
                lastPrediction.advisory?.potassium?.text || "Balanced Potassium index",
                lastPrediction.advisory?.performance?.text || "High crop performance forecast"
            ];

            checklist.forEach(item => {
                doc.text(`• ${item}`, 18, y);
                y += 7;
            });

            doc.save(`Crop_Yield_Advisory_Report_${Date.now()}.pdf`);
            return;
        } catch (e) {
            console.warn("jsPDF save error, launching fallback PDF print view:", e);
        }
    }

    generateHTMLPrintPDF(lastPrediction);
}

function generateHTMLPrintPDF(record) {
    const printWin = window.open('', '_blank');
    if (!printWin) {
        alert("Please allow popups to generate the PDF report.");
        return;
    }

    const inp = record.inputs;
    const totalYieldStr = record.totalYield || (parseFloat(record.yield) * (inp.land || 1)).toFixed(2);

    printWin.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Crop Yield Advisory Report - Smart Agri</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; }
                .header { background: #10b981; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
                .header h1 { margin: 0; font-size: 24px; }
                .header p { margin: 5px 0 0 0; opacity: 0.9; }
                .section { margin-bottom: 20px; }
                .section h2 { border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; color: #0f172a; }
                .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; }
                .card { background: #f8fafc; border: 1px solid #cbd5e1; border-left: 4px solid #10b981; padding: 15px; border-radius: 6px; }
                .yield-val { font-size: 28px; font-weight: bold; color: #10b981; }
                ul { line-height: 1.8; }
                @media print {
                    body { margin: 0; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Smart Agricultural Intelligence Platform</h1>
                <p>Crop Yield Prediction & Farm Advisory Report</p>
                <p><small>Generated on: ${record.date}</small></p>
            </div>

            <div class="section">
                <h2>Input Parameters</h2>
                <div class="grid">
                    <div><strong>Rainfall:</strong> ${inp.rainfall} mm</div>
                    <div><strong>Nitrogen (N):</strong> ${inp.nitrogen}</div>
                    <div><strong>Temperature:</strong> ${inp.temp} °C</div>
                    <div><strong>Phosphorus (P):</strong> ${inp.phosphorus}</div>
                    <div><strong>Fertilizer:</strong> ${inp.fertilizer} kg</div>
                    <div><strong>Potassium (K):</strong> ${inp.potassium}</div>
                    <div><strong>Land Area:</strong> ${inp.land || 1} Acres</div>
                </div>
            </div>

            <div class="section">
                <h2>Yield Calculation Result</h2>
                <div class="card">
                    <div class="yield-val">${record.yield} Quintals / Acre</div>
                    <p><strong>Total Harvest:</strong> ${totalYieldStr} Quintals (for ${inp.land || 1} Acres)</p>
                    <p><strong>Model:</strong> Random Forest Regressor | <strong>Confidence:</strong> ${record.confidence || 94}% | <strong>Category:</strong> ${record.category}</p>
                </div>
            </div>

            <div class="section">
                <h2>Farm Advisory Checklist</h2>
                <ul>
                    <li>${record.advisory?.rainfall?.text || "Optimal rainfall parameters"}</li>
                    <li>${record.advisory?.nitrogen?.text || "Sufficient Nitrogen concentration"}</li>
                    <li>${record.advisory?.potassium?.text || "Balanced Potassium index"}</li>
                    <li>${record.advisory?.performance?.text || "High crop performance forecast"}</li>
                </ul>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `);
    printWin.document.close();
}

function loadLastPrediction() {
    const saved = localStorage.getItem('agri_last_prediction');
    if (saved) {
        lastPrediction = JSON.parse(saved);
        updateAdvisoryUI(lastPrediction.advisory);
        populateAdvisorySelector();
    }
}

function initGuideModal() {
    const btnOpen = document.getElementById('btnOpenGuide');
    const btnClose = document.getElementById('btnCloseGuide');
    const overlay = document.getElementById('guideModalOverlay');

    if (btnOpen && btnClose && overlay) {
        btnOpen.addEventListener('click', () => overlay.classList.add('active'));
        btnClose.addEventListener('click', () => overlay.classList.remove('active'));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('active');
        });
    }
}
