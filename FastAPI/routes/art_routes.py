from fastapi import APIRouter, Depends
from routes import get_db
import open_clip
import faiss
import pickle
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForCausalLM

router = APIRouter()

model_name = "meta-llama/Llama-3.2-3b"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16)

# ✅ Load the model **once** at startup
print("Loading CLIP model...")
clip_model, _, _ = open_clip.create_model_and_transforms("ViT-L-14-quickgelu", pretrained="openai")
clip_tokenizer = open_clip.get_tokenizer("ViT-L-14-quickgelu")
print("CLIP model loaded successfully!")

# ✅ Load FAISS index and metadata once
print("Loading FAISS index and metadata...")
indexImages = faiss.read_index("./embeddingsCLIP/index/faiss_index_images.bin")
with open("./embeddingsCLIP/metadata/metadata_images.pkl", "rb") as f:
    metadataImages = pickle.load(f)
print("FAISS index and metadata loaded successfully!")

def get_clip_embedding(text):
    with torch.no_grad():
        text_tokens = clip_tokenizer(text)
        text_features = clip_model.encode_text(text_tokens)
        text_features = text_features.numpy()
        # Normalize to unit length
        text_features = text_features / np.linalg.norm(text_features, axis=1, keepdims=True)
        return text_features

@router.post("/search-images")
async def search_images(body: dict, db=Depends(get_db)):
    query_embedding = get_clip_embedding(body["story"])
    k = 3
    _, indicesImages = indexImages.search(query_embedding, k)

    listArt = []
    print("\n--- Image results ---")
    for i, idx in enumerate(indicesImages[0]):
        if idx < len(metadataImages):
            image_name = metadataImages[idx][:-4]
            print(image_name)
            listArt.append(f"http://localhost:5001/static/archive/{image_name}.jpg")

    return {"images": listArt}

@router.post("/generate-story")
async def generate_story(image_url: dict, db=Depends(get_db)):
    prompt = f"Write a short, imaginative story inspired by the image at {image_url['imageUrl']}."

    # Tokenize the prompt
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

    # Generate the story
    outputs = model.generate(**inputs, max_length=500)
    story = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return {"text": story}

@router.post("/select-images")
async def select_images(body: dict, db=Depends(get_db)):
    query_embedding = get_clip_embedding(body["story"])
    k = 3
    _, indicesImages = indexImages.search(query_embedding, k)

    listArt = []
    print("\n--- Image results ---")
    for i, idx in enumerate(indicesImages[0]):
        if idx < len(metadataImages):
            image_name = metadataImages[idx][:-4]
            print(image_name)
            listArt.append(f"http://localhost:5001/static/archive/{image_name}.jpg")

    return {"images": listArt}
