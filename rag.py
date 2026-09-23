import hashlib
import uuid

import ollama
from chromadb import PersistentClient
from sentence_transformers import SentenceTransformer


transformer = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
db = PersistentClient(path="./chromadb")

def train(chunks):
    collection = db.get_or_create_collection("sentences")

    for chunk in chunks:
        vector = transformer.encode(chunk).tolist()
        collection.add(
            ids=[str(uuid.uuid4())],
            embeddings=[vector],
            metadatas=[{"chunk": chunk}],
        )



def search(texte: str, n_results: int = 3) -> dict:
    vector = transformer.encode(texte).tolist()
    collection = db.get_collection("sentences")
    return collection.query(query_embeddings=[vector], n_results=n_results)


def ask_llm(question: str, resultats: dict) -> str:
    chunks = [
        metadata["chunk"]
        for metadata_group in resultats["metadatas"]
        for metadata in metadata_group
    ]
    contexte = "\n\n".join(chunks)
    prompt = f"""Tu réponds uniquement à partir des informations suivantes.

Contexte :
{contexte}

Question :
{question}
"""

    response = ollama.chat(
        model="mistral:latest",
        messages=[{"role": "user", "content": prompt}],
    )
    return response["message"]["content"]