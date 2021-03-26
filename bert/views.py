from django.shortcuts import render
from .article_query import get_queries
from .article_to_point import Articles2Points, Data2Articles

# Create your views here.

def view_raw_results(request, *args, **kwargs):
	limit = 10 
	metadata = "true" # to be replaced with POST["metadata from form"]
	fulltext = "false" 
	citations = "false" 
	similar = "false"
	duplicate = "false"
	urls = "false" 
	faithfulMetadata = "false" 

	queries = [
		"Deep Learning",
		"Machine Learning",
		# "Biology",
		# "Politics"
	]

	results = get_queries(queries, limit, metadata, fulltext, citations, similar, duplicate, urls, faithfulMetadata)

	a2p = Articles2Points()
	articles = Data2Articles(results[0]["data"])

	context = {
		"points": a2p(articles)
	}

	return render(request, "raw_results.html", context)