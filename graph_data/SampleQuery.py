import json
import CoreApiRequestor

# init 
endpoint = 'https://core.ac.uk:443/api-v2'

api_key = 'neHjg153Yp6UPxMulymbAs7f4QdzrtIJ'

method = '/articles/search'
topic = 'deep AND learning'

# NUMBER OF PAGES & NUMBER OF ARTICLES PER PAGE
pageNum = 2
pageSize = 100 #@param {type:"slider", min:10, max:100, step:10}

# TODO implement minyear and maxyear

query = '(title:('+topic+') OR description:('+topic+') OR fullText:('+topic+')) AND description:*' # AND description:* AND language.name:English
print(query)

metadata = True #@param {type:"boolean"}
fulltext = False #@param {type:"boolean"}
citations = False #@param {type:"boolean"}
similar = False #@param {type:"boolean"}
duplicate = False #@param {type:"boolean"}
urls = True #@param {type:"boolean"}
faithfulMetadata = False #@param {type:"boolean"}

metadata = "true" if metadata else "false"
fulltext = "true" if fulltext else "false"
citations = "true" if citations else "false"
similar = "true" if similar else "false"
duplicate = "true" if duplicate else "false"
urls = "true" if urls else "false"
faithfulMetadata = "true" if faithfulMetadata else "false"

params = {
    'apiKey':api_key,
    'page':1,
    'pageSize':pageSize,
    'metadata':metadata,
    'fulltext':fulltext,
    'citations':citations,
    'similar':similar,
    'duplicate':duplicate,
    'urls':urls,
    'faithfulMetadata':faithfulMetadata,
}

api = CoreApiRequestor.CoreApiRequestor(endpoint,params)

results = api.get_query(method,query,pageNum)
print(results[0])