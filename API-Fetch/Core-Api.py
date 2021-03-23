#!/usr/bin/env python

import json

import requests

with open("API_Keys.json", "r") as APIKEY:
    KEYS = json.load(APIKEY)

CORE_KEY = KEYS["Core-Key"]

QUERY = input("Query: ")

limit = 10  # 1-100 articles fetched
metadata = "true"
fulltext = "false"
citations = "false"
similar = "false"
duplicate = "false"
urls = "false"
faithfulMetadata = "false"

URL = f"https://core.ac.uk:443/api-v2/articles/similar?limit={limit}&metadata={metadata}&fulltext={fulltext}&citations={citations}&similar={similar}&duplicate={duplicate}&urls={urls}&faithfulMetadata={faithfulMetadata}&apiKey={CORE_KEY}"  # noqa

print(URL)

res = requests.post(
    URL, data=QUERY.encode("utf-8"), headers={"Content-Type": "text/plain"}
)
res = res.json()

with open("out.json", "w") as outfile:
    json.dump(res, outfile, indent=4)

parsed_papers = []

for paper in res["data"]:
    print("\n" + paper["title"])
    try:
        parsed_papers.append(
            {
                "title": paper["title"],
                "description": paper["description"],
                "authors": paper["authors"],
                "datePublished": paper["datePublished"],
                "downloadUrl": paper["downloadUrl"],
            }
        )
    except KeyError:
        pass
# print(json.dumps(res, indent=4))


with open("out_parsed.json", "w") as outfile:
    json.dump(parsed_papers, outfile, indent=4)
