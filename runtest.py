import Articles2Points
import json
import os

if os.path.exists("./results.json"):
    with open("./results.json", 'r') as results_json:
        results = json.load(results_json)
else:
    from SampleQuery import results
    with open("./results.json", 'w+') as file:
        json.dump(results, file)

a2p = Articles2Points.Articles2Points()
articles = Articles2Points.Data2Articles(results[0]["data"])
points = a2p(articles)
print(points[:10])
print(len(points))
print(len(articles))

print(json.dumps(articles[0].to_unity_json_dict()))

articles_json = Articles2Points.Articles2UnityJson(articles)
print(articles_json)

with open("test_articles.json", 'w+') as file:
    file.write(articles_json)
