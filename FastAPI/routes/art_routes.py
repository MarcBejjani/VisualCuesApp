from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from routes import get_db, correct_grammer_and_translate
from sentence_transformers import SentenceTransformer
import faiss
import pickle
import torch
import numpy as np
from transformers import AutoModelForCausalLM, AutoTokenizer
from PIL import Image
from io import BytesIO
import logging
import re
import os

router = APIRouter()
logger = logging.getLogger(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# MODEL_NAME = "Qwen/Qwen3-1.7B"
# tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
# model = AutoModelForCausalLM.from_pretrained(
#     MODEL_NAME, torch_dtype="auto", device_map="cuda:0"
# )

# Load the model **once** at startup
print("Loading embedding model...")
embedding_model = SentenceTransformer("thenlper/gte-large")

# Load FAISS index and metadata once
print("Loading FAISS index and metadata...")
wikiIndexImages = faiss.read_index("./embeddingsCLIP/index/wikiart_index.faiss")
with open("./embeddingsCLIP/metadata/wikiart_metadata.pkl", "rb") as f:
    wikiMetadataImages = pickle.load(f)

semArtIndexImages = faiss.read_index("./embeddingsCLIP/index/semart_index.faiss")
with open("./embeddingsCLIP/metadata/semart_metadata.pkl", "rb") as f:
    semArtMetadataImages = pickle.load(f)

museumIndexImages = faiss.read_index("./embeddingsCLIP/index/museum_index.faiss")
with open("./embeddingsCLIP/metadata/museum_metadata.pkl", "rb") as f:
    museumMetadataImages = pickle.load(f)
print("FAISS index and metadata loaded successfully!")

EXTERNAL_IP = os.getenv("EXTERNAL_IP", "localhost")

def get_gte_embedding(text):
    embedding = embedding_model.encode([text], convert_to_numpy=True)
    embedding = embedding / np.linalg.norm(embedding, axis=1, keepdims=True)  # Normalize
    return embedding.astype("float32")
    
def get_top_k_images_from_text(text, dataset, k=3):
    query_embedding = get_gte_embedding(text)

    indexImages = wikiIndexImages if dataset == 'Wiki' else semArtIndexImages if dataset == 'SemArt' else museumIndexImages
    metadataImages = wikiMetadataImages if dataset == 'Wiki' else semArtMetadataImages if dataset == 'SemArt' else museumMetadataImages

    _, indices = indexImages.search(query_embedding, k)
    images = []
    for idx in indices[0]:
        if idx < len(metadataImages):
            image_name = metadataImages.iloc[idx]['filename']
            images.append(f"http://{EXTERNAL_IP}:5001/static/archive/{image_name}")
    return images


@router.post("/search-images")
async def search_images(body: dict, db=Depends(get_db)):
    text = correct_grammer_and_translate(body["story"], body["language"])
    listArt = get_top_k_images_from_text(text, body["dataset"])

    return {"images": listArt}

@router.post("/select-images-per-section")
async def select_images_per_section(body: dict, db=Depends(get_db)):
    story = correct_grammer_and_translate(body["story"], body["language"])

    # Simple splitting by sentence ends (., !, ?)
    sections = [s.strip() for s in re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s', story) if s.strip()]
    results = []

    for section in sections:
        section_images = get_top_k_images_from_text(section, body["dataset"])
        results.append({"section": section, "images": section_images})

    return {"sections": results}

@router.post("/generate-story")
async def generate_story(body: dict):
    image_url = body.get("imageUrl")
    logger.info(f"Received generate-story request with imageUrl: {image_url}")

    # if not image_url:
    #     raise HTTPException(status_code=400, detail="Missing imageUrl in request body")

    # # Extract local image path
    # local_path = image_url.replace("http://localhost:5001/", "./")

    # if not os.path.exists(local_path):
    #     raise HTTPException(status_code=404, detail="Image not found on the server")

    # # Load the image
    # image = Image.open(local_path).convert("RGB")

    # # Generate story prompt
    # prompt = "Imagine a magical story based on this image. Describe the setting, characters, and an interesting event."

    # # Prepare input for the model
    # inputs = processor(images=image, text=prompt, return_tensors="pt").to("cuda" if torch.cuda.is_available() else "cpu")

    # # Generate the story
    # with torch.no_grad():
    #     outputs = model.generate(**inputs, max_length=200)

    # story = processor.batch_decode(outputs, skip_special_tokens=True)[0]
    # story = story.replace("Imagine a magical story based on this image. Describe the setting, characters, and an interesting event. ", "")
    story = 'blablabla'

    return {"text": story}