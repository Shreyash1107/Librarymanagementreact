import React, { useState, useEffect } from "react";
import BookList from "./BookList";
import apibk from "../apibk";

function BookForm() {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    publication: "",
    price: "",
    genre: "",
  });

  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apibk.getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apibk.saveBook(formData);
      console.log("Book saved successfully:", response.data);

      setBooks((prevBooks) => [...prevBooks, response.data]);

      setFormData({
        name: "",
        author: "",
        publication: "",
        price: "",
        genre: "",
      });

      alert("Book added successfully!");
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book. Please try again.");
    }
  };

  return (
    <div>
      <style>
        {`
          .book-container {
            width: 80%;
            max-width: 900px;
            margin: 20px auto;
            padding: 20px;
            background: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .form-container {
            margin-bottom: 30px;
          }
          .form-container h2 {
            margin-bottom: 20px;
            font-size: 24px;
            color: #444;
            text-align: center;
          }
          .form-group {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          .form-group label {
            width: 30%;
            font-weight: bold;
            color: #555;
            text-align: right;
            margin-right: 10px;
          }
          .form-group input {
            width: 50%;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
            font-size: 1rem;
          }
          .form-group input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
          }
          .submit-btn {
            display: block;
            width: 40%;
            margin: 0 auto;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .submit-btn:hover {
            background-color: #0056b3;
          }
        `}
      </style>

      <div className="book-container">
        <div className="form-container">
          <h2>Add a New Book</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Book Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="publication">Publication</label>
              <input
                type="text"
                id="publication"
                name="publication"
                value={formData.publication}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              Add Book
            </button>
          </form>
        </div>
        <BookList books={books} />
      </div>
    </div>
  );
}

export default BookForm;
