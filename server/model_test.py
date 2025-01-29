"""
example usage of Geolocator model

use 'python model_test.py' to run

addtional notes:
- may print warnings from loading up GeoCLIP model, this does not affect the output
- after loading model it may cache it under the _pycache_ folder, I don't know how to stop it
- predictions took ~1 minute to run if not using gpu
"""
from model import Geolocator

model = Geolocator()

image_path = "example_data/ucsc.jpg"

top_pred_gps, top_pred_prob = model.predict(image_path, top_k=5)

print("Top 5 GPS Predictions")
print("=====================")
for i in range(5):
    lat, lon = top_pred_gps[i]
    print(f"Prediction {i+1}: ({lat:.6f}, {lon:.6f})")
    print(f"Probability: {top_pred_prob[i]:.6f}")
    print("")