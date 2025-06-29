from typing import List, Optional
from pymongo.collection import Collection
from models import BookModel

def create_book(collection: Collection, book: BookModel) -> Optional[dict]:
    if collection.find_one({"isbn": book.isbn}):
        return None
    collection.insert_one(book.dict())
    return book.dict()

def read_book(collection: Collection, isbn: str) -> Optional[dict]:
    return collection.find_one({"isbn": isbn}, {"_id": 0})

def update_book(collection: Collection, book: BookModel) -> Optional[dict]:
    update_data = book.dict(exclude_unset=True)
    result = collection.update_one({"isbn": book.isbn}, {"$set": update_data})
    if result.matched_count == 0:
        return None
    return book.dict()

def delete_book(collection: Collection, isbn: str) -> Optional[dict]:
    book = collection.find_one({"isbn": isbn}, {"_id": 0})
    if not book:
        return None
    collection.delete_one({"isbn": isbn})
    return book

def list_books(collection: Collection) -> List[dict]:
    return list(collection.find({}, {"_id": 0}))
