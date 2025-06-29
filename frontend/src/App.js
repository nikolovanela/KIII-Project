import React, { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [book, setBook] = useState({
    isbn: '',
    title: '',
    author: '',
    year: '',
    genre: '',
    price: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.error("Error fetching books:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookToSend = {
      isbn: book.isbn,
      title: book.title,
      author: book.author,
      publication_year: parseInt(book.year),
      genre: book.genre,
      price: parseFloat(book.price)
    };

    if (editingIndex !== null) {

    } else {
      try {
        const res = await fetch("http://localhost:8000/books", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookToSend)
        });

        if (!res.ok) throw new Error("Failed to add book");

        const data = await res.json();
        setBooks(prev => [...prev, data]);
      } catch (err) {
        console.error(err);
        alert("Грешка при додавање на книга");
      }
    }

    setBook({ isbn: '', title: '', author: '', year: '', genre: '', price: '' });
    setEditingIndex(null);
  };

  const handleDelete = (index) => {
    const filteredBooks = books.filter((_, i) => i !== index);
    setBooks(filteredBooks);
    if (editingIndex === index) {
      setEditingIndex(null);
      setBook({ isbn: '', title: '', author: '', year: '', genre: '', price: '' });
    }
  };

  const handleEdit = (index) => {
    const b = books[index];
    setBook({
      isbn: b.isbn,
      title: b.title,
      author: b.author,
      year: b.publication_year?.toString() || '',
      genre: b.genre,
      price: b.price?.toString() || ''
    });
    setEditingIndex(index);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Book Review App</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input name="isbn" placeholder="ISBN" value={book.isbn} onChange={handleChange} required style={inputStyle} />
        <input name="title" placeholder="Title" value={book.title} onChange={handleChange} required style={inputStyle} />
        <input name="author" placeholder="Author" value={book.author} onChange={handleChange} required style={inputStyle} />
        <input name="year" type="number" placeholder="Year" value={book.year} onChange={handleChange} required style={inputStyle} />
        <input name="genre" placeholder="Genre" value={book.genre} onChange={handleChange} required style={inputStyle} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={book.price} onChange={handleChange} required style={inputStyle} />
        <button type="submit" style={{
          padding: '10px', width: '100%', backgroundColor: editingIndex !== null ? '#007bff' : '#28a745',
          color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px'
        }}>
          {editingIndex !== null ? 'Save Changes' : 'Add Book'}
        </button>
      </form>

      <h2>Books List</h2>
      {books.length === 0 && <p>No books found.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {books.map((b, index) => (
          <li key={b.isbn} style={listItemStyle}>
            <div>
              <strong>{b.title}</strong> by {b.author} ({b.publication_year}) - {b.genre} - ${b.price}
            </div>
            <div>
              <button onClick={() => handleEdit(index)} style={{ marginRight: 8, cursor: 'pointer' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(index)} style={{ cursor: 'pointer', color: 'red' }}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const inputStyle = {
  width: '100%', marginBottom: 8, padding: 8
};

const listItemStyle = {
  padding: '10px', marginBottom: '8px', border: '1px solid #ccc', borderRadius: '4px',
  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
};

export default App;
