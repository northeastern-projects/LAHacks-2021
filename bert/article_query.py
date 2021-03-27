import json
import requests
import urllib.parse
from django.conf import settings

CORE_KEY = settings.CORE_KEY

def get_queries(query, page_limit, params):
	endpoint = "https://core.ac.uk:443/api-v2/articles/search/"
	params['apiKey'] = CORE_KEY
	
	real_query = '(title:('+query+') OR description:('+query+') OR fullText:('+query+')) AND description:*'
	# language.name:English doesnt work

	url = endpoint + urllib.parse.quote(real_query)
	print(url)

	all_articles = []
	result = requests.get(url, params=params).json()
	all_articles.extend(result['data'])
	if (result['totalHits']>params['pageSize']):
		pages = int(result['totalHits']/params['pageSize'])  #rounds down
		if (pages>page_limit):
			pages=page_limit
		for i in range(2, pages+1):
			params['page'] = i
			result = requests.get(url, params=params).json()
			all_articles.extend(result["data"])
	return all_articles