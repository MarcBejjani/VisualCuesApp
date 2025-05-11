import json

with open("dataset.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Number of entries:", len(data))