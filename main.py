from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models
from rag import ask_llm, search, train
from pdf import slice_pdf
from routes.ask import router as ask_router
from routes.history import router as history_router
from routes.upload import router as upload_router

train_model = False
number_of_answers = 2
app = FastAPI()
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(ask_router)
app.include_router(history_router)
app.include_router(upload_router)

def main() -> None:
    sliced_pdf = slice_pdf("./pdf/PythonBases.pdf")
    if train_model:
        train(sliced_pdf)
    question = "quelles sont les boucles  ?"
    result = search(question, number_of_answers)
    reponse = ask_llm(question, result)
    print(reponse)


if __name__ == "__main__":
    main()

