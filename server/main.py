from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import tempfile
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import glob

# Print TensorFlow version
print(f"TensorFlow version: {tf.__version__}")

app = Flask(__name__)
CORS(app)
allowed_extensions = {"png", "jpg"}
min_lat = 36.97721
max_lat = 37.0033005
min_lon = -122.0717714
max_lon = -122.04819

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Ensure the upload directory exists
upload_dir = os.path.join(script_dir, 'images/upload')
os.makedirs(upload_dir, exist_ok=True)

def get_latest_model_path(directory):
    model_files = glob.glob(os.path.join(directory, "*.keras"))
    if not model_files:
        raise FileNotFoundError("No .keras model files found in the directory.")
    latest_model = max(model_files, key=os.path.getctime)
    return latest_model

model_path = get_latest_model_path(script_dir)

# Print the model path to verify it
print(f"Model path: {model_path}")

# Load the model
model = load_model(model_path)

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        print("No file part in the request")
        return jsonify({'error': 'No file'}), 400
    
    file = request.files['image']
    print(f"Received file: {file.filename}")
    
    if file and allowed(file.filename):
        filename, extension = file.filename.rsplit('.', 1)
        new_filename = generate_temp_upload_filename(filename, "." + extension)   
        print(f"New filename: {new_filename}")
        file.save(new_filename)
        
        # Load and preprocess the image
        image = tf.keras.utils.load_img(new_filename, target_size=(224, 224))
        image = tf.keras.utils.img_to_array(image) / 255.0
        image = np.expand_dims(image, axis=0)
        
        # Predict coordinates using the model
        predictions = model.predict(image)
        predictions = denormalize_predicted_coordinates(predictions, min_lat, max_lat, min_lon, max_lon)
        
        os.remove(new_filename)
        print(predictions)
        return jsonify({'prediction': predictions.tolist()}), 200
    else:
        print("Invalid file")
        return jsonify({'error': 'Invalid file'}), 400

def allowed(file_name):
    extension = file_name.rsplit('.', 1)[-1].lower()
    return extension in allowed_extensions

def generate_temp_upload_filename(filename, extension):
    tmp_file = tempfile.NamedTemporaryFile(delete=False, dir=upload_dir, prefix=filename, suffix=extension)
    return tmp_file.name

def denormalize_predicted_coordinates(coords, min_latitude, max_latitude, min_longitude, max_longitude):
    lat = coords[:, 0] * (max_latitude - min_latitude) + min_latitude
    lon = coords[:, 1] * (max_longitude - min_longitude) + min_longitude
    return np.stack([lat, lon], axis=1)

if __name__ == "__main__":
    app.run(debug=True, port=8080)