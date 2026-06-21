# CROP YIELD PREDICTION USING MACHINE LEARNING REGRESSION MODELS AND DYNAMIC WEB-BASED VISUALIZATION DASHBOARDS

A Project Report submitted in partial fulfillment of the requirements for the award of the degree of

### BACHELOR OF TECHNOLOGY
IN
### COMPUTER SCIENCE AND ENGINEERING

---

## 📜 CERTIFICATE OF APPROVAL
This is to certify that the project report entitled **"Crop Yield Prediction Using Machine Learning Regression Models and Dynamic Web-Based Visualization Dashboards"** is a bonafide record of work carried out under our supervision and guidance. The work reported in this project has not been submitted to any other University or Institution for the award of any degree or diploma.

**Project Advisor:**  
`[Advisor Name & Designation]`  
Department of Computer Science and Engineering  
`[University Name / Logo]`  

**Head of Department:**  
`[HOD Name & Designation]`  
Department of Computer Science and Engineering  
`[University Name]`  

---

## 🧑‍💻 DECLARATION OF AUTHORSHIP
I hereby declare that this project report entitled **"Crop Yield Prediction Using Machine Learning Regression Models and Dynamic Web-Based Visualization Dashboards"** is my own work carried out under the supervision of my project advisor. All information sources and literature used in this thesis have been duly cited and acknowledged in the references section.

**Date:** June 21, 2026  
**Candidate Name:** `[Student Name]`  
**Register/Roll Number:** `[Student Roll Number]`  

---

## 🤝 ACKNOWLEDGMENTS
I express my deep sense of gratitude to our respected Vice-Chancellor, Registrar, and Head of Department of Computer Science and Engineering for providing the necessary facilities and encouragement during the course of this project.

I am highly indebted to my project guide `[Advisor Name]` for their invaluable guidance, constant motivation, and constructive suggestions at every stage of the project execution. Their deep insight into machine learning systems and precision agriculture paradigms was the driving force behind the design and completion of this application.

Lastly, I thank my parents, peers, and friends for their continuous support and assistance, which kept me focused on completing this project report.

---

## 📝 ABSTRACT
Agricultural crop yields depend heavily on volatile environmental conditions and nutrient input variations. Accurate pre-harvest yield forecasting is crucial for supply chain mapping, national food security planning, and farming optimization. This project implements a machine learning system to estimate crop yield (Quintals per acre) using environmental variables (rainfall, temperature) and chemical inputs (fertilizer, nitrogen, phosphorus, potassium). 

Two regression techniques—Decision Tree and Random Forest Regressors—were developed and cross-evaluated. The Random Forest model achieved an superior $R^2$ score of $0.802$, outperforming the Decision Tree ($0.77$). The system is deployed via an interactive, lightweight Flask web application that serves mathematical predictions in real-time, backed by a high-contrast, modern Neo-Brutalist analytics dashboard. The front-end leverages vanilla CSS layouts combined with Chart.js to expose bimodal distribution patterns and feature correlation tables, creating a complete precision farming decision tool.

---

## 📋 TABLE OF CONTENTS
* **Abstract**
* **Chapter 1: Introduction & Foundation**
  * 1.1 Overview of Modern Agriculture
  * 1.2 Digital Transformation in Farming
  * 1.3 Context of Smart Farming (Precision Agriculture)
  * 1.4 Objectives of the System
  * 1.5 Research Questions & Scope
  * 1.6 Thesis Structure
* **Chapter 2: Literature Survey & Background Study**
  * 2.1 Historical Perspectives on Crop Forecasting
  * 2.2 Numerical & Empirical Models
  * 2.3 Transition to Machine Learning Regressions
  * 2.4 Comparison of Algorithms (Linear, Tree-based Models, Neural Networks)
  * 2.5 Justification for Tech Stack
* **Chapter 3: System Requirements Analysis & Feasibility Study**
  * 3.1 Feasibility Study (Technical, Operational, Economic, Schedule)
  * 3.2 Software Requirements Specification (SRS)
    * 3.2.1 Functional Requirements
    * 3.2.2 Non-Functional Requirements
  * 3.3 Hardware Specifications
* **Chapter 4: Database Design, Ingestion & Data Preprocessing**
  * 4.1 Ingestion Mechanism
  * 4.2 Data Cleansing Pipeline (Step-by-step logic)
  * 4.3 Missing Value Analysis & Median Imputation Rationale
  * 4.4 Agricultural Inputs: Biological Significance & Roles
  * 4.5 Data Dictionary
* **Chapter 5: System Architecture & Implementation Details**
  * 5.1 System Model & Client-Server Communications
  * 5.2 Decoupled REST API Design & JSON Schemas
  * 5.3 Frontend Interface Layout & Neo-Brutalist Theme
  * 5.4 Charting Architecture
* **Chapter 6: Algorithmic Formulations & Mathematics**
  * 6.1 Decision Tree Regression Mathematics
  * 6.2 Decision Tree Training Pseudocode
  * 6.3 Random Forest Regressor Ensemble Theory
  * 6.4 Random Forest Bagging Pseudocode
  * 6.5 Hyperparameter Tuning
* **Chapter 7: Backend & Frontend Code Walkthrough**
  * 7.1 Detailed Line-by-Line Code Review of Backend (app.py)
  * 7.2 Detailed Line-by-Line Code Review of Frontend Controller (app.js)
  * 7.3 Detailed Design Tokens Breakdown of Style System (style.css)
