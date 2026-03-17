"""
app.py — MoodLens API (Fixed)
=============================
Endpoints:
  POST /predict_all              → JSON predictions from all 4 models
  POST /predict_report_weekly    → 4-week PDF (XGBoost B + RF B debate)
  POST /predict_report_json      → 4-week report as JSON (for dashboard rendering)

All endpoints require header:  x-api-key: mood_flow_model_key
CORS enabled for localhost frontend.
"""

import io
import sys
import datetime
from functools import wraps

import numpy as np
import shap as shap_lib
import joblib
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

import moodlens_pipeline as pipeline

# ── Override demo SHAP with real SHAP ────────────────────────
def _real_compute_shap(xgb_model, x_scaled: np.ndarray) -> dict:
    explainer = shap_lib.TreeExplainer(xgb_model)
    sv_raw    = explainer.shap_values(x_scaled)
    sv        = np.array(sv_raw)
    n_classes = 3
    if sv.ndim == 3 and sv.shape[0] == n_classes:
        mean_abs = np.mean([np.abs(sv[i]) for i in range(n_classes)], axis=0)
    elif sv.ndim == 3 and sv.shape[2] == n_classes:
        mean_abs = np.mean([np.abs(sv[:, :, i]) for i in range(n_classes)], axis=0)
    else:
        mean_abs = np.abs(sv)
    importance = np.array(mean_abs).flatten()
    return {feat: round(float(importance[i]), 6)
            for i, feat in enumerate(pipeline.MODEL_FEATURES)}

pipeline.compute_shap = _real_compute_shap

# ── App setup ─────────────────────────────────────────────────
VALID_API_KEY = "mood_flow_model_key"
app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True,
     allow_headers=["Content-Type", "x-api-key"],
     methods=["GET", "POST", "OPTIONS"])

# ── Load models ───────────────────────────────────────────────
try:
    print("Loading ML Models...")
    xgb_model_new = joblib.load("mood_stability_xgb_model.pkl")
    rf_model_new  = joblib.load("mood_stability_rf_model.pkl")
    with open("mood_stability_xgb_modelB.pkl", "rb") as f:
        xgb_model_b = joblib.load(f)
    with open("mood_stability_rf_modelB.pkl", "rb") as f:
        rf_model_b = joblib.load(f)
    feature_names = joblib.load("mood_stability_feature_names.pkl")
    label_map     = joblib.load("mood_stability_label_map.pkl")
    print("All 4 models loaded successfully!")
except Exception as e:
    print(f"\nCRITICAL ERROR: {e}")
    sys.exit(1)

# ── Key remapping ─────────────────────────────────────────────
KEY_REMAP = {
    "Q26_Sleep_Quality":     "Sleep_Quality",
    "Q27_Daily_Stress":      "Daily_Stress",
    "Q28_Social_Connection": "Social_Connection",
    "Q29_Focus_Ability":     "Focus_Ability",
    "Q30_Physical_Fatigue":  "Physical_Fatigue",
}

def normalize_answers(answers: dict) -> dict:
    answers = dict(answers)
    for src, dst in KEY_REMAP.items():
        if src in answers and dst not in answers:
            answers[dst] = answers[src]
    return answers

def prepare_for_predict_all(answers: dict):
    import pandas as pd
    answers = normalize_answers(answers)
    df = pd.DataFrame([answers])
    missing = [c for c in feature_names if c not in df.columns]
    if missing:
        return None, missing
    df = df[feature_names]
    df = (df - 1) / 4.0
    return df, None

