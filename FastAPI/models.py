from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class User(BaseModel):
    username: str
    email: str
    password: str

class UserInDB(User):
    _id: str
    savedArtSearches: Optional[List[dict]] = []
    savedStoryGenerations: Optional[List[dict]] = []

class Token(BaseModel):
    access_token: str
    token_type: str

class UserLogin(BaseModel):
    username: str
    password: str