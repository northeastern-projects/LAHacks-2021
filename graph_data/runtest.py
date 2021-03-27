import Articles2Points
import json
import os

if os.path.exists("graph_data/results.json"):
    with open("graph_data/results.json", 'r') as results_json:
        results = json.load(results_json)
else:
    from SampleQuery import results
    with open("graph_data/results.json", 'w+') as file:
        json.dump(results, file)

checked = set()
for i, article in enumerate(results): 
    id = article["title"]
    if id in checked:
        print("Duplicate!", i, id)
    else:
        checked.add(id)

a2p = Articles2Points.Articles2Points()
articles = Articles2Points.Data2Articles(results)
points = a2p(articles)
print(points[:10])
print(len(points))
print(len(articles))

print(articles[0].dict)

nodes = Articles2Points.Articles2Nodes(articles)

links = []

graph = {"nodes":nodes, "links":links}
graph_json = json.dumps(graph)

with open("graph_data/graph.json", 'w+') as file:
    file.write(graph_json)

