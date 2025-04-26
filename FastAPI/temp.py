import pandas as pd
import requests
from PIL import Image
from io import BytesIO

# Load your CSV file
df = pd.read_csv("artic_sampled_paintings.csv")  # change this to your actual file name

# Base IIIF URL
IIIF_BASE = "https://www.artic.edu/iiif/2"

# Loop through first 50 images
for idx, row in df.head(50).iterrows():
    image_id = row.get("image_id")

    if pd.isna(image_id):
        print(f"No image_id for row {idx}")
        continue

    # Construct the image URL
    image_url = f"{IIIF_BASE}/{image_id}/full/843,/0/default.jpg"
    
    try:
        # Fetch and display the image
        response = requests.get(image_url)
        image = Image.open(BytesIO(response.content))
        image.show(title=f"Artwork {row['id']}")
    except Exception as e:
        print(f"Failed to load image for ID {row['id']}: {e}")
