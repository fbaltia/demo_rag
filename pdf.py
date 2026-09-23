from pypdf import PdfReader

def slice_pdf(path:str, chunk_size = 500, overlap = 100)->list[str]:

    list_pdf_text = []
    reader = PdfReader(path)
    for page in reader.pages:
        text = page.extract_text()
        if text:
            list_pdf_text.append(text + "\n")

    full_text = ''.join(list_pdf_text)

    step = chunk_size - overlap 

    chunks = []
    for i in range(0, len(full_text), step):
        chunk = full_text[i:i + chunk_size]
        chunks.append(chunk)

    return chunks