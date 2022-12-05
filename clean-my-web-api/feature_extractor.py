def _count(subset,keywords):
    return sum(subset.count(k) for k in keywords)

def _length(subset,keywords):
    return len(subset)

FEATURE_OPERATIONS = {
    "count": _count,
    "length": _length
}

class FeatureExtractor:
    def __init__(
        self,
        name,
        operation,
        target,
        data,
    ):
        # self.website = Website(source_url)
        self.name = name
        self.operation = FEATURE_OPERATIONS[operation]
        self.target = target
        self.data = data
    
    def __call__(
        self, 
        website
    ):
        return self.operation(website.get(self.target),self.data)

class Pipeline:
    def __init__(
        self,
        feature_extractors,
    ):
        self.feature_extractors = list(feature_extractors)
        self.names = [f.name for f in self.feature_extractors]
    def __call__(
        self,
        website
    ):
        return [f(website) for f in self.feature_extractors]