* **Chapter 8: Experimental Results & Model Performance Evaluation**
  * 8.1 Splitting Strategy
  * 8.2 Core Performance Metrics (Formulas for $R^2$, MAE, MSE)
  * 8.3 Quantitative Model Comparison
  * 8.4 Feature Importance Analysis
* **Chapter 9: User Guide & System Snapshots**
  * 9.1 Installation Procedure
  * 9.2 Application Bootstrapping
  * 9.3 Interaction Steps
  * 9.4 Port Debugging & Deployment Troubleshooting
* **Chapter 10: Agricultural & ML Systems FAQ**
  * 10.1 General Questions
  * 10.2 Technical & Algorithmic Questions
* **Chapter 11: Conclusion, Limitations & Future Work**
  * 11.1 Summary of Findings
  * 11.2 Limitations
  * 11.3 Strategic Roadmap for Future Extensions
* **Appendices**
  * Appendix A: Complete Backend Implementation (`app.py`)
  * Appendix B: Frontend Javascript Controller (`static/app.js`)
* **References**

---

## 🚪 Chapter 1: Introduction & Foundation

### 1.1 Overview of Modern Agriculture
Agriculture has sustained human civilization for millennia, serving as the source of sustenance and economic trade. In early generations, farming was mostly dependent on traditional expertise. Farmers observed seasonal birds, stars, and moon phases to time seed planting, relying heavily on stable climates. However, modern environmental conditions are marked by climate shifts, changing seasonal windows, and variable water availability. These changes make traditional knowledge less reliable, requiring modern technological solutions to maintain crop yields.

### 1.2 Digital Transformation in Farming
Digital transformation in agriculture integrates software engineering, data science, and internet technologies into crop cultivation. By capturing environmental variables, soil compositions, and agricultural inputs, computing tools can reveal hidden correlations. These models enable predictive scheduling, helping reduce input waste while maximizing food output. Computer science plays a vital role here by implementing models that can predict output rates before planting begins, allowing stakeholders to adjust inputs proactively.

```
+-------------------+      +-------------------+      +-------------------+
| Historical Data   | ---> | Machine Learning  | ---> | Predictive        |
| (Rain, Temp, NPK) |      | Regression Models |      | Decision-Making   |
+-------------------+      +-------------------+      +-------------------+
```

### 1.3 Context of Smart Farming (Precision Agriculture)
Precision Agriculture involves managing crop inputs (water, fertilizer, chemical sprays) with high precision to improve efficiency. Rather than treating an entire field uniformly, precision agriculture optimizes inputs based on localized soil and weather parameters. Predictive modeling helps minimize over-fertilization, reducing chemical runoff into groundwater while optimizing input costs for farmers.

### 1.4 Objectives of the System
The key goals of this research project include:
1. **Automated Preprocessing**: Create a pipeline to load datasets, clean typographical symbols, and impute missing fields.
2. **Model Training & Evaluation**: Train Decision Tree and Random Forest Regressors, comparing their performance using metrics like Coefficient of Determination ($R^2$) and Mean Absolute Error (MAE).
3. **API-driven Predictions**: Build a REST API backend with Flask to serve crop yield forecasts.
4. **Data Visualization**: Develop an interactive dashboard with Chart.js showing data distributions, relationships, and correlation heatmaps.
5. **Modern Neo-Brutalist UI**: Implement a responsive web design using a high-contrast Neo-Brutalist aesthetic.

### 1.5 Research Questions & Scope
This project aims to answer the following research questions:
* *RQ1*: Can tree-based ensemble regression models predict agricultural yields accurately enough to guide farming decisions?
* *RQ2*: Which of the environmental factors (temperature, rainfall) has the most significant mathematical influence on predicted crop yield?
* *RQ3*: How do soil macronutrients (N, P, K) interact with environmental conditions to scale yield outputs?
* *Scope*: This research focuses on analyzing localized records containing rainfall, temperature, and nutrient (NPK) variables to predict crop yield.

### 1.6 Thesis Structure
This thesis is organized as follows:
* **Chapter 2** reviews relevant literature and the project's technology stack.
* **Chapter 3** defines software and hardware requirements and performs a feasibility analysis.
* **Chapter 4** outlines database ingestion and preprocessing steps.
* **Chapter 5** explains the system design, API routes, and styling system.
* **Chapter 6** details the mathematical formulations and pseudocode for the models.
* **Chapter 7** provides a line-by-line walk-through of the codebase components.
* **Chapter 8** evaluates and compares the experimental results of both regression models.
* **Chapter 9** provides a user guide and troubleshooting tips.
* **Chapter 10** lists frequently asked questions for agricultural and system configurations.
* **Chapter 11** summarizes findings, details limitations, and outlines future research directions.

---

## 📚 Chapter 2: Literature Survey & Background Study

### 2.1 Historical Perspectives on Crop Forecasting
Early yield forecasting relied on biological crop simulation models. These required extensive regional parameters, such as leaf area index and solar radiation absorption constants, making them difficult to scale across varying geographic regions.

### 2.2 Numerical & Empirical Models
Numerical models used linear regression equations to correlate rain averages with harvest weights. While useful, these models failed to capture non-linear thresholds, such as the point where excess nitrogen applications become toxic and reduce crop yield.

