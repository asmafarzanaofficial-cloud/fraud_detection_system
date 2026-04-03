from flask import Flask, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

model = pickle.load(open("fraud_model.pkl", "rb"))

@app.route("/")
def home():
    return "ML Server Running"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data or "features" not in data:
            return jsonify({"error": "Missing features"}), 400

        features = data["features"]

        # only 1 feature expected
        if len(features) != 1:
            return jsonify({"error": "Send only amount"}), 400

        features_array = np.array(features).reshape(1, -1)

        prediction = model.predict(features_array)

        return jsonify({"fraud": int(prediction[0])})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000)