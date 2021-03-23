#!/usr/bin/env python

import json

import requests

with open("API_Keys.json", "r") as APIKEY:
    KEYS = json.load(APIKEY)

CORE_KEY = KEYS["Core-Key"]

PAGE = 1  # Pages 1 - 100
PAGESIZE = 10  # 10 results per page, 10-100

URL = f"https://core.ac.uk:443/api-v2/search/Hello?page={PAGE}&pageSize={PAGESIZE}&apiKey={CORE_KEY}"  # noqa

res = requests.get(URL)
res = res.json()
print(json.dumps(res, indent=4))

with open("out.json", "w") as outfile:
    json.dump(res, outfile, indent=4)
