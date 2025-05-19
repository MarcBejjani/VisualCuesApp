from fastapi import Depends
import database

def get_db():
    return database.db

import language_tool_python
from deep_translator import GoogleTranslator

language_map = {
    'EN': 'en-US',
    'FR': 'fr'
}

def grammarCorrector(text, language):
    tool = language_tool_python.LanguageTool(language_map[language])
    result = tool.correct(text)
    return result

def translate(text, src_language):
    return GoogleTranslator(source=language_map[src_language], target='en').translate(text)

def correct_grammer_and_translate(text, src_language):
    corrected_text = grammarCorrector(text, src_language)
    if src_language != "EN":
        corrected_text = translate(corrected_text, src_language)
    
    return corrected_text