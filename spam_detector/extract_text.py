import os
import pdfplumber
from docx import Document

# ==========================================
# TXT Reader
# ==========================================

def read_txt(file_path):

    try:

        with open(file_path, "r", encoding="utf-8") as file:

            return file.read()

    except:

        with open(file_path, "r", encoding="latin-1") as file:

            return file.read()


# ==========================================
# PDF Reader
# ==========================================

def read_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:

                text += page_text + "\n"

    return text


# ==========================================
# DOCX Reader
# ==========================================

def read_docx(file_path):

    document = Document(file_path)

    text = ""

    for paragraph in document.paragraphs:

        text += paragraph.text + "\n"

    return text


# ==========================================
# Main Function
# ==========================================

def extract_text(file_path):

    extension = os.path.splitext(file_path)[1].lower()

    if extension == ".txt":

        return read_txt(file_path)

    elif extension == ".pdf":

        return read_pdf(file_path)

    elif extension == ".docx":

        return read_docx(file_path)

    else:

        raise Exception("Unsupported File Format")