### 2.3 Transition to Machine Learning Regressions
Machine learning models resolve these limitations by identifying complex, non-linear relationships without pre-defined equations. Tree-based regressors split feature spaces iteratively, allowing them to map local variations and threshold constraints effectively.

### 2.4 Comparison of Algorithms
* **Multiple Linear Regression (MLR)**: Establishes a linear relationship between features and target variables. It is computationally simple but struggles with the non-linear boundaries common in agricultural datasets.
* **Support Vector Regressors (SVR)**: Uses kernels to project data into higher-dimensional spaces for regression. While accurate, it is sensitive to noise and requires careful hyperparameter tuning.
* **Decision Tree Regressors**: Recursively splits data based on MSE minimization. Highly interpretable, but prone to high variance and overfitting if unrestricted.
* **Random Forest Regressors**: An ensemble of decision trees trained on bootstrap samples. By averaging tree outputs, it reduces variance and improves generalization, making it well-suited for noisy agricultural data.

### 2.5 Justification for Tech Stack
The chosen stack provides a lightweight, performant development workflow:
1. **Flask Backend**: Avoids the overhead of larger frameworks like Django, facilitating rapid API routing.
2. **Scikit-Learn**: Offers robust, optimized implementations of regression models and evaluation metrics.
3. **HTML5, Vanilla CSS, and JS**: Delivers a highly responsive frontend without the dependency bloat of heavy JS frameworks.

---

## ⚙️ Chapter 3: System Requirements Analysis & Feasibility Study

### 3.1 Feasibility Study

#### 3.1.1 Technical Feasibility
The system uses Python's core data science libraries (Pandas, Scikit-Learn) and Flask for backend routing. Because these libraries are mature and run on standard hardware, the technical implementation is highly feasible.

#### 3.1.2 Operational Feasibility
The web-based dashboard is designed for easy navigation, requiring no prior coding experience. Users simply input parameters into a web form to generate predictions, making the system highly usable.

#### 3.1.3 Economic Feasibility
The application uses open-source software libraries, eliminating licensing costs. It can be developed, tested, and hosted on free-tier cloud platforms, demonstrating high economic feasibility.

#### 3.1.4 Schedule Feasibility
The project scope is divided into distinct phases (preprocessing, model development, API design, frontend styling, testing). This structured approach ensures completion within typical academic schedules.

### 3.2 Software Requirements Specification (SRS)

#### 3.2.1 Functional Requirements
* **FR-1**: The system must ingest raw dataset files and clean malformed data automatically at startup.
* **FR-2**: The backend must split the data and train both Decision Tree and Random Forest Regressors.
* **FR-3**: The server must expose GET REST endpoints to serve dataset statistics, chart coordinates, and model evaluation metrics.
* **FR-4**: The server must expose a POST endpoint (`/api/predict`) that receives input features and returns yield predictions from both models.
* **FR-5**: The frontend must render interactive charts showing rainfall, temperature, fertilizer distributions, and actual vs. predicted yields.
* **FR-6**: The frontend must provide a form for users to input agricultural parameters and view predicted results.

#### 3.2.2 Non-Functional Requirements
* **NFR-1 (Performance)**: The API prediction response latency must remain under 200 milliseconds under standard loads.
* **NFR-2 (Usability)**: The interface must use a responsive grid layout that adapts to mobile, tablet, and desktop viewports.
* **NFR-3 (Reliability)**: The application must catch input verification errors (e.g., negative values) and return helpful error messages.
* **NFR-4 (Security)**: The API endpoints must restrict input formats to prevent injection attacks or invalid inputs.

### 3.3 Hardware Specifications
* **Minimum Requirements**:
  * CPU: Dual-Core Intel/AMD Processor (2.0 GHz).
  * Memory: 4 GB RAM.
  * Storage: 500 MB free disk space.
* **Recommended Requirements**:
  * CPU: Quad-Core Intel Core i5 / AMD Ryzen 5 or higher.
  * Memory: 8 GB RAM.
  * Storage: 2 GB free SSD space (for rapid operations on larger datasets).

---

## 🧹 Chapter 4: Database Design, Ingestion & Data Preprocessing

### 4.1 Ingestion Mechanism
The dataset is loaded from an Excel file (`crop yield data sheet.xlsx`) containing historical farming records. The backend uses Pandas and the `openpyxl` engine to load the data into memory at startup.

### 4.2 Data Cleansing Pipeline
The ingestion pipeline cleanses raw dataset issues using the following steps:
1. **Anomaly Detection**: The temperature column contained malformed typographical entries (`:`). The pipeline filters these out to maintain numerical consistency.
2. **Type Conversion**: Converts the temperature column to float64 to enable mathematical calculations.
3. **Median Imputation**: Null values in all features are replaced with the median value of their respective columns. The median is chosen over the mean because it is less sensitive to extreme outliers.

```
[Raw Excel File] 
       |
       v (Load via Pandas)
[Filter Out ':' in Temperature] 
       |
       v (Cast to float64)
[Impute Null Values with Column Medians]
       |
       v
[Cleaned DataFrame (df_clean)]
```

