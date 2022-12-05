import requests
# headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
# r= requests.post(
#     'http://127.0.0.1:5000/verify',
#     data = inp,
#     headers=headers
# )

# inp

#%%
import json
import time
from website import Website
from feature_extractor import FeatureExtractor,Pipeline
request = json.load(open('testInput.json'))

# url = request.json['url']
# feature = request.json['feature']
# label = request.json['label']


start = time.perf_counter()
websites = list(map(Website,request['url']))
feature_extractors = Pipeline(map(lambda f: FeatureExtractor(**f),request['feature']))



dd = list(map(feature_extractors,websites))