import requests
class Website:
    def __init__(self, url):
        self.url = url
        self.source = None

    def get(self,target):
        if target == 'url': return self.url
        if target == 'source':
            if not self.source:
                r = requests.get(self.url)
                raw_html = ''
                if r.status_code == 200:
                    raw_html = r.text
                else:
                    print(f'cannot get content! status: {r.status_code}')
                self.source = raw_html
            return self.source