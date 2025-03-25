from fastapi import APIRouter, Depends
from routes import get_db
import open_clip
import faiss
import pickle
import torch
import numpy as np

router = APIRouter()

model = None


def get_clip_embedding(model, tokenizer, text):
    with torch.no_grad():
        text_tokens = tokenizer(text)
        text_features = model.encode_text(text_tokens)
        text_features = text_features.numpy()
        # Normalize to unit length
        text_features = text_features / np.linalg.norm(
            text_features, axis=1, keepdims=True
        )
        return text_features


@router.post("/search-images")
async def search_images(body: dict, db=Depends(get_db)):
    model, _, _ = open_clip.create_model_and_transforms(
    "ViT-L-14-quickgelu", pretrained="openai"
    )
    tokenizer = open_clip.get_tokenizer("ViT-L-14-quickgelu")

    indexImages = faiss.read_index("./embeddingsCLIP/index/faiss_index_images.bin")

    with open("./embeddingsCLIP/metadata/metadata_images.pkl", "rb") as f:
        metadataImages = pickle.load(f)

    query_embedding = get_clip_embedding(model, tokenizer, body["story"])
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
    text = f"You selected the image at {image_url['imageUrl']}."
    return {"text": text}


@router.post("/select-images")
async def select_images(body: dict, db=Depends(get_db)):
    model, _, _ = open_clip.create_model_and_transforms(
        "ViT-L-14-quickgelu", pretrained="openai"
    )
    tokenizer = open_clip.get_tokenizer("ViT-L-14-quickgelu")

    indexImages = faiss.read_index("./embeddingsCLIP/index/faiss_index_images.bin")

    with open("./embeddingsCLIP/metadata/metadata_images.pkl", "rb") as f:
        metadataImages = pickle.load(f)

    query_embedding = get_clip_embedding(model, tokenizer, body["story"])
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
