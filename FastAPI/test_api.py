import requests
import pandas as pd
import random
from tqdm import tqdm

# Set constants
LIMIT_PER_PAGE = 100
MAX_PAGES = 600  # 100 items/page × 200 pages = up to 20,000 artworks
OUTPUT_CSV = "artic_sampled_paintings.csv"
DESIRED_SAMPLE_SIZE = 10000

# Base API endpoint
BASE_URL = "https://api.artic.edu/api/v1/artworks"

def fetch_artworks_with_images():
    artworks = []

    print(f"Fetching up to {MAX_PAGES * LIMIT_PER_PAGE} artworks with images from AIC API...")

    for page in tqdm(range(1, MAX_PAGES + 1)):
        params = {
            "page": page,
            "limit": LIMIT_PER_PAGE,
            "fields": "id,title,image_id,artist_display,date_display,artwork_type_title",
        }
        response = requests.get(BASE_URL, params=params)
        response.raise_for_status()
        data = response.json()["data"]
        for item in data:
            genre = item.get("artwork_type_title", "")
            # Only keep artworks that are paintings with an image
            if item.get("image_id") and genre and (genre.lower() in ["painting", "drawing and watercolor"] or any(word in genre.lower() for word in ["painting", "paint", "drawing", "watercolor"])):
                artworks.append(item)
    print(f"Fetched {len(artworks)} artworks with images.")
    return artworks

def sample_artworks(artworks, sample_size):
    if len(artworks) < sample_size:
        raise ValueError("Not enough artworks to sample from.")
    return random.sample(artworks, sample_size)

def save_to_csv(artworks, filename):
    rows = []
    for item in artworks:
        rows.append({
            "id": item["id"],
            "title": item["title"],
            "image_id": item["image_id"],
            "artist_display": item["artist_display"],
            "date_display": item["date_display"],
        })
    df = pd.DataFrame(rows)
    df.to_csv(filename, index=False)
    print(f"Saved {len(df)} artworks to {filename}")

if __name__ == "__main__":
    all_artworks = fetch_artworks_with_images()
    sampled = sample_artworks(all_artworks, DESIRED_SAMPLE_SIZE)
    save_to_csv(sampled, OUTPUT_CSV)