def require_api_key(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.headers.get("x-api-key") == VALID_API_KEY:
            return f(*args, **kwargs)
        return jsonify({"error": "Unauthorized. Invalid or missing API Key."}), 401
    return decorated

# ── OPTIONS preflight handler ─────────────────────────────────
@app.after_request
def after_request(response):
    response.headers['Access-Control-Allow-Origin']  = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, x-api-key'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response

# ═══════════════════════════════════════════════════════════
# ENDPOINT 1: /predict_all
# ═══════════════════════════════════════════════════════════
@app.route("/predict_all", methods=["POST", "OPTIONS"])
@require_api_key
def predict_all():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        raw     = data[0] if isinstance(data, list) else data
        answers = raw.get("answers", {})

        input_df, missing = prepare_for_predict_all(answers)
        if missing:
            return jsonify({"error": "Missing required features", "missing": missing}), 400

        xgb_new_code = xgb_model_new.predict(input_df)[0]
        rf_new_code  = rf_model_new.predict(input_df)[0]
        xgb_b_code   = xgb_model_b.predict(input_df)[0]
        rf_b_code    = rf_model_b.predict(input_df)[0]

        return jsonify({
            "status": "success",
            "predictions": {
                "XGBoost_ModelA":      {"code": int(xgb_new_code), "label": label_map.get(xgb_new_code, "Unknown")},
                "RandomForest_ModelA": {"code": int(rf_new_code),  "label": label_map.get(rf_new_code,  "Unknown")},
                "XGBoost_ModelB":      {"code": int(xgb_b_code),   "label": label_map.get(xgb_b_code,  "Unknown")},
                "RandomForest_ModelB": {"code": int(rf_b_code),    "label": label_map.get(rf_b_code,   "Unknown")},
            },
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


# ═══════════════════════════════════════════════════════════
# ENDPOINT 2: /predict_report_weekly — PDF
# ═══════════════════════════════════════════════════════════
@app.route("/predict_report_weekly", methods=["POST", "OPTIONS"])
@require_api_key
def predict_report_weekly():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        body = request.get_json()
        if not body or "weeks" not in body:
            return jsonify({"error": "Request must contain a 'weeks' key."}), 400

        weeks_raw = body["weeks"]
        if not isinstance(weeks_raw, list) or len(weeks_raw) != 4:
            return jsonify({"error": "Exactly 4 weekly entries required."}), 400

        records = []
        for idx, week_entry in enumerate(weeks_raw):
            week_num = idx + 1
            entry    = week_entry[0] if isinstance(week_entry, list) else week_entry
            answers  = normalize_answers(entry.get("answers", {}))
            missing  = [f for f in pipeline.MODEL_FEATURES if f not in answers]
            if missing:
                return jsonify({"error": f"Week {week_num} missing features: {missing}"}), 400
            record = pipeline.run_weekly_inference(answers, week_num, xgb_model_b, rf_model_b)
            records.append(record)

        report_data = pipeline.aggregate_records(records)
        first = weeks_raw[0][0] if isinstance(weeks_raw[0], list) else weeks_raw[0]
        last  = weeks_raw[-1][0] if isinstance(weeks_raw[-1], list) else weeks_raw[-1]
        report_data["user"]["user_id"]      = first.get("userId", "N/A")
        report_data["user"]["period_start"] = (first.get("date", "")[:10] or datetime.date.today().isoformat())
        report_data["user"]["period_end"]   = (last.get("date",  "")[:10] or datetime.date.today().isoformat())

        pdf_buffer = io.BytesIO()
        pipeline.generate_report(report_data, pdf_buffer)
        pdf_buffer.seek(0)

        user_id    = report_data["user"]["user_id"].split("@")[0]
        start_date = report_data["user"]["period_start"]
        end_date   = report_data["user"]["period_end"]
        filename   = f"moodlens_{user_id}_{start_date}_to_{end_date}.pdf"

        return send_file(pdf_buffer, mimetype="application/pdf",
                         as_attachment=True, download_name=filename)

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


# ═══════════════════════════════════════════════════════════
# ENDPOINT 3: /predict_report_json — report data as JSON
# ═══════════════════════════════════════════════════════════
@app.route("/predict_report_json", methods=["POST", "OPTIONS"])
@require_api_key
def predict_report_json():
    if request.method == "OPTIONS":
        return jsonify({}), 200
    try:
        body = request.get_json()
        if not body or "weeks" not in body:
            return jsonify({"error": "Request must contain a 'weeks' key."}), 400

        weeks_raw = body["weeks"]
        if not isinstance(weeks_raw, list) or len(weeks_raw) != 4:
            return jsonify({"error": "Exactly 4 weekly entries required."}), 400

        records = []
        for idx, week_entry in enumerate(weeks_raw):
            week_num = idx + 1
            entry    = week_entry[0] if isinstance(week_entry, list) else week_entry
            answers  = normalize_answers(entry.get("answers", {}))
            missing  = [f for f in pipeline.MODEL_FEATURES if f not in answers]
            if missing:
                return jsonify({"error": f"Week {week_num} missing: {missing}"}), 400
            record = pipeline.run_weekly_inference(answers, week_num, xgb_model_b, rf_model_b)
            records.append(record)

        report_data = pipeline.aggregate_records(records)

        # Make JSON serialisable
        import json
        def make_serialisable(obj):
            if isinstance(obj, np.ndarray):  return obj.tolist()
            if isinstance(obj, np.integer):  return int(obj)
            if isinstance(obj, np.floating): return float(obj)
            if isinstance(obj, dict):        return {k: make_serialisable(v) for k,v in obj.items()}
            if isinstance(obj, list):        return [make_serialisable(i) for i in obj]
            return obj

        return jsonify({"status":"success", "report": make_serialisable(report_data)})

    except Exception as e:
        import traceback; traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


# ── Entry point ───────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
