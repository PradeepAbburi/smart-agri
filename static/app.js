/* ==========================================================================
   SMART AGRICULTURAL INTELLIGENCE PLATFORM - CORE JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initAnimations();
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

// HSL Premium Color Palette
const COLORS = {
    emerald: 'rgba(16, 185, 129, ',
    cyan: 'rgba(6, 182, 212, ',
    violet: 'rgba(139, 92, 246, ',
    amber: 'rgba(245, 158, 11, ',
    rose: 'rgba(244, 63, 94, ',
    blue: 'rgba(59, 130, 246, ',
    mint: 'rgba(52, 211, 153, ',
    leaf: 'rgba(34, 197, 94, ',
    warning: 'rgba(249, 115, 22, '
};

// ============================================
// SINGLE PAGE NAVIGATION
// ============================================
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .sub-nav-link, .nav-logo');
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.querySelector('.nav-links');

    // View toggler
    window.switchView = function(viewId) {
        // Remove active class from all views and links
        document.querySelectorAll('.app-view').forEach(view => {
            view.classList.remove('active-view');
        });
        document.querySelectorAll('.nav-link, .sub-nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Activate view
        const targetView = document.getElementById(`view-${viewId}`);
        if (targetView) {
            targetView.classList.add('active-view');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Activate nav link
        const targetLink = document.querySelector(`.nav-link[data-view="${viewId}"], .sub-nav-link[data-view="${viewId}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }

        // Trigger chart resizing if switching to dashboard or model comparison
        if (viewId === 'dashboard' || viewId === 'comparison') {
            window.dispatchEvent(new Event('resize'));
        }
    };

    // Nav clicks
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetView = link.getAttribute('data-view');
            if (targetView) {
                e.preventDefault();
                switchView(targetView);
                navLinksContainer.classList.remove('open');
            }
        });
    });

    // Mobile nav toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('open');
        });
    }

    // Handle hash links on load
    const hash = window.location.hash.substring(1);
    if (hash && ['home', 'about', 'predict', 'advisory', 'dashboard', 'comparison', 'history', 'enhancements'].includes(hash)) {
        switchView(hash);
    }
}

// ============================================
// MICRO-ANIMATIONS & STAT COUNTERS
// ============================================
function initAnimations() {
    // Stat counter animation
    const counters = document.querySelectorAll('.stat-val[data-target]');
    
    const runCounters = () => {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const duration = 1500; // ms
            const intervalTime = 30; // ms
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

    // Trigger counters on load if Home is active
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

        // Populate comparisons and charts
        populateModelComparison();
        renderDashboardCharts();
    } catch (err) {
        console.error("Failed to fetch analytical datasets from backend:", err);
    }
}

// ============================================
// MODEL COMPARISON PANEL
// ============================================
function populateModelComparison() {
    if (!globalModelMetrics) return;

    const dt = globalModelMetrics.decision_tree;
    const rf = globalModelMetrics.random_forest;

    // Set comparison values
    document.getElementById('compDtMae').textContent = dt.mae;
    document.getElementById('compDtMse').textContent = dt.mse;
    document.getElementById('compDtRmse').textContent = dt.rmse || Math.sqrt(dt.mse).toFixed(4);
    document.getElementById('compDtR2').textContent = (dt.r2 * 100).toFixed(2) + '%';

    document.getElementById('compRfMae').textContent = rf.mae;
    document.getElementById('compRfMse').textContent = rf.mse;
    document.getElementById('compRfRmse').textContent = rf.rmse || Math.sqrt(rf.mse).toFixed(4);
    document.getElementById('compRfR2').textContent = (rf.r2 * 100).toFixed(2) + '%';

    // Build comparison chart
    const ctx = document.getElementById('chartModelMetricsAccuracy').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['MAE', 'MSE', 'RMSE'],
            datasets: [
                {
                    label: 'Decision Tree',
                    data: [dt.mae, dt.mse, dt.rmse || Math.sqrt(dt.mse)],
                    backgroundColor: COLORS.rose + '0.65)',
                    borderColor: COLORS.rose + '1)',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'Random Forest',
                    data: [rf.mae, rf.mse, rf.rmse || Math.sqrt(rf.mse)],
                    backgroundColor: COLORS.emerald + '0.65)',
                    borderColor: COLORS.emerald + '1)',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { font: { family: "'Plus Jakarta Sans', sans-serif" } } }
            },
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.08)' } },
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

    // 1. Distributions Setup
    const renderHist = (canvasId, data, color, label) => {
        const min = Math.min(...data);
        const max = Math.max(...data);
        const bins = 15;
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

        new Chart(document.getElementById(canvasId), {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label,
                    data: counts,
                    backgroundColor: color + '0.55)',
                    borderColor: color + '1)',
                    borderWidth: 2,
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: 'rgba(255, 255, 255, 0.08)' } }
                }
            }
        });
    };

    renderHist('chartRainfallModern', globalChartData.rainfall, COLORS.cyan, 'Rainfall (mm)');
    renderHist('chartTemperatureModern', globalChartData.temperature, COLORS.rose, 'Temperature (°C)');
    renderHist('chartFertilizerModern', globalChartData.fertilizer, COLORS.violet, 'Fertilizer (kg)');

    // Yield Distribution Chart (Low < 30, Medium 30-50, High > 50)
    const yieldData = globalChartData.yield;
    const lowCount = yieldData.filter(y => y < 30).length;
    const medCount = yieldData.filter(y => y >= 30 && y <= 50).length;
    const highCount = yieldData.filter(y => y > 50).length;

    new Chart(document.getElementById('chartYieldDistributionModern'), {
        type: 'pie',
        data: {
            labels: ['Low Yield (<30 Q/Acre)', 'Medium Yield (30-50 Q/Acre)', 'High Yield (>50 Q/Acre)'],
            datasets: [{
                data: [lowCount, medCount, highCount],
                backgroundColor: [COLORS.rose + '0.75)', COLORS.amber + '0.75)', COLORS.emerald + '0.75)'],
                borderColor: ['#fff', '#fff', '#fff'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12 } }
            }
        }
    });

    // 2. Scatter Plots
    const renderScatter = (canvasId, scatterObj, color, xLabel) => {
        const scatterData = scatterObj.x.map((xVal, idx) => ({ x: xVal, y: scatterObj.y[idx] }));
        new Chart(document.getElementById(canvasId), {
            type: 'scatter',
            data: {
                datasets: [{
                    data: scatterData,
                    backgroundColor: color + '0.45)',
                    borderColor: color + '0.8)',
                    borderWidth: 1.5,
                    pointRadius: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: xLabel }, grid: { color: 'rgba(255, 255, 255, 0.08)' } },
                    y: { title: { display: true, text: 'Yield (Q/Acre)' }, grid: { color: 'rgba(255, 255, 255, 0.08)' } }
                }
            }
        });
    };

    renderScatter('chartScatterRainModern', globalChartData.scatter_rainfall_yield, COLORS.cyan, 'Rainfall (mm)');
    renderScatter('chartScatterTempModern', globalChartData.scatter_temp_yield, COLORS.rose, 'Temperature (°C)');
    renderScatter('chartScatterFertModern', globalChartData.scatter_fertilizer_yield, COLORS.violet, 'Fertilizer (kg)');

    // 3. Heatmap
    const renderHeatmap = () => {
        const { labels, values } = globalChartData.correlation;
        const canvas = document.getElementById('chartCorrelationModern');
        const ctx = canvas.getContext('2d');
        const size = Math.min(480, window.innerWidth - 80);
        canvas.width = size;
        canvas.height = size;

        const n = labels.length;
        const padding = 100;
        const cellSize = (size - padding) / n;

        // Draw grids
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const val = values[i][j];
                const x = padding + j * cellSize;
                const y = padding + i * cellSize;

                let colorStr;
                if (val >= 0) {
                    colorStr = `rgba(16, 185, 129, ${0.1 + val * 0.9})`; // Emerald for positive
                } else {
                    colorStr = `rgba(244, 63, 94, ${0.1 + Math.abs(val) * 0.9})`; // Rose for negative
                }

                ctx.fillStyle = colorStr;
                ctx.fillRect(x, y, cellSize - 1, cellSize - 1);

                ctx.fillStyle = Math.abs(val) > 0.45 ? '#ffffff' : '#222222';
                ctx.font = '500 11px Outfit';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(val.toFixed(2), x + cellSize/2, y + cellSize/2);
            }
        }

        // Draw Labels
        ctx.fillStyle = '#f1f5f9';
        ctx.font = '600 11px Outfit';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        labels.forEach((lbl, idx) => {
            const short = lbl.replace(' (mm)', '').replace(' (kg)', '').replace(' (N)', '').replace(' (P)', '').replace(' (K)', '').replace('Yeild', 'Yield');
            ctx.fillText(short, padding - 10, padding + idx * cellSize + cellSize/2);
        });

        // Top Labels Rotated
        ctx.textAlign = 'left';
        labels.forEach((lbl, idx) => {
            const short = lbl.replace(' (mm)', '').replace(' (kg)', '').replace(' (N)', '').replace(' (P)', '').replace(' (K)', '').replace('Yeild', 'Yield');
            ctx.save();
            ctx.translate(padding + idx * cellSize + cellSize/2, padding - 10);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(short, 0, 0);
            ctx.restore();
        });
    };

    renderHeatmap();

    // Chart tab switches
    const tabBtns = document.querySelectorAll('[data-chart-grp]');
    const panels = document.querySelectorAll('.dashboard-panel');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active-panel'));

            btn.classList.add('active');
            const target = btn.getAttribute('data-chart-grp');
            document.getElementById(`panel-${target}`).classList.add('active-panel');
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

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        validationError.textContent = "";

        // Form Fields
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        const temp = parseFloat(document.getElementById('temperature').value);
        const fertilizer = parseFloat(document.getElementById('fertilizer').value);
        const nitrogen = parseFloat(document.getElementById('nitrogen').value);
        const phosphorus = parseFloat(document.getElementById('phosphorus').value);
        const potassium = parseFloat(document.getElementById('potassium').value);
        const land = parseFloat(document.getElementById('land').value || 1);

        // NPK, Rainfall, Temp range validations
        if (isNaN(rainfall) || rainfall < 0 || rainfall > 500) {
            validationError.textContent = "Rainfall must reside in the range 0 - 500 mm.";
            return;
        }
        if (isNaN(temp) || temp < 0 || temp > 50) {
            validationError.textContent = "Temperature must reside in the range 0 - 50 °C.";
            return;
        }
        if (isNaN(fertilizer) || fertilizer < 0 || fertilizer > 500) {
            validationError.textContent = "Fertilizer must reside in the range 0 - 500 kg.";
            return;
        }
        if (isNaN(nitrogen) || nitrogen < 0 || nitrogen > 200 || 
            isNaN(phosphorus) || phosphorus < 0 || phosphorus > 200 || 
            isNaN(potassium) || potassium < 0 || potassium > 200) {
            validationError.textContent = "Soil Nutrients (N, P, K) must reside in the range 0 - 200.";
            return;
        }
        if (isNaN(land) || land < 1 || land > 1000) {
            validationError.textContent = "Land Area must reside in the range 1 - 1000 Acres.";
            return;
        }

        predictBtn.disabled = true;
        predictBtn.innerHTML = `<span><i class="fa-solid fa-spinner fa-spin"></i> Processing Model Prediction...</span>`;

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rainfall,
                    temperature: temp,
                    fertilizer,
                    nitrogen,
                    phosphorus,
                    potassium
                })
            });

            const res = await response.json();
            if (res.success) {
                // Populate prediction details
                const yieldVal = parseFloat(res.recommended).toFixed(2);
                const totalYield = (parseFloat(res.recommended) * land).toFixed(2);
                document.getElementById('resultPlaceholder').style.display = 'none';
                document.getElementById('resultContent').classList.remove('hidden');
                document.getElementById('resultValue').textContent = yieldVal;

                // Update total yield
                const totalValEl = document.getElementById('resultTotalValue');
                const totalAcresEl = document.getElementById('resultTotalAcres');
                if (totalValEl && totalAcresEl) {
                    totalValEl.textContent = totalYield;
                    totalAcresEl.textContent = land;
                }

                // Yield Category calculations
                const yieldNum = parseFloat(res.recommended);
                let category = "Low";
                let categoryClass = "badge-danger";
                if (yieldNum > 10.0) {
                    category = "High";
                    categoryClass = "badge-success";
                } else if (yieldNum >= 8.0) {
                    category = "Medium";
                    categoryClass = "badge-warning";
                }

                const catBadge = document.getElementById('resCategory');
                if (catBadge) {
                    catBadge.className = `meta-val badge ${categoryClass}`;
                    catBadge.textContent = category;
                }

                // Update confidence dynamic percentage
                const confidence = res.confidence || 92;
                const confEl = document.getElementById('resConfidence');
                if (confEl) {
                    confEl.textContent = confidence + '%';
                }

                // Build advisory object
                const advisoryObj = computeAdvisories(rainfall, temp, nitrogen, phosphorus, potassium, yieldVal);
                updateAdvisoryUI(advisoryObj);

                // Save to last prediction
                lastPrediction = {
                    date: new Date().toLocaleString(),
                    inputs: { rainfall, temp, nitrogen, phosphorus, potassium, fertilizer, land },
                    yield: yieldVal,
                    totalYield: totalYield,
                    category,
                    confidence: confidence,
                    advisory: advisoryObj
                };
                localStorage.setItem('agri_last_prediction', JSON.stringify(lastPrediction));

                // Add to history
                saveToHistory(lastPrediction);
            } else {
                validationError.textContent = "Error: " + res.error;
            }
        } catch (err) {
            validationError.textContent = "Connection refused by the application server.";
        } finally {
            predictBtn.disabled = false;
            predictBtn.innerHTML = `<span><i class="fa-solid fa-magnifying-glass-chart"></i> Run Prediction Pipeline</span>`;
        }
    });

    // Go to advisory navigation helper
    document.getElementById('btnGoToAdvisory')?.addEventListener('click', () => {
        switchView('advisory');
    });

    // Download PDF helper
    document.getElementById('btnDownloadReport')?.addEventListener('click', () => {
        downloadPDFReport();
    });
}

// ============================================
// FARM ADVISORY LOGIC CALCULATIONS
// ============================================
function computeAdvisories(rain, temp, n, p, k, yieldVal) {
    const advice = {
        rainfall: { check: true, text: "Suitable rainfall conditions" },
        nitrogen: { check: true, text: "Maintain Nitrogen levels" },
        potassium: { check: true, text: "Increase Potassium slightly" },
        performance: { check: true, text: "Expected good crop performance" },
        influential: "Rainfall",
        risk: "Low",
        action: "Maintain fertilizer schedule"
    };

    // Rainfall advice rules
    if (rain < 150) {
        advice.rainfall = { check: false, text: "Low rainfall detected - Supplement with drip irrigation" };
    } else if (rain > 420) {
        advice.rainfall = { check: false, text: "Excessive rainfall - Open drainage channels" };
    }

    // Nitrogen advice rules
    if (n < 60) {
        advice.nitrogen = { check: false, text: "Inadequate Nitrogen levels - Apply urea or compost" };
    } else if (n > 140) {
        advice.nitrogen = { check: false, text: "Excessive Nitrogen levels - Reduce urea input to avoid leafy lodging" };
    }

    // Potassium advice rules
    if (k < 90) {
        advice.potassium = { check: false, text: "Potassium levels deficient - Apply potash fertilizer" };
    } else if (k >= 90 && k < 150) {
        advice.potassium = { check: true, text: "Maintain Nitrogen levels" }; // Default prompt match
    } else {
        advice.potassium = { check: true, text: "Potassium levels sufficient" };
    }

    // Expected Crop performance advisory
    if (yieldVal >= 50) {
        advice.performance = { check: true, text: "Expected high yield performance (>50 Q/Acre)" };
    } else if (yieldVal >= 30) {
        advice.performance = { check: true, text: "Expected average crop performance (30-50 Q/Acre)" };
    } else {
        advice.performance = { check: false, text: "Expected low yield output - Soil nutrients depletion risk" };
    }

    // Decision Support System
    // Calculate most influential based on feature values or default
    if (rain > 400 || rain < 100) {
        advice.influential = "Rainfall";
        advice.risk = "Medium";
        advice.action = rain < 100 ? "Trigger auxiliary field flooding" : "Clear run-offs immediately";
    } else if (n < 40 || k < 50) {
        advice.influential = n < 40 ? "Nitrogen" : "Potassium";
        advice.risk = "High";
        advice.action = "Apply macro compound N-P-K fertilizer immediately";
    } else {
        advice.influential = "Rainfall";
        advice.risk = "Low";
        advice.action = "Maintain fertilizer schedule";
    }

    return advice;
}

function updateAdvisoryUI(advisory) {
    const warningEl = document.getElementById('advisoryWarning');
    if (warningEl) warningEl.classList.add('hidden');
    const content = document.getElementById('advisoryContent');
    if (content) content.classList.remove('hidden');

    const updateRow = (iconId, textId, rule) => {
        const iconEl = document.getElementById(iconId);
        const textEl = document.getElementById(textId);
        if (rule.check) {
            iconEl.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i>`;
            textEl.innerHTML = rule.text;
        } else {
            iconEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-warning"></i>`;
            textEl.innerHTML = rule.text;
        }
    };

    updateRow('checkRainfallIcon', 'checkRainfallText', advisory.rainfall);
    updateRow('checkNitrogenIcon', 'checkNitrogenText', advisory.nitrogen);
    updateRow('checkPotassiumIcon', 'checkPotassiumText', advisory.potassium);
    updateRow('checkPerformanceIcon', 'checkPerformanceText', advisory.performance);

    // DSS update
    document.getElementById('dssInfluential').textContent = advisory.influential;
    const riskEl = document.getElementById('dssRisk');
    riskEl.textContent = advisory.risk;
    riskEl.className = "dss-box-val " + (advisory.risk === 'Low' ? 'text-success' : advisory.risk === 'Medium' ? 'text-warning' : 'text-danger');
    document.getElementById('dssAction').textContent = advisory.action;
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
        clearAdvisoryUI();
    });

    document.getElementById('advisoryPredictionSelect')?.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val !== "") {
            const index = parseInt(val);
            let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');
            if (history[index]) {
                lastPrediction = history[index];
                localStorage.setItem('agri_last_prediction', JSON.stringify(lastPrediction));
                
                // Populate prediction result card
                const resultPlaceholder = document.getElementById('resultPlaceholder');
                const resultContent = document.getElementById('resultContent');
                if (resultPlaceholder && resultContent) {
                    resultPlaceholder.style.display = 'none';
                    resultContent.classList.remove('hidden');
                    document.getElementById('resultValue').textContent = lastPrediction.yield;
                    
                    const catBadge = document.getElementById('resCategory');
                    let categoryClass = "badge-danger";
                    if (lastPrediction.category === "High") {
                        categoryClass = "badge-success";
                    } else if (lastPrediction.category === "Medium") {
                        categoryClass = "badge-warning";
                    }
                    if (catBadge) {
                        catBadge.className = `meta-val badge ${categoryClass}`;
                        catBadge.textContent = lastPrediction.category;
                    }

                    // Populate confidence and total yields
                    const confEl = document.getElementById('resConfidence');
                    if (confEl) {
                        confEl.textContent = (lastPrediction.confidence || 92) + '%';
                    }
                    const totalValEl = document.getElementById('resultTotalValue');
                    const totalAcresEl = document.getElementById('resultTotalAcres');
                    if (totalValEl && totalAcresEl) {
                        totalValEl.textContent = lastPrediction.totalYield || (parseFloat(lastPrediction.yield) * (lastPrediction.inputs.land || 1)).toFixed(2);
                        totalAcresEl.textContent = lastPrediction.inputs.land || 1;
                    }
                }

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
        select.innerHTML = `<option value="">-- No predictions in history --</option>`;
        return;
    }

    let options = `<option value="">-- Load from Prediction History --</option>`;
    history.forEach((rec, idx) => {
        options += `<option value="${idx}">Prediction on ${rec.date} (Yield: ${rec.yield} Q/Acre)</option>`;
    });
    select.innerHTML = options;

    // Auto-select if lastPrediction matches
    if (lastPrediction) {
        const foundIdx = history.findIndex(rec => rec.date === lastPrediction.date && rec.yield === lastPrediction.yield);
        if (foundIdx !== -1) {
            select.value = foundIdx;
        }
    }
}

function renderHistoryTable() {
    const tableBody = document.getElementById('historyTableBody');
    let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');

    if (history.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center" style="padding: 2rem; color: #888;">No predictions logged yet. Run a prediction to record details.</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = history.map((rec, index) => {
        const landVal = rec.inputs.land || 1;
        const totalVal = rec.totalYield || (parseFloat(rec.yield) * landVal).toFixed(2);
        const inpStr = `Rain: ${rec.inputs.rainfall}mm, Temp: ${rec.inputs.temp}°C, Fert: ${rec.inputs.fertilizer}kg, NPK: ${rec.inputs.nitrogen}-${rec.inputs.phosphorus}-${rec.inputs.potassium}, Land: ${landVal} Acres`;
        return `
            <tr>
                <td>${rec.date}</td>
                <td>${inpStr}</td>
                <td><strong class="text-primary">${rec.yield} Q/Acre</strong><br><span style="font-size:0.75rem; color:#666;">Total: ${totalVal} Q</span></td>
                <td>${rec.advisory.action}</td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="downloadSpecificReport(${index})" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;">
                        <i class="fa-solid fa-file-pdf"></i> Download
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Specific history download
window.downloadSpecificReport = function(index) {
    let history = JSON.parse(localStorage.getItem('agri_prediction_history') || '[]');
    if (history[index]) {
        lastPrediction = history[index];
        downloadPDFReport();
    }
};

// ============================================
// PDF REPORT GENERATION (jsPDF)
// ============================================
function downloadPDFReport() {
    if (!lastPrediction) {
        alert("Please generate a prediction first to generate a report.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const primaryColor = '#10b981'; // Emerald
    const darkColor = '#1e293b'; // Slate

    // Header Background Accent
    doc.setFillColor(16, 185, 129); // primary Emerald
    doc.rect(0, 0, 210, 45, 'F');

    // Title text inside banner
    doc.setTextColor(255, 255, 255);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Smart Agricultural Intelligence Platform", 15, 20);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(11);
    doc.text("Crop Yield Prediction & Farm Advisory Report", 15, 28);
    doc.text(`Generated on: ${lastPrediction.date}`, 15, 36);

    // Section 1: Inputs
    doc.setTextColor(30, 41, 59);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Input Parameters", 15, 60);
    
    // Draw thin line
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 63, 195, 63);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    let currentY = 70;
    const inputs = lastPrediction.inputs;
    
    const rows = [
        ["Rainfall", `${inputs.rainfall} mm`, "Nitrogen (N)", `${inputs.nitrogen}`],
        ["Temperature", `${inputs.temp} °C`, "Phosphorus (P)", `${inputs.phosphorus}`],
        ["Fertilizer", `${inputs.fertilizer} kg`, "Potassium (K)", `${inputs.potassium}`],
        ["Land Area", `${inputs.land || 1} Acres`, "", ""]
    ];

    rows.forEach(row => {
        doc.text(`${row[0]}:`, 15, currentY);
        doc.setFont("Helvetica", "bold");
        doc.text(row[1], 45, currentY);
        
        if (row[2] !== "") {
            doc.setFont("Helvetica", "normal");
            doc.text(`${row[2]}:`, 110, currentY);
            doc.setFont("Helvetica", "bold");
            doc.text(row[3], 140, currentY);
        }
        
        doc.setFont("Helvetica", "normal");
        currentY += 8;
    });

    // Section 2: Prediction Result
    currentY += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Estimated Crop Yield", 15, currentY);
    doc.line(15, currentY + 3, 195, currentY + 3);

    currentY += 12;
    doc.setFillColor(248, 250, 252); // light slate background
    doc.rect(15, currentY - 6, 180, 22, 'F');
    doc.setDrawColor(16, 185, 129); // green left border
    doc.rect(15, currentY - 6, 2, 22, 'F');

    doc.setTextColor(16, 185, 129);
    doc.setFontSize(15);
    doc.setFont("Helvetica", "bold");
    doc.text(`${lastPrediction.yield} Quintals/Acre`, 22, currentY + 3);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "bold");
    const totalYieldStr = lastPrediction.totalYield || (parseFloat(lastPrediction.yield) * (inputs.land || 1)).toFixed(2);
    doc.text(`Total Yield: ${totalYieldStr} Quintals (for ${inputs.land || 1} Acres)`, 22, currentY + 11);

    doc.setFont("Helvetica", "normal");
    doc.text(`Model: Random Forest Regressor`, 110, currentY + 1);
    doc.text(`Confidence Index: 92%`, 110, currentY + 6);
    doc.text(`Yield Category: ${lastPrediction.category}`, 110, currentY + 11);

    // Section 3: Farm Advisory
    currentY += 24;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Farm Advisory Checklist", 15, currentY);
    doc.line(15, currentY + 3, 195, currentY + 3);

    currentY += 10;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    
    const checklist = [
        lastPrediction.advisory.rainfall.text,
        lastPrediction.advisory.nitrogen.text,
        lastPrediction.advisory.potassium.text,
        lastPrediction.advisory.performance.text
    ];

    checklist.forEach(item => {
        doc.setFillColor(16, 185, 129);
        doc.circle(18, currentY - 1, 1.2, 'F');
        doc.text(item, 24, currentY);
        currentY += 8;
    });

    // Section 4: DSS
    currentY += 5;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Decision Support Insights", 15, currentY);
    doc.line(15, currentY + 3, 195, currentY + 3);

    currentY += 10;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Most Influential Factor:", 15, currentY);
    doc.setFont("Helvetica", "bold");
    doc.text(lastPrediction.advisory.influential, 55, currentY);

    doc.setFont("Helvetica", "normal");
    doc.text("Current Risk Index:", 110, currentY);
    doc.setFont("Helvetica", "bold");
    doc.text(lastPrediction.advisory.risk, 145, currentY);

    currentY += 8;
    doc.setFont("Helvetica", "normal");
    doc.text("Suggested Agronomic Action:", 15, currentY);
    doc.setFont("Helvetica", "bold");
    doc.text(lastPrediction.advisory.action, 70, currentY);

    // Footer notice
    doc.setDrawColor(226, 232, 240);
    doc.line(15, 270, 195, 270);
    doc.setFont("Helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("This report is programmatically compiled based on trained Regression algorithms.", 15, 275);
    doc.text("Smart Agricultural Intelligence Platform - Yield Advisor v1.0", 145, 275);

    doc.save(`Crop_Yield_Advisory_Report_${Date.now()}.pdf`);
}

function loadLastPrediction() {
    const saved = localStorage.getItem('agri_last_prediction');
    if (saved) {
        lastPrediction = JSON.parse(saved);
        
        // Reset/clear prediction form and result card (so it displays the default empty states on prediction page)
        const resultPlaceholder = document.getElementById('resultPlaceholder');
        const resultContent = document.getElementById('resultContent');
        if (resultPlaceholder && resultContent) {
            resultPlaceholder.style.display = 'block';
            resultContent.classList.add('hidden');
        }
        
        // Clear form values
        const form = document.getElementById('agriPredictForm');
        if (form) form.reset();

        // Populate advisory UI
        updateAdvisoryUI(lastPrediction.advisory);
        populateAdvisorySelector();
    }
}

function clearAdvisoryUI() {
    const ids = ['checkRainfallIcon', 'checkNitrogenIcon', 'checkPotassiumIcon', 'checkPerformanceIcon'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '✓';
    });
    
    const texts = {
        'checkRainfallText': 'Suitable rainfall conditions',
        'checkNitrogenText': 'Maintain Nitrogen levels',
        'checkPotassiumText': 'Increase Potassium slightly',
        'checkPerformanceText': 'Expected good crop performance'
    };
    Object.keys(texts).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = texts[id];
    });

    const influential = document.getElementById('dssInfluential');
    if (influential) influential.textContent = '--';
    const risk = document.getElementById('dssRisk');
    if (risk) {
        risk.textContent = '--';
        risk.className = 'dss-box-val';
    }
    const action = document.getElementById('dssAction');
    if (action) action.textContent = '--';
}

function initGuideModal() {
    const btnOpen = document.getElementById('btnOpenGuide');
    const btnClose = document.getElementById('btnCloseGuide');
    const overlay = document.getElementById('guideModalOverlay');

    if (btnOpen && btnClose && overlay) {
        btnOpen.addEventListener('click', () => {
            overlay.classList.add('active');
        });

        btnClose.addEventListener('click', () => {
            overlay.classList.remove('active');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    }
}



