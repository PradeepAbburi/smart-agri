import json

with open('crop yield prediction.ipynb', 'r', encoding='utf-8') as f:
    nb = json.load(f)

for i, c in enumerate(nb['cells']):
    print(f"--- Cell {i} ({c['cell_type']}) ---")
    print("".join(c['source']))
    print()
