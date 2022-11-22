import requests 

class Website:
    def __init__(self, url):
        r = requests.get(url)
        raw_html = ''
        if r.status_code == 200:
            raw_html = r.text
        else:
            print(f'cannot get content! status: {r.status_code}')
        self.raw_html = raw_html


def get_websites(url_list):
    return list(map(Website,url_list))