from fastapi import APIRouter, Depends
from routes import get_db

router = APIRouter()

@router.post("/search-images")
async def search_images(story: dict, db = Depends(get_db)):
    images = [
        "http://localhost:5001/static/sample_images/antoine-blanchard_place-de-la-concorde.jpg",
        "http://localhost:5001/static/sample_images/childe-hassam_white-church-at-newport-aka-church-in-a-new-england-village.jpg",
        "http://localhost:5001/static/sample_images/ipolit-strambu_woman-with-umbrella.jpg",
    ]
    return {"images": images}

@router.post("/generate-story")
async def generate_story(image_url: dict, db = Depends(get_db)):
    text = f"You selected the image at {image_url['imageUrl']}."
    return {"text": text}

@router.post("/select-images")
async def select_images(story: dict, db = Depends(get_db)):
    images = [
        "http://localhost:5001/static/sample_images/antoine-blanchard_place-de-la-concorde.jpg",
        "http://localhost:5001/static/sample_images/childe-hassam_white-church-at-newport-aka-church-in-a-new-england-village.jpg",
        "http://localhost:5001/static/sample_images/ipolit-strambu_woman-with-umbrella.jpg",
    ]
    return {"images": images}