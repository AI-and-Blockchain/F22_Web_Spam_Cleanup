import requests 

def count_occurance(website,keywords):
    return sum(website.raw_html.count(k) for k in keywords)

FEATURE_OPERATIONS = {
    "count_occurance": count_occurance
}

class FeatureExtractor:
    def __init__(
        self,
        name,
        operation,
        source_url,
    ):

        r = requests.get(source_url)
        source = ''
        if r.status_code == 200:
            source = r.json()
        else:
            print(f'cannot get source! status: {r.status_code}')
        
        self.source = source
        self.operation = FEATURE_OPERATIONS[operation]
        self.name = name
    
    def __call__(
        self, 
        website
    ):
        return self.operation(website,self.source)


        
class Pipeline:
    def __init__(
        self,
        feature_extractors,
    ):
        self.feature_extractors = list(feature_extractors)
        self.name = [f.name for f in self.feature_extractors]
    def __call__(
        self,
        website
    ):
        return [f(website) for f in self.feature_extractors]