"""
Crop Yield Prediction - Flask Web Application
A beautiful interactive web app for predicting crop yield based on environmental factors.
"""

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

# Global variables for models and data
df_clean = None
dtr_model = None
rfr_model = None
model_metrics = {}
feature_importances = {}
data_stats = {}
chart_data = {}


def load_and_preprocess_data():
    """Load and clean the dataset."""
    global df_clean, data_stats

    df = pd.read_excel(os.path.join(os.path.dirname(__file__), "crop yield data sheet.xlsx"))

    # Remove invalid temperature values
    df = df[df['Temperatue'] != ':']
    df['Temperatue'] = df['Temperatue'].astype(float)

    # Fill missing values with median
    for col in df.columns:
        df[col] = df[col].fillna(df[col].median())

    df_clean = df.copy()

    # Compute data stats
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
    """Prepare data for frontend charts."""
    global chart_data

    chart_data = {
        # Distribution data
        'rainfall': df['Rain Fall (mm)'].tolist(),
        'temperature': df['Temperatue'].tolist(),
        'fertilizer': df['Fertilizer'].tolist(),
        'nitrogen': df['Nitrogen (N)'].tolist(),
        'phosphorus': df['Phosphorus (P)'].tolist(),
        'potassium': df['Potassium (K)'].tolist(),
        'yield': df['Yeild (Q/acre)'].tolist(),

        # Scatter data
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

        # Correlation matrix
        'correlation': {
            'labels': list(df.columns),
            'values': df.corr().round(3).values.tolist()
        }
    }


def train_models(df):
    """Train Decision Tree and Random Forest models."""
    global dtr_model, rfr_model, model_metrics, feature_importances

    X = df.drop('Yeild (Q/acre)', axis=1)
    y = df['Yeild (Q/acre)']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Decision Tree Regressor
    dtr = DecisionTreeRegressor(max_depth=4, min_samples_leaf=2, min_samples_split=8, random_state=0)
    dtr.fit(X_train, y_train)
    d_pred = dtr.predict(X_test)

    # Random Forest Regressor
    rfr = RandomForestRegressor(max_depth=4, min_samples_leaf=2, min_samples_split=6, n_estimators=100, random_state=42)
    rfr.fit(X_train, y_train)
    r_pred = rfr.predict(X_test)

    dtr_model = dtr
    rfr_model = rfr

    # Metrics
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

    # Feature importances
    feature_names = list(X_train.columns)
    feature_importances = {
        'features': feature_names,
        'decision_tree': dtr.feature_importances_.tolist(),
        'random_forest': rfr.feature_importances_.tolist()
    }


# Initialize on startup
print("[*] Loading and preprocessing data...")
df = load_and_preprocess_data()
print("[*] Preparing chart data...")
prepare_chart_data(df)
print("[*] Training models...")
train_models(df)
print("[OK] Application ready!")


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
