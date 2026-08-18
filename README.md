# 🌾 Smart Agricultural Intelligence Platform

An advanced, interactive Flask web application powered by Machine Learning (Random Forest & Decision Tree Regressors) to predict crop yields (Quintals/Acre), evaluate soil nutrients (NPK), generate agronomic farm advisories, and export PDF reports.

![Live Platform](https://img.shields.io/badge/Vercel-Deployed-success?style=for-the-badge&logo=vercel)
![Python Version](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python)
![Machine Learning](https://img.shields.io/badge/ML-Scikit--Learn-orange?style=for-the-badge&logo=scikit-learn)

- **🌐 Live Demo (Vercel)**: [https://smart-agri-master.vercel.app](https://smart-agri-master.vercel.app)
- **💻 GitHub Repository**: [https://github.com/PradeepAbburi/smart-agri.git](https://github.com/PradeepAbburi/smart-agri.git)

---

## 💻 Project File Structure & Code Breakdown

Below is a detailed inventory of every file in the repository, explaining which code it contains and its specific function in the platform:

```
smart-agri-master/
├── app.py                         # Backend Flask API & ML Pipeline
├── templates/
│   └── index.html                 # Single Page Web UI Template
├── static/
│   ├── style.css                  # Responsive Glassmorphic CSS System (Light/Dark)
│   └── app.js                     # Frontend Engine, Presets, Charts & PDF Exporter
├── crop yield data sheet.xlsx     # Historical Agricultural Training Dataset
├── requirements.txt               # Python Dependencies Manifest
└── vercel.json                    # Vercel Deployment & Route Handler Config
```

### Detailed File & Code Mapping

| File Path | Technologies | Code Description & Responsibilities |
| :--- | :--- | :--- |
| **[`app.py`](file:///c:/Users/dines/Downloads/smart-agri-master/app.py)** | Python, Flask, Pandas, Scikit-Learn, NumPy, OpenPyXL | **Backend & ML Core Engine**:<br>• Loads Excel dataset using Pandas & OpenPyXL.<br>• Cleans dataset by removing invalid values and imputing missing data with medians.<br>• Trains `DecisionTreeRegressor` and `RandomForestRegressor` models.<br>• Exposes REST API endpoints:<br>&nbsp;&nbsp;- `/api/data-stats`: Dataset descriptive statistics.<br>&nbsp;&nbsp;- `/api/chart-data`: Distribution & correlation arrays.<br>&nbsp;&nbsp;- `/api/model-metrics`: R², MAE, MSE scores.<br>&nbsp;&nbsp;- `/api/predict`: Executes live ML prediction on user parameters. |
| **[`templates/index.html`](file:///c:/Users/dines/Downloads/smart-agri-master/templates/index.html)** | HTML5, FontAwesome 6, Google Fonts (Space Grotesk) | **UI Layout & Structure**:<br>• Top Navigation Bar with Light/Dark Theme toggle button.<br>• Quick Crop Presets (*Wheat*, *Corn*, *Rice*, *Drought*).<br>• Yield Prediction form with synchronized Range Sliders + Numeric Inputs.<br>• Prediction Results card with confidence gauge & total harvest calculator.<br>• Farm Advisory Checklist & Decision Support System (DSS).<br>• Exploratory Data Analysis (EDA) charts grid & Model Comparison metrics.<br>• Saved Prediction History table with PDF report buttons. |
| **[`static/style.css`](file:///c:/Users/dines/Downloads/smart-agri-master/static/style.css)** | CSS3, CSS Variables, Glassmorphism, Responsive Grid/Flexbox | **Design System & Styling**:<br>• Dual Light & Dark mode color theme systems (`[data-theme="dark"]`).<br>• Vibrant Emerald (`#10b981`) & Mint agricultural color palette.<br>• Modern Glassmorphism cards with subtle borders and shadows.<br>• Smooth CSS transitions for theme toggles, sliders, and button hovers.<br>• Complete media queries for 320px mobile screens up to 4K displays. |
| **[`static/app.js`](file:///c:/Users/dines/Downloads/smart-agri-master/static/app.js)** | JavaScript ES6+, Chart.js v4.4, jsPDF v2.5 | **Frontend Interactivity & Client Logic**:<br>• **Theme Manager**: Handles dark/light theme toggle and saves setting in `localStorage`.<br>• **Dual Slider Sync**: Synchronizes range sliders with numeric inputs & updates value badges in real time.<br>• **Preset Engine**: 1-click filling of standard parameter sets.<br>• **Prediction Handler**: Sends POST requests to `/api/predict` and updates result card & confidence bar.<br>• **Chart Engine**: Renders dynamic distribution histograms, scatter plots, and model comparison bar charts via Chart.js.<br>• **PDF Exporter**: Programmatically compiles and downloads formatted PDF reports (`Crop_Yield_Advisory_Report.pdf`) with fallback support. |
| **`crop yield data sheet.xlsx`** | Microsoft Excel Datasheet | **Training Data Source**:<br>• Contains historical records of rainfall (mm), temperature (°C), fertilizer (kg), Nitrogen (N), Phosphorus (P), Potassium (K), and yield (Quintals/Acre). |
| **[`requirements.txt`](file:///c:/Users/dines/Downloads/smart-agri-master/requirements.txt)** | Python Packaging | **Dependencies Manifest**:<br>• Specifies required Python libraries: `Flask`, `pandas`, `scikit-learn`, `numpy`, `openpyxl`. |
| **[`vercel.json`](file:///c:/Users/dines/Downloads/smart-agri-master/vercel.json)** | JSON / Vercel Serverless | **Cloud Deployment Config**:<br>• Configures `@vercel/python` serverless builder to route incoming HTTP requests to `app.py`. |

---

## 🛠️ Technologies & Frameworks Used

### 1. Backend & Data Science
* **Python 3.12**: Core programming language.
* **Flask (v3.1.0)**: Lightweight WSGI web application framework serving API endpoints and HTML pages.
* **Scikit-Learn (v1.6.0)**: Machine learning library used for training regression models (`DecisionTreeRegressor` and `RandomForestRegressor`).
* **Pandas (v2.2.3)** & **NumPy (v2.2.0)**: High-performance data structures, correlation matrix calculation, and numerical array processing.
* **OpenPyXL (v3.1.5)**: Python library for reading Excel datasheet files.

### 2. Frontend & User Interface
* **HTML5**: Semantic web page markup.
* **Vanilla CSS3**: Modern responsive design using CSS custom variables, glassmorphism (`backdrop-filter`), Flexbox, and CSS Grid.
* **JavaScript (ES6+)**: Event handling, asynchronous API calls (`fetch`), dual slider input synchronization, and state management.
* **Chart.js (v4.4.0)**: Data visualization engine rendering distribution histograms, scatter plots, and accuracy bar charts.
* **jsPDF (v2.5.1)**: Client-side PDF generator compiling downloadable yield reports.
* **FontAwesome (v6.4.0)**: Vector iconography for navigation, buttons, and status indicators.

### 3. Cloud & Deployment
* **Vercel**: Serverless cloud deployment platform.
* **Git & GitHub**: Version control and code repository hosting.

---

## ⚙️ How the Application Works

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   User Inputs   │ ────> │  Flask API      │ ────> │  Scikit-Learn   │
│   (Sliders/Form)│       │  /api/predict   │       │  Random Forest  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ PDF Report Exporter     │ Agronomic Farm  │ <──── │ ML Output       │
│ (jsPDF Engine)  │ <──── │ Advisory & DSS  │       │ Yield (Q/Acre)  │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **Startup & Model Training**: When `app.py` runs, it loads `crop yield data sheet.xlsx`, cleans missing/invalid values, and trains the **Random Forest Regressor** (ensemble of 300 decision trees) and **Decision Tree Regressor**.
2. **Interactive UI Selection**: The user selects a quick preset (*Wheat*, *Corn*, *Rice*, *Drought*) or moves the dual synchronized range sliders (Rainfall, Temp, N, P, K, Fertilizer, Land Area).
3. **Real-Time Prediction Request**: Submitting the form sends a JSON payload to `/api/predict`. The backend feeds the parameters into the trained Random Forest model and returns the recommended yield per acre, confidence index, and model comparisons.
4. **Yield & Harvest Computation**: The frontend displays predicted yield (Quintals/Acre), computes total harvest based on land acreage, updates the confidence gauge, and renders tailored agronomic advice.
5. **PDF Export & History**: The user can download a PDF report containing the inputs, predictions, and farm advisory, or load previous predictions from local history.

---

## 🚀 How to Run Locally

### Prerequisites
- **Python 3.10+** installed on your computer.

### Step-by-Step Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/PradeepAbburi/smart-agri.git
   cd smart-agri
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Flask server**:
   ```bash
   python app.py
   ```

4. **Open in browser**:
   Navigate to `http://127.0.0.1:5000` in your web browser.

---

## ☁️ Deployment Commands (GitHub & Vercel)

- **Push changes to GitHub**:
  ```bash
  git add .
  git commit -m "Update platform documentation and README"
  git push -u origin main
  ```

- **Deploy to Vercel**:
  ```bash
  vercel deploy --prod
  ```