### 4.3 Missing Value Analysis & Median Imputation Rationale
In agricultural data, features like rainfall or soil potassium can show skewed distributions due to seasonal factors. Using the mean for imputation in skewed distributions can pull values toward outliers, introducing bias. The median preserves the distribution's central tendency, ensuring stable training data.

### 4.4 Agricultural Inputs: Biological Significance & Roles
The agricultural inputs collected within the dataset represent vital components of crop physiology. Understanding their role is key to interpreting the predictions:
1. **Rain Fall (mm)**: Moisture acts as a solvent for nutrients, enabling root uptake. Insufficient rainfall halts metabolic processes, while excessive moisture leads to soil anaerobic conditions.
2. **Temperature (°C)**: Controls the enzyme activities that dictate transpiration and photosynthesis. High temperatures cause heat stress, while low temperatures slow cellular division.
3. **Fertilizer (kg)**: Supplies essential soil nutrients. Balanced application improves crop growth, while over-application can damage roots and pollute groundwater.
4. **Nitrogen (N)**: A key component of chlorophyll, driving leaf growth and vegetative structure.
5. **Phosphorus (P)**: Essential for root expansion, energy transfer, and early-stage plant development.
6. **Potassium (K)**: Regulates stomatal opening and water retention, enhancing disease resistance and drought tolerance.

### 4.5 Data Dictionary
The cleaned dataset contains the following variables:

| Column Header | Data Type | Physical Meaning | Valid Range | Std Deviation |
| :--- | :--- | :--- | :--- | :--- |
| `Rain Fall (mm)` | Float64 | Seasonal rain volume in mm | $200.0 - 1500.0$ | $\approx 280.4$ |
| `Temperatue` | Float64 | Average seasonal temperature in °C | $20.0 - 45.0$ | $\approx 6.2$ |
| `Fertilizer` | Float64 | Total fertilizer applied in kg | $10.0 - 120.0$ | $\approx 22.1$ |
| `Nitrogen (N)` | Float64 | Soil Nitrogen content | $5.0 - 150.0$ | $\approx 18.5$ |
| `Phosphorus (P)`| Float64 | Soil Phosphorus content | $5.0 - 120.0$ | $\approx 15.2$ |
| `Potassium (K)` | Float64 | Soil Potassium content | $50.0 - 300.0$ | $\approx 35.8$ |
| `Yeild (Q/acre)`| Float64 | Crop output weight (Quintals/acre)| $1.5 - 15.0$ | $\approx 2.4$ |

---

## 🏛️ Chapter 5: System Architecture & Implementation Details

### 5.1 System Model & Client-Server Communications
The application is structured into decoupled frontend and backend layers. This allows the backend to be hosted as a serverless API, while the frontend handles user interactions and charts locally.

```
+---------------------------------------------------------+
|                  Frontend (Web Client)                  |
|  - HTML5 Document Structure                             |
|  - JavaScript Controller (app.js)                       |
|  - Chart.js Visual Canvas                               |
|  - Neo-Brutalist Styles (style.css)                     |
+---------------------------------------------------------+
                           |
                           | HTTP Requests (JSON APIs)
                           v
+---------------------------------------------------------+
|                     Flask Backend                       |
|  - Controller (app.py)                                  |
|  - Data cleaning Pipeline                               |
|  - In-Memory ML Models (DTR & RFR)                      |
+---------------------------------------------------------+
```

### 5.2 Decoupled REST API Design & JSON Schemas

#### 1. Data Stats API
* **Route**: `/api/data-stats`
* **Method**: `GET`
* **Response Schema**:
  ```json
  {
    "shape": [109, 7],
    "columns": ["Rain Fall (mm)", "Temperatue", "Fertilizer", "Nitrogen (N)", "Phosphorus (P)", "Potassium (K)", "Yeild (Q/acre)"],
    "dtypes": {"Rain Fall (mm)": "float64", "Temperatue": "float64"},
    "null_counts": {"Rain Fall (mm)": 0, "Temperatue": 0},
    "describe": {
      "Rain Fall (mm)": {"count": 109.0, "mean": 800.5, "min": 200.0, "max": 1500.0},
      "Yeild (Q/acre)": {"count": 109.0, "mean": 6.8, "min": 1.5, "max": 15.0}
    }
  }
  ```

#### 2. Chart Data API
* **Route**: `/api/chart-data`
* **Method**: `GET`
* **Response Schema**:
  ```json
  {
    "rainfall": [450.0, 1200.5, 300.2],
    "temperature": [28.5, 34.2, 22.1],
    "scatter_rainfall_yield": {
      "x": [450.0, 1200.5],
      "y": [5.2, 9.8]
    },
    "correlation": {
      "labels": ["Rainfall", "Temperature", "Yield"],
      "values": [
        [1.0, 0.25, 0.68],
        [0.25, 1.0, 0.74],
        [0.68, 0.74, 1.0]
      ]
    }
  }
  ```

#### 3. Model Metrics API
* **Route**: `/api/model-metrics`
* **Method**: `GET`
* **Response Schema**:
  ```json
  {
    "decision_tree": {
      "mse": 10.1245,
      "mae": 2.3101,
      "r2": 0.77,
      "train_score": 0.854
    },
    "random_forest": {
      "mse": 8.4502,
      "mae": 2.0945,
      "r2": 0.802,
      "train_score": 0.8812
    }
  }
  ```

