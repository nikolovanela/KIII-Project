from pydantic import BaseModel, Field

class BookModel(BaseModel):
    isbn: str = Field(...)
    title: str = Field(...)
    author: str = Field(...)
    publication_year: int = Field(...)
    genre: str = Field(...)
    price: float = Field(...)

    class Config:
        schema_extra = {
            "example": {
                "isbn": "978-3-16-148410-0",
                "title": "Example Book",
                "author": "John Doe",
                "publication_year": 2023,
                "genre": "Fiction",
                "price": 19.99
            }
        }
