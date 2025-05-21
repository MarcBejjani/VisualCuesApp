from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from routes import get_db, correct_grammer_and_translate
import open_clip
import faiss
import pickle
import torch
import numpy as np
from transformers import AutoProcessor, AutoModelForCausalLM
from PIL import Image
from io import BytesIO
import logging
import re
import os

router = APIRouter()
logger = logging.getLogger(__name__)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# MODEL_NAME = "Qwen/Qwen-VL-Chat"
# processor = AutoProcessor.from_pretrained(MODEL_NAME, trust_remote_code=True)
# model = AutoModelForCausalLM.from_pretrained(MODEL_NAME, trust_remote_code=True).to("cuda" if torch.cuda.is_available() else "cpu")

# Load the model **once** at startup
print("Loading CLIP model...")
clip_model, _, _ = open_clip.create_model_and_transforms("ViT-L-14-quickgelu", pretrained="openai")
clip_tokenizer = open_clip.get_tokenizer("ViT-L-14-quickgelu")
print("CLIP model loaded successfully!")

# Load FAISS index and metadata once
print("Loading FAISS index and metadata...")
indexImages = faiss.read_index("./embeddingsCLIP/index/faiss_index_images.bin")
with open("./embeddingsCLIP/metadata/metadata_images.pkl", "rb") as f:
    metadataImages = pickle.load(f)
print("FAISS index and metadata loaded successfully!")

EXTERNAL_IP = os.getenv("EXTERNAL_IP", "localhost")

def get_clip_embedding(text):
    with torch.no_grad():
        text_tokens = clip_tokenizer(text)
        text_features = clip_model.encode_text(text_tokens)
        text_features = text_features.numpy()
        # Normalize to unit length
        text_features = text_features / np.linalg.norm(text_features, axis=1, keepdims=True)
        return text_features
    
def get_top_k_images_from_text(text, k=3):
    query_embedding = get_clip_embedding(text)
    _, indices = indexImages.search(query_embedding, k)
    images = []
    for idx in indices[0]:
        if idx < len(metadataImages):
            image_name = metadataImages[idx][:-4]
            print(image_name)
            images.append(f"http://{EXTERNAL_IP}:5001/static/archive/{image_name}.jpg")
    return images


@router.post("/search-images")
async def search_images(body: dict, db=Depends(get_db)):
    text = correct_grammer_and_translate(body["story"], body["language"])
    listArt = get_top_k_images_from_text(text)

    return {"images": listArt}

@router.post("/select-images-per-section")
async def select_images_per_section(body: dict, db=Depends(get_db)):
    story = correct_grammer_and_translate(body["story"], body["language"])

    # Simple splitting by sentence ends (., !, ?)
    sections = [s.strip() for s in re.split(r'(?<!\w\.\w.)(?<![A-Z][a-z]\.)(?<=\.|\?|!)\s', story) if s.strip()]
    results = []

    for section in sections:
        section_images = get_top_k_images_from_text(section)
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