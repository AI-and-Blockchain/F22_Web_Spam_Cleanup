import requests
import json
inp = json.load(open('testInput.json'))
headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}
r= requests.post(
    'http://127.0.0.1:5000/verify',
    data = inp,
    headers=headers
)

inp