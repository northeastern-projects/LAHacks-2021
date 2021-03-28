from django.shortcuts import render, redirect
from .article_query import get_queries
from .article_to_point import Articles2Points, Data2Articles
import json

# Create your views here.

def view_raw_results(request, *args, **kwargs):
	if "topic" in request.session:
		query = request.session.get("topic")
		articles_per_page = 50 # 10 to 100
		pages = 2
		
		params = {
			'page':1,
	   		'pageSize':articles_per_page,
	   		'metadata':'true',
	   		'fulltext':'false',
	   		'citations':'false',
	   		'similar':'false',
	   		'duplicate':'false',
	   		'urls':'true',
	   		'faithfulMetadata':'false',
		}
		results = get_queries(query, pages, params)
		a2p = Articles2Points()
		articles = Data2Articles(results)
		a2p(articles)

		nodes = list(map(lambda a: a.dict, articles))

		links = []

		graph = {"nodes":nodes, "links":links}
		graph_json = json.dumps(graph)  #### data for the 3d-visual

		context = {
			"data": graph_json
		}

		""" with open("graph.json", 'w+') as file:
			file.write(graph_json) """
		
		return render(request, "vis.html", context)

	return redirect('/')

