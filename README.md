# Crop Yield Prediction - Web Application

A premium, interactive Flask web application that predicts crop yields using machine learning models (Decision Tree and Random Forest Regressors) trained on environmental and agricultural factors.

The user interface features a sleek, dark-mode glassmorphic design system tailored for agricultural data visualization, featuring responsive Chart.js histograms, scatter plots, correlation heatmaps, and a real-time prediction interface.

---

## 🛠️ Tech Stack & Key Features

* **Backend**: Flask (Python)
* **Frontend**: HTML5, Vanilla CSS (Glassmorphism Dark Mode Theme), JavaScript (ES6)
* **Machine Learning**: Scikit-Learn (Decision Tree, Random Forest Regressors)
* **Data Visualization**: Chart.js v4.4
* **Data Wrangling**: Pandas, NumPy, OpenPyXL
* **Key Features**:
  * Real-time crop yield predictions comparing Random Forest (best) vs Decision Tree.
  * Interactive Exploratory Data Analysis (EDA) dashboard displaying data distributions, variable relationships, and feature correlation heatmaps.
  * Live model evaluation comparing R² scores, Mean Absolute Error (MAE), and Mean Squared Error (MSE).
  * Feature importance breakdown illustrating which environmental metrics dictate output.

---

## 🔬 What We Used & How It Works

This project trains two regression-based machine learning models using environmental data to forecast crop yield. Below is a detailed breakdown of the methodologies, algorithms, and modules implemented:

### 1. Data Preprocessing & Cleaning
* **Invalid Value Handling**: The temperature column contained invalid text entries (`:`). These were programmatically detected, dropped, and the column was cast to float64 to ensure mathematical compatibility.
* **Missing Value Imputation**: To avoid bias and preserve dataset size, missing values (NaN) in all numerical columns were imputed with the column's **median** value (which is more robust to outliers than the mean).

### 2. Decision Tree Regressor
* **What it is**: A flowchart-like tree structure where internal nodes represent tests on features, branches represent outcomes, and leaf nodes represent final predicted crop yields.
* **How it works**:
  * The algorithm splits the training data recursively based on the feature value that yields the lowest **Mean Squared Error (MSE)** in the child nodes.
  * The prediction for any new input is the average crop yield of all training samples that fall into the same leaf node.
  * **Configuration**: Trained with a `max_depth` of 4 and `min_samples_leaf` of 2 to prevent overfitting while keeping the tree highly interpretable.

### 3. Random Forest Regressor (Best Model)
* **What it is**: An ensemble learning method that builds a collection of independent decision trees during training and merges their predictions.
* **How it works**:
  * **Bootstrap Aggregating (Bagging)**: Each individual tree is trained on a random sample of the training data (with replacement). This reduces overall model variance.
  * **Random Feature Selection**: At each split, only a random subset of features is evaluated. This decorrelates the trees, making the ensemble more robust.
  * **Averaging**: The final crop yield prediction is the average of the predictions made by all 100 constituent trees. This offsets individual errors and prevents overfitting, achieving a superior **R² score of ~0.80**.
  * **Configuration**: Trained with 100 estimators (`n_estimators=100`), `max_depth` of 4, and `min_samples_split` of 6.

### 4. Flask API Server
The backend (`app.py`) serves as the API gateway between the trained ML models and the front-end dashboard:
* **`/api/data-stats`**: Computes descriptive statistics (count, mean, min, max, standard deviation) using Pandas `.describe()` and sends it to the UI to populate the statistical grid.
* **`/api/chart-data`**: Formats the raw columns into clean JSON arrays for Chart.js and calculates the correlation matrix values using Pandas `.corr()`.
* **`/api/model-metrics`**: Runs evaluation metrics against the test set (`X_test`, `y_test`) including:
  * **R² (Coefficient of Determination)**: Explains the proportion of variance in yield predictable from features.
  * **MAE (Mean Absolute Error)**: Average absolute difference between predicted and actual yield.
  * **MSE (Mean Squared Error)**: Average squared difference (penalizes larger errors).
* **`/api/predict`**: Receives user inputs (Rainfall, Temp, Nitrogen, etc.) as a JSON POST request, preprocesses the values into a NumPy matrix, executes both models' `.predict()` methods, and returns the output.

---

## ⚙️ Prerequisites

* **Python 3.10 or higher** installed on your system.
* **pip** (Python package installer) configured.

---

## 🚀 Installation & Local Setup

Follow these steps to set up the project on your local machine:

### 1. Clone/Download the Repository
Make sure you are in the project folder:
```bash
cd "Crop Yield Prediction"
```

### 2. Create a Virtual Environment (Recommended)
Isolate dependencies by creating a python virtual environment:
```powershell
# Create virtual environment
python -m venv venv

# Activate on Windows (PowerShell)
.\venv\Scripts\Activate.ps1

# Activate on Windows (Command Prompt)
.\venv\Scripts\activate.bat
```

### 3. Install Dependencies
Install all required libraries using the package manager:
```bash
pip install -r requirements.txt
```

This installs:
* `Flask` (Web framework)
* `pandas` (Data loading/manipulation)
* `scikit-learn` (Regression model training & evaluation)
* `numpy` (Numerical operations)
* `openpyxl` (Engine to read the Excel datasheet)

---

## 💻 How to Run the App

1. Execute the main entry point to start the Flask development server:
   ```bash
   python app.py
   ```

2. Once the server initializes and prints `[OK] Application ready!`, open your browser and navigate to:
   ```url
   http://127.0.0.1:5000
   ```

3. Explore the dashboard statistics, interact with chart tabs, and input metrics under **Yield Predictor** to generate real-time forecasts!

---

## 📊 Data Dictionary

The model predicts **Yield (Quintals/acre)** using the following features:

| Field Name | Description | Value Range |
| :--- | :--- | :--- |
| **Rain Fall (mm)** | Rain accumulation in millimeters | 200 - 1500 mm |
| **Temperature (°C)** | Ground & air temperature in Celsius | 20 - 45 °C |
| **Fertilizer (kg)** | Quantity of fertilizer applied | 10 - 120 kg |
| **Nitrogen (N)** | Soil Nitrogen concentration | Macro nutrient level |
| **Phosphorus (P)** | Soil Phosphorus concentration | Macro nutrient level |
| **Potassium (K)** | Soil Potassium concentration | Macro nutrient level |
| **Yield (Q/acres)** | Output of crop in Quintals per acre | Target Variable |
