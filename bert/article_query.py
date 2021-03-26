import json
import requests
from django.conf import settings

CORE_KEY = settings.CORE_KEY

def get_queries(queries, limit, metadata, fulltext, citations, similar, duplicate, urls, faithfulMetadata):
	url = f"https://core.ac.uk:443/api-v2/articles/search?metadata={metadata}&fulltext={fulltext}&citations={citations}&similar={similar}&duplicate={duplicate}&urls={urls}&faithfulMetadata={faithfulMetadata}&apiKey={CORE_KEY}" 
	data = []
	
	for query in queries:
		data.append({"query": '"' + query + '" AND description:*', "page":1, "pageSize": limit, "language.name":"English"})
	
	res = requests.post(url, data = json.dumps(data), headers={"Content-Type": "text/plain"})
	return res.json()