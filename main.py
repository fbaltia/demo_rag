from fastapi import FastAPI

from rag import ask_llm, search, train
from pdf import slice_pdf

train_model = False
number_of_answers = 2
app = FastAPI()

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

