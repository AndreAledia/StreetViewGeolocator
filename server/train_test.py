"""
example usage of training Geolocator model

use 'python train_test.py' to run

addtional note:
- may print warnings from loading up GeoCLIP model, this does not affect the output
- after loading model it may cache it under the _pycache_ folder, I don't know how to stop it
"""
from model import Geolocator
from train import *
import os

model = Geolocator()

dataset_file = 'example_data/data.csv'
dataset_folder = os.getcwd() + "\\example_data"
print(dataset_folder)

print("Starting Training")
print("=====================")
dataset = load_dataset(dataset_file=dataset_file, dataset_folder=dataset_folder, transform=img_train_transform(), batch_size=4)
model.train(dataset, epoch=2, batch_size=4)

# Creates files to save weights after training
# model.save_weights()