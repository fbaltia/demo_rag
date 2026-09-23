from pathlib import Path
from tempfile import NamedTemporaryFile

from fastapi import APIRouter, File, HTTPException, UploadFile

from pdf import slice_pdf
from rag import train


router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)) -> dict:
	if file.content_type != "application/pdf":
		raise HTTPException(status_code=400, detail="Le fichier doit être un PDF.")

	pdf_content = await file.read()

	with NamedTemporaryFile(suffix=".pdf", delete=False) as temporary_file:
		temporary_file.write(pdf_content)
		temporary_path = Path(temporary_file.name)

	try:
		chunks = slice_pdf(str(temporary_path))
		train(chunks)
	finally:
		temporary_path.unlink(missing_ok=True)

	return {
		"message": "Document indexé",
		"chunks": len(chunks),
	}
