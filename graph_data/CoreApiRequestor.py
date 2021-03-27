import urllib.request
import urllib.parse
import json
import pprint

class CoreApiRequestor:

    def __init__(self, endpoint, params):
        self.endpoint = endpoint
        self.params = params

    def request_url(self, url):
        with urllib.request.urlopen(url) as response:
            html = response.read()
        return html

    def get_query_url(self,method,query,page):
        self.params['page'] = page
        print(urllib.parse.quote(query))
        return self.endpoint + method + '/' + urllib.parse.quote(query) + '?' + urllib.parse.urlencode(self.params)

    def get_query(self,method,query, pages):
        url = self.get_query_url(method,query,1)
        print (1, url)
        all_articles=[]
        resp = self.request_url(url)
        result = json.loads(resp.decode('utf-8'))
        all_articles.extend(result['data'])
        if (result['totalHits']>self.params['pageSize']):
            numOfPages = int(result['totalHits']/self.params['pageSize'])  #rounds down
            if (numOfPages>pages):
                numOfPages=pages
            for i in range(2,numOfPages+1):
                url = self.get_query_url(method,query,i)
                print(i,url)
                resp =self.request_url(url)
                result = json.loads(resp.decode('utf-8'))
                all_articles.extend(result['data'])
        return all_articles
        