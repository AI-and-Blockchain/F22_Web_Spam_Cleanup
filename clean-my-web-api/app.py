# flask --app app run

#%%
import json
from flask import Flask,request
import pandas as pd

from feature_extractor import FeatureExtractor,Pipeline
from website import get_websites
from data_tester import verify_performance

import time

app = Flask(__name__)

@app.route('/')
def root():
    return "I'm up!"

@app.route('/verify',methods=['POST'])
def verify():
    url = request.json['url']
    feature = request.json['feature']
    label = request.json['label']

    start = time.perf_counter()
    websites = get_websites(url)
    feature_extractors = Pipeline(map(lambda f: FeatureExtractor(**f),feature))
    
    print(f'built features in {time.perf_counter() - start:} ms')
    
    start = time.perf_counter()
    dataset = pd.DataFrame(
        map(feature_extractors,websites),
        columns = feature_extractors.name
    )



    print(f'built dataframe in {time.perf_counter() - start:} ms')




    new_perf = verify_performance(dataset)
    print(f'verified performance in {time.perf_counter() - start:} ms')

    return str(new_perf)




# %%
