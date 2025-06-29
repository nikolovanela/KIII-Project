from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from database import collection
from models import BookModel
from crud import create_book, read_book, update_book, delete_book, list_books

app = FastAPI()

origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Book Review API is running"}

@app.get("/books", response_model=List[BookModel])
async def get_books():
    return list_books(collection)

@app.post("/books", response_model=BookModel)
async def add_book(book: BookModel):
    created = create_book(collection, book)
    if created is None:
        raise HTTPException(status_code=400, detail="Book with this ISBN already exists")
    return created

@app.get("/books/{isbn}", response_model=BookModel)
async def get_book(isbn: str):
    book = read_book(collection, isbn)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.put("/books/{isbn}", response_model=BookModel)
async def edit_book(isbn: str, book: BookModel):
    if isbn != book.isbn:
        raise HTTPException(status_code=400, detail="ISBN in path and body must match")
    updated = update_book(collection, book)
    if updated is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated

@app.delete("/books/{isbn}", response_model=BookModel)
async def remove_book(isbn: str):
    deleted = delete_book(collection, isbn)
    if deleted is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return deleted
