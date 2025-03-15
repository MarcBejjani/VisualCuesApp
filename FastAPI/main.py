from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
from routes import art_routes, user_routes
import database #import the database file
import asyncio

load_dotenv()

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust as needed for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")

# Include routers
app.include_router(art_routes.router, prefix="/api", tags=["Art"])
app.include_router(user_routes.router, prefix="/api", tags=["User"])

@app.on_event("startup")
async def startup_event():
    await database.connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect_from_mongo()

@app.get("/")
async def root():
    return {"message": "Welcome to the home page!"}