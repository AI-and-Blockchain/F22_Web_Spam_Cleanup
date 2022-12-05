# flask --app app run

#%%
import json
from flask import Flask,request,jsonify
from flask_cors import CORS, cross_origin

import pandas as pd
import json

from feature_extractor import FeatureExtractor,Pipeline
from website import Website
from data_tester import verify_performance

import time

app = Flask(__name__)
CORS(app)

@app.route('/')
def root():
    return "I'm up!"

@app.route('/verify',methods=['POST'])
def verify():
    request.get_json()
    db = json.load(open('db.json'))
    print('I am the verifier!')
    print(request.json)

    url = request.json['urls']
    feature = request.json['features']
    label = request.json['labels']

    start = time.perf_counter()
    websites = list(map(Website,url))
    feature_extractors = Pipeline(map(lambda f: FeatureExtractor(**f),feature))
    
    print(f'built features in {time.perf_counter() - start:} ms')
    
    start = time.perf_counter()
    dataset = pd.DataFrame(
        map(feature_extractors,websites),
        columns = feature_extractors.names
    )



    print(f'built dataframe in {time.perf_counter() - start:} ms')




    new_perf = verify_performance(dataset)

    success = False
    if new_perf > db["value"]:
        db["value"] = new_perf
        success = True
        json.dump(db,open('db.json','w'))

    print(f'finished check in {time.perf_counter() - start:} ms')
    print(f'old performance: {db["value"]}, new preformance: {new_perf}')
    print(f'is_verified: {success}')

    return jsonify({
        'success': success,
        'key': 'test_key'
    })




# %%
