#!/usr/bin/env python
import json, lzma, sys

def process(input_file, output_file):
    # Load JSON (compressed or not)
    if input_file.endswith(".xz"):
        with lzma.open(input_file, "rt") as f:
            data = json.load(f)
    else:
        with open(input_file, "r") as f:
            data = json.load(f)

    filtered_data = {}
    new_index = 0  # To ensure sequential keys like "0", "1", "2", ...

    print(len(data))

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python script.py input.json[.xz] output.json")
    else:
        process(sys.argv[1], sys.argv[2])