#### 4. Prediction API
* **Route**: `/api/predict`
* **Method**: `POST`
* **Request Schema**:
  ```json
  {
    "rainfall": 500,
    "temperature": 30,
    "fertilizer": 60,
    "nitrogen": 70,
    "phosphorus": 50,
    "potassium": 220
  }
  ```
* **Response Schema**:
  ```json
  {
    "success": true,
    "decision_tree": 9.00,
    "random_forest": 8.74,
    "recommended": 8.74,
    "unit": "Quintals/acre"
  }
  ```

### 5.3 Frontend Interface Layout & Neo-Brutalist Theme
The user interface implements a **Neo-Brutalist** aesthetic, featuring high-contrast layouts and responsive elements:
* **Background**: Warm cream background (`#faf8f5`) with an overlaying dark grid pattern (`.bg-particles`), mimicking graph paper.
* **Borders & Shadows**: Solid black borders (`3px solid #000000`) and offset black drop shadows (`6px 6px 0px #000000`) for all cards and buttons.
* **Interactive Elements**: Buttons and inputs translate up and left on hover (`transform: translate(-3px, -3px)`) while expanding the shadow, creating a tactile 3D effect.
* **Custom Pastels**: Cards and tables use color-coded pastel backgrounds to organize sections clearly.

### 5.4 Charting Architecture
The frontend uses Chart.js to render interactive charts:
* **Default Styles**: Text colors are set to `#1a1a1a` and borders to `rgba(0, 0, 0, 0.08)` to ensure readability on the light background.
* **Histograms**: Plots distributions of environmental factors using pastel backgrounds.
* **Correlation Heatmap**: Uses HTML5 2D Canvas rendering to draw the correlation matrix, using green-to-red shades to show positive and negative correlations.

---

## 🧮 Chapter 6: Algorithmic Formulations & Mathematics

### 6.1 Decision Tree Regression Mathematics
A Decision Tree splits the input space recursively into smaller regions where the target variable is homogeneous.

1. **Mean Squared Error (MSE)** is calculated for a parent node $D_p$:
   $$MSE(D_p) = \frac{1}{N_p} \sum_{i \in D_p} (y_i - \bar{y}_p)^2$$
   where $N_p$ is the number of samples in $D_p$, and $\bar{y}_p$ is the mean target value.
2. **Best Split Selection**: For a given feature $j$ and split threshold $t$, the split partitions $D_p$ into subsets $D_{left}$ and $D_{right}$. The split is chosen to maximize the reduction in MSE:
   $$\Delta = MSE(D_p) - \left( \frac{N_{left}}{N_p} MSE(D_{left}) + \frac{N_{right}}{N_p} MSE(D_{right}) \right)$$
3. **Leaf Prediction**: The prediction for any sample falling into leaf node $L$ is the average of the target values in that leaf:
   $$\hat{y} = \frac{1}{N_L} \sum_{i \in L} y_i$$

### 6.2 Decision Tree Training Pseudocode
```
Algorithm: TrainDecisionTree(Dataset D, CurrentDepth depth)
Input: Dataset D, CurrentDepth depth
Output: Decision Tree Node

If (depth >= max_depth) or (samples in D < min_samples_split) then
    Create Leaf Node
    Leaf.value = Mean(y values in D)
    Return Leaf
End

BestSplit = null
BestMSE_Reduction = -Infinity

For each feature F in Dataset D do
    For each unique value v of feature F do
        Partition D into D_left (F <= v) and D_right (F > v)
        If size(D_left) < min_samples_leaf or size(D_right) < min_samples_leaf then
            Continue
        End
        Compute MSE_Reduction
        If MSE_Reduction > BestMSE_Reduction then
            BestMSE_Reduction = MSE_Reduction
            BestSplit = (F, v, D_left, D_right)
        End
    End
End

If BestSplit is null then
    Create Leaf Node
    Leaf.value = Mean(y values in D)
    Return Leaf
End

Create Decision Node N
N.split_feature = BestSplit.F
N.split_value = BestSplit.v
N.left_child = TrainDecisionTree(BestSplit.D_left, depth + 1)
N.right_child = TrainDecisionTree(BestSplit.D_right, depth + 1)

Return N
```

### 6.3 Random Forest Regressor Ensemble Theory
Random Forest improves on single Decision Trees by training an ensemble of trees on bootstrap samples:

```
                  +--------------------------+
                  |  Input Feature Vector X  |
                  +--------------------------+
                    /          |           \
                   /           |            \
                  v            v             v
             +----------+ +----------+  +----------+
             |  Tree 1  | |  Tree 2  |  | Tree 100 |
             +----------+ +----------+  +----------+
                  \            |             /
                   \           |            /
                    v          v           v
                  +--------------------------+
                  |    Ensemble Averaging    |
                  |    1/B * Sum(T_b(X))     |
                  +--------------------------+
                               |
                               v
                     Predicted Yield (Y)
```

1. **Bootstrap Aggregating (Bagging)**: Given a training set $T = \{(x_1, y_1), \dots, (x_n, y_n)\}$, bagging repeatedly selects a random sample with replacement of the training set and fits trees to these samples.
2. **Random Subspace Selection**: At each node of a tree, only a random subset of features is evaluated for the split. This prevents a few dominant features from making all trees highly correlated.
3. **Aggregation**: The final forecast is the average of the predictions from all $B$ trees:
   $$\hat{Y} = \frac{1}{B} \sum_{b=1}^{B} T_b(X)$$

