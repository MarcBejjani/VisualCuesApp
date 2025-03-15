from fastapi import Depends
import database #import the database file

def get_db():
    return database.db