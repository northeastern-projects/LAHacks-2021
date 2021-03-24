import json
import requests

with open("API_Keys.json", 'r') as json_keys:
  KEYS = json.load(json_keys)

CORE_KEY = KEYS["Core-Key"]

query1 = "Deep Learning" #@param {type:"string"}
query2 = "Machine Learning" #@param {type:"string"}
query3 = "Biology" #@param {type:"string"}
query4 = "Politics" #@param {type:"string"}

limit = 50 #@param {type:"slider", min:10, max:100, step:10}
metadata = True #@param {type:"boolean"}
fulltext = False #@param {type:"boolean"}
citations = False #@param {type:"boolean"}
similar = False #@param {type:"boolean"}
duplicate = False #@param {type:"boolean"}
urls = False #@param {type:"boolean"}
faithfulMetadata = False #@param {type:"boolean"}

metadata = "true" if metadata else "false"
fulltext = "true" if fulltext else "false"
citations = "true" if citations else "false"
similar = "true" if similar else "false"
duplicate = "true" if duplicate else "false"
urls = "true" if urls else "false"
faithfulMetadata = "true" if faithfulMetadata else "false"

queries = []
if query1: queries.append(query1)
if query2: queries.append(query2)
if query3: queries.append(query3)
if query4: queries.append(query4)

def get_queries(queries, limit, metadata, fulltext, citations, similar, duplicate, urls, faithfulMetadata):
    url = f"https://core.ac.uk:443/api-v2/articles/search?metadata={metadata}&fulltext={fulltext}&citations={citations}&similar={similar}&duplicate={duplicate}&urls={urls}&faithfulMetadata={faithfulMetadata}&apiKey={CORE_KEY}"
    data = []
    for query in queries:
      data.append({"query": '"' + query + '" AND description:*', "page":1, "pageSize": limit, "language.name":"English"})
    res = requests.post(url, data = json.dumps(data), headers={"Content-Type": "text/plain"})
    return res.json()

results = get_queries(queries, limit, metadata, fulltext, citations, similar, duplicate, urls, faithfulMetadata)