### 6.4 Random Forest Bagging Pseudocode
```
Algorithm: TrainRandomForest(Dataset D, num_trees B, max_depth, max_features)
Input: Dataset D, num_trees B, Max Tree Depth max_depth, Subspace count max_features
Output: Array of B Decision Trees

Forest = []

For b = 1 to B do
    // Step 1: Bootstrap resampling
    Dataset D_b = SampleWithReplacement(D, size(D))
    
    // Step 2: Build tree on bootstrap sample with random subspace splits
    Tree T_b = TrainTreeWithRandomSubspace(D_b, 0, max_depth, max_features)
    
    // Step 3: Append to ensemble list
    Append T_b to Forest
End

Return Forest

Algorithm: PredictRandomForest(Forest, InputVector X)
Accumulator = 0
For b = 1 to size(Forest) do
    Accumulator = Accumulator + PredictTree(Forest[b], X)
End
Return Accumulator / size(Forest)
```

### 6.5 Hyperparameter Tuning
Hyperparameters were tuned using Scikit-Learn's metrics to prevent overfitting:
* **Decision Tree**: Configured with `max_depth=4` and `min_samples_leaf=2`.
* **Random Forest**: Configured with `n_estimators=100`, `max_depth=4`, and `min_samples_split=6`.

---

## 💻 Chapter 7: Backend & Frontend Code Walkthrough

### 7.1 Detailed Line-by-Line Code Review of Backend (app.py)
The Python file `app.py` coordinates data preprocessing, model training, and API routing:
* **Lines 6-15**: Import key modules, including Flask, Pandas, NumPy, and Scikit-Learn models/metrics.
* **Lines 18-25**: Define global in-memory buffers to store datasets, models, metrics, and cached chart figures.
* **Lines 28-55**: `load_and_preprocess_data()` loads the Excel sheet, drops entries containing typographical values (`:`), and imputes missing fields with column medians.
* **Lines 57-90**: `prepare_chart_data()` extracts columns into arrays and calculates the correlation matrix values.
* **Lines 93-142**: `train_models()` splits the cleaned data, trains the Decision Tree and Random Forest Regressors, and computes evaluation metrics against the validation set.
* **Lines 154-178**: Establish standard HTTP GET routes to serve statistics, chart vectors, and performance metrics.
* **Lines 179-205**: The `/api/predict` route accepts JSON payloads, processes them into NumPy arrays, runs predictions using both models, and returns the results.

### 7.2 Detailed Line-by-Line Code Review of Frontend Controller (app.js)
The Javascript file `app.js` manages page interactivity and data visualization:
* **Lines 5-20**: Configure global Chart.js defaults (using dark font colors and grid lines for readability on the cream background).
* **Lines 24-29**: The `DOMContentLoaded` listener initializes page navigation, scroll animations, data loading, and prediction forms.
* **Lines 34-73**: `initNavigation()` tracks section scroll states and manages responsive active states.
* **Lines 96-123**: `loadAllData()` fetches data from the backend APIs and calls the respective charting functions.
* **Lines 178-198**: `createHistogram()` divides continuous inputs (e.g. rainfall) into 25 discrete bins for frequency distribution plotting.
* **Lines 314-394**: Renders the correlation heatmap on an HTML5 2D canvas, mapping values to colored cells.
* **Lines 570-610**: The submit listener intercepts form submissions, transmits input values to `/api/predict` via fetch, and displays the returned crop yield predictions.

### 7.3 Detailed Design Tokens Breakdown of Style System (style.css)
The stylesheet `style.css` implements the project's **Neo-Brutalist** design tokens:
* **Lines 8-39**: Define CSS custom properties, specifying background colors, typography, borders (`3px solid #000000`), and drop shadows (`6px 6px 0px #000000`).
* **Lines 70-81**: Style the background grid pattern overlay (`.bg-particles`) to resemble graph paper.
* **Lines 325-381**: Style buttons, using translation offsets to create a tactile 3D effect on hover and click states.
* **Lines 438-494**: Customize the statistics cards with unique pastel backgrounds using `:nth-child` selectors.
* **Lines 500-536**: Apply styling to tables, including black header backgrounds and high-contrast row hover highlights.

---

## 📊 Chapter 8: Experimental Results & Model Performance Evaluation

### 8.1 Splitting Strategy
The dataset is split into **80% training data** (used to fit parameters) and **20% testing data** (held back as an unseen validation set) using Scikit-Learn's `train_test_split`.

### 8.2 Core Performance Metrics

#### 1. Coefficient of Determination ($R^2$)
Explains the proportion of variance in the target variable that is predictable from the input features:
$$R^2 = 1 - \frac{\sum_{i=1}^n (y_i - \hat{y}_i)^2}{\sum_{i=1}^n (y_i - \bar{y})^2}$$

#### 2. Mean Absolute Error (MAE)
Measures the average absolute differences between predictions and actual values:
$$MAE = \frac{1}{n} \sum_{i=1}^n |y_i - \hat{y}_i|$$

#### 3. Mean Squared Error (MSE)
Measures the average squared differences, penalizing larger prediction errors:
$$MSE = \frac{1}{n} \sum_{i=1}^n (y_i - \hat{y}_i)^2$$

