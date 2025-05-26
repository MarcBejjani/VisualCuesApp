from fastapi import Depends
import database

def get_db():
    return database.db

import language_tool_python
from deep_translator import GoogleTranslator

def grammarCorrector(text, language):
    tool = language_tool_python.LanguageTool(language)
    result = tool.correct(text)
    return result

def translate(text, src_language):
    return GoogleTranslator(source=src_language, target='en').translate(text)

def correct_grammer_and_translate(text, src_language):
    corrected_text = grammarCorrector(text, src_language)
    if src_language != "en":
        corrected_text = translate(corrected_text, src_language)
    
    return corrected_text

import re

def doTextSegmentation(mode, text):
    def get_segments(sentences, size, step):
        if step is None:
            step = 1 if size > 1 else size
        return [
            " ".join(sentences[i:i+size])
            for i in range(0, len(sentences) - size + 1, step)
        ]
    
    pattern = r'(?<=[.!?])\s+(?=\S)'
    sentences = re.split(pattern, text.strip())
    if mode == "conservative":
        return get_segments(sentences, 3, step=2)
    elif mode == "broader":
        return get_segments(sentences, 2, step=1)
    