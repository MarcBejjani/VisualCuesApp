from fastapi import Depends
import database

def get_db():
    return database.db