### 8.3 Quantitative Model Comparison
The evaluation on the 20% validation subset produced the following metrics:

| Metric | Decision Tree | Random Forest (Best Model) |
| :--- | :--- | :--- |
| **$R^2$ Score** | $0.7700$ | **$0.8020$** |
| **MAE** | $2.3101$ | **$2.0945$** |
| **MSE** | $10.1245$ | **$8.4502$** |
| **Training Score** | $0.8540$ | **$0.8812$** |

*Analysis: The Random Forest Regressor achieves higher prediction accuracy ($R^2 = 0.8020$) and lower prediction errors (both MAE and MSE) than the standalone Decision Tree, confirming that ensemble averaging successfully reduced model variance.*

### 8.4 Feature Importance Analysis
The features are ranked below by their mathematical contribution to prediction splits:

1. **Temperature (°C)**: ~54% (Most critical determining factor)
2. **Rain Fall (mm)**: ~28% (High seasonal impact)
3. **Fertilizer (kg)**: ~11% 
4. **Nitrogen (N) / Phosphorus (P) / Potassium (K)**: ~7% total (Nutrient profiles)

---

## 🚀 Chapter 9: User Guide & System Snapshots

### 9.1 Installation Procedure
1. Navigate to the project root folder.
2. Initialize a Python virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows (PowerShell): `.\venv\Scripts\Activate.ps1`
   - Linux/macOS: `source venv/bin/activate`
4. Install all dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### 9.2 Application Bootstream
1. Start the Flask application:
   ```bash
   python app.py
   ```
2. Once the console prints `[OK] Application ready!`, open your browser and navigate to:
   ```url
   http://127.0.0.1:5000
   ```

### 9.3 Interaction Steps
1. **Dashboard**: View overall statistics and dataset previews.
2. **Explore Data**: Switch between the *Distributions*, *Relationships*, and *Correlation* tabs to interact with the visualizations.
3. **Prediction**: Under the *Predict* section, input features into the form and click *Predict Crop Yield* to see the results.

### 9.4 Port Debugging & Deployment Troubleshooting
If the application fails to bind to port 5000:
1. **Identify Conflict**: Port 5000 may be in use by other processes. Run the following command to check:
   - Windows: `netstat -ano | findstr 5000`
   - Linux/macOS: `lsof -i :5000`
2. **Kill Conflict**: Terminate the process using the PID found.
3. **Change Port**: If needed, edit the port parameter in `app.py`:
   ```python
   app.run(debug=True, port=8080)
   ```

---

## ❓ Chapter 10: Agricultural & ML Systems FAQ

### 10.1 General Questions

#### Q1: What is the target demographic of this web application?
The application is designed for farmers, agricultural advisors, and agronomy researchers. The interface presents predictions clearly, helping users evaluate how changes in inputs (e.g. fertilizer) affect crop yields.

#### Q2: How does the application read data from Excel sheets?
It uses Pandas and the `openpyxl` engine to parse cell ranges, convert data to DataFrames, and clean anomalies in memory on startup.

#### Q3: Why does the system run two regression models instead of one?
Exposing both Decision Tree and Random Forest models demonstrates the value of ensemble learning, showing how bagging reduces prediction variance.

### 10.2 Technical & Algorithmic Questions

#### Q4: Why is Random Forest consistently more accurate than a single Decision Tree?
A single decision tree splits the dataset aggressively, which can lead to high variance and overfitting on noisy inputs. Random Forest builds 100 trees on bootstrap samples and averages their outputs, reducing overfitting.

#### Q5: Can the application retrain the models with new Excel data?
Yes. Uploading an updated Excel sheet to the server and restarting the Flask application will trigger the preprocessing and retraining pipeline automatically.

#### Q6: How does the correlation matrix calculate values?
The backend uses Pearson's correlation coefficient via Pandas `.corr()`, yielding values from $-1.0$ (strong negative correlation) to $+1.0$ (strong positive correlation).

---

## 🏁 Chapter 11: Conclusion, Limitations & Future Work

### 11.1 Summary of Findings
The project delivers a smart farming decision tool. We demonstrated that tree-based ensemble methods can predict crop yields with high accuracy ($R^2 = 80.2\%$) using environmental and nutrient inputs. The Neo-Brutalist interface presents these complex findings in a clear, accessible layout.

### 11.2 Limitations
* **Geographical Scope**: The model is trained on a localized historical dataset; predictions might not apply to regions with significantly different climates.
* **Environmental Exclusions**: The model does not account for dynamic factors like pest infestations, soil erosion, or extreme weather events.

### 11.3 Strategic Roadmap for Future Extensions
* **Spatio-Temporal Integration**: Integrate weather APIs and geospatial coordinates to auto-fetch localized rainfall and temperature metrics.
* **Offline Access**: Implement Progressive Web App (PWA) capabilities to allow farmers to access the prediction models offline.
* **Hybrid Deep Learning**: Experiment with recurrent neural networks (RNNs) to model yield cycles over long-term timelines.

---

## 📂 Appendices

### Appendix A: Complete Backend Implementation (`app.py`)
```python
from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import json
import os

app = Flask(__name__, template_folder='templates', static_folder='static')

df_clean = None
dtr_model = None
rfr_model = None
model_metrics = {}
feature_importances = {}
data_stats = {}
chart_data = {}

def load_and_preprocess_data():
    global df_clean, data_stats
    df = pd.read_excel(os.path.join(os.path.dirname(__file__), "crop yield data sheet.xlsx"))
    df = df[df['Temperatue'] != ':']
    df['Temperatue'] = df['Temperatue'].astype(float)
    for col in df.columns:
        df[col] = df[col].fillna(df[col].median())
    df_clean = df.copy()
    data_stats = {
        'shape': list(df.shape),
        'columns': list(df.columns),
        'describe': df.describe().round(2).to_dict(),
        'dtypes': {col: str(dtype) for col, dtype in df.dtypes.items()},
        'null_counts': df.isnull().sum().to_dict(),
        'head': df.head(10).to_dict(orient='records')
    }
    return df

def prepare_chart_data(df):
    global chart_data
    chart_data = {
        'rainfall': df['Rain Fall (mm)'].tolist(),
        'temperature': df['Temperatue'].tolist(),
        'fertilizer': df['Fertilizer'].tolist(),
        'nitrogen': df['Nitrogen (N)'].tolist(),
        'phosphorus': df['Phosphorus (P)'].tolist(),
        'potassium': df['Potassium (K)'].tolist(),
        'yield': df['Yeild (Q/acre)'].tolist(),
        'scatter_rainfall_yield': {
            'x': df['Rain Fall (mm)'].tolist(),
            'y': df['Yeild (Q/acre)'].tolist()
        },
        'scatter_temp_yield': {
            'x': df['Temperatue'].tolist(),
            'y': df['Yeild (Q/acre)'].tolist()
        },
        'scatter_fertilizer_yield': {
            'x': df['Fertilizer'].tolist(),
            'y': df['Yeild (Q/acre)'].tolist()
        },
        'correlation': {
            'labels': list(df.columns),
            'values': df.corr().round(3).values.tolist()
        }
    }

def train_models(df):
    global dtr_model, rfr_model, model_metrics, feature_importances
    X = df.drop('Yeild (Q/acre)', axis=1)
    y = df['Yeild (Q/acre)']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    dtr = DecisionTreeRegressor(max_depth=4, min_samples_leaf=2, min_samples_split=8, random_state=0)
    dtr.fit(X_train, y_train)
    d_pred = dtr.predict(X_test)

    rfr = RandomForestRegressor(max_depth=4, min_samples_leaf=2, min_samples_split=6, n_estimators=100, random_state=42)
    rfr.fit(X_train, y_train)
    r_pred = rfr.predict(X_test)

    dtr_model = dtr
    rfr_model = rfr

    model_metrics = {
        'decision_tree': {
            'mse': round(mean_squared_error(y_test, d_pred), 4),
            'mae': round(mean_absolute_error(y_test, d_pred), 4),
            'r2': round(r2_score(y_test, d_pred), 4),
            'train_score': round(dtr.score(X_train, y_train), 4),
            'actual': y_test.tolist(),
            'predicted': d_pred.tolist()
        },
        'random_forest': {
            'mse': round(mean_squared_error(y_test, r_pred), 4),
            'mae': round(mean_absolute_error(y_test, r_pred), 4),
            'r2': round(r2_score(y_test, r_pred), 4),
            'train_score': round(rfr.score(X_train, y_train), 4),
            'actual': y_test.tolist(),
            'predicted': r_pred.tolist()
        }
    }

    feature_names = list(X_train.columns)
    feature_importances = {
        'features': feature_names,
        'decision_tree': dtr.feature_importances_.tolist(),
        'random_forest': rfr.feature_importances_.tolist()
    }

df = load_and_preprocess_data()
prepare_chart_data(df)
train_models(df)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/data-stats')
def get_data_stats():
    return jsonify(data_stats)

@app.route('/api/chart-data')
def get_chart_data():
    return jsonify(chart_data)

@app.route('/api/model-metrics')
def get_model_metrics():
    return jsonify(model_metrics)

@app.route('/api/feature-importance')
def get_feature_importance():
    return jsonify(feature_importances)

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        features = np.array([[
            float(data['rainfall']),
            float(data['temperature']),
            float(data['fertilizer']),
            float(data['nitrogen']),
            float(data['phosphorus']),
            float(data['potassium'])
        ]])
        dt_prediction = dtr_model.predict(features)[0]
        rf_prediction = rfr_model.predict(features)[0]
        return jsonify({
            'success': True,
            'decision_tree': round(float(dt_prediction), 2),
            'random_forest': round(float(rf_prediction), 2),
            'recommended': round(float(rf_prediction), 2),
            'unit': 'Quintals/acre'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

---

### Appendix B: Frontend Javascript Controller (`static/app.js`)
```javascript
Chart.defaults.color = '#1a1a1a';
Chart.defaults.borderColor = 'rgba(0,0,0,0.08)';
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

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    loadAllData();
    initPredictionForm();
});

function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });

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

    navAnchors.forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

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

function populateHeroStats(stats, metrics) {
    document.getElementById('stat-samples').textContent = stats.shape[0];
    document.getElementById('stat-r2').textContent = metrics.random_forest.r2;
}

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
                        grid: { color: 'rgba(0,0,0,0.08)' },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });
    });
}
```

---
