#!/usr/bin/env python

import json

with open("API_Keys.json", "r") as APIKEY:
    KEYS = json.load(APIKEY)

print(KEYS)
