import torch
from geoclip import GeoCLIP, train
from geoclip.train import eval_images
import torch.nn as nn

#Wrapper class using GeoCLIP model
class Geolocator:
    def __init__(self, use_trained=False, queue_size=4096):
        self.model = GeoCLIP(queue_size=queue_size)
        # self.device = "cpu"
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model.to(self.device)

        if use_trained:
            self.load_weights()

    def predict(self, image_path, top_k=1):
        return self.model.predict(image_path, top_k=top_k)

    def train(self, train_dataloader, epoch, batch_size, scheduler=None, criterion=nn.CrossEntropyLoss()):
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.001)
        train(train_dataloader, self.model, optimizer, epoch, batch_size, self.device, scheduler=scheduler, criterion=criterion)

    # def test(self, val_dataloader):
    #     return eval_images(val_dataloader, self.model, self.device)

    #load weights from specified files below
    def load_weights(self):
        self.model.image_encoder.mlp.load_state_dict(torch.load("image_encoder_mlp_weights.pth"))
        self.model.location_encoder.load_state_dict(torch.load("location_encoder_weights.pth"))
        self.model.logit_scale = nn.Parameter(torch.load("logit_scale_weights.pth"))

    #save weights to the specified files below
    def save_weights(self):
        torch.save(self.model.image_encoder.mlp.state_dict(), "image_encoder_mlp_weights.pth")
        torch.save(self.model.location_encoder.state_dict(), "location_encoder_weights.pth")
        torch.save(self.model.logit_scale, "logit_scale_weights.pth")