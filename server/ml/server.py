from flask import Flask, request

import pickle, dill
import pandas as pd
import copy
import numpy as np
import json
import datetime
from lstm_model_forecaster import get_predict_on_future

app = Flask(__name__)


@app.post("/predict")
def predict():
    print(f"got request to train at {datetime.datetime.now()}")

    train = pd.read_csv(request.files["train"].stream)

    print("loaded dataset")

    return json.dumps(get_predict_on_future(train), default=str)

    # return get_predict_on_future(train)
