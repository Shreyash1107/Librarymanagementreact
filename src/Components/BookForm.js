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

  const [errors, setErrors] = useState({
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

  const validateName = (value) => {
    if (!value.trim()) return "Book name is required.";
    if (value.trim().length < 2) return "Book name must be at least 2 characters long.";
    if (value.trim().length > 100) return "Book name cannot exceed 100 characters.";
    if (!/^[a-zA-Z0-9\s:&'-]+$/.test(value)) return "Book name contains invalid characters.";
    return "";
  };

  const validateAuthor = (value) => {
    if (!value.trim()) return "Author name is required.";
    if (value.trim().length < 2) return "Author name must be at least 2 characters long.";
    if (value.trim().length > 50) return "Author name cannot exceed 50 characters.";
    if (!/^[a-zA-Z\s.'-]+$/.test(value)) {
      return "Author name can only contain letters, spaces, hyphens, dots, and apostrophes.";
    }    
    return "";
  };

  const validatePublication = (value) => {
    if (!value.trim()) return "Publication is required.";
    if (value.trim().length < 2) return "Publication name must be at least 2 characters long.";
    if (value.trim().length > 50) return "Publication name cannot exceed 50 characters.";
    if (!/^[a-zA-Z0-9\s&'-]+$/.test(value)) return "Publication name contains invalid characters.";
    return "";
  };

  const validatePrice = (value) => {
    if (!value.trim()) return "Price is required.";
    const numericPrice = parseFloat(value);
    if (isNaN(numericPrice)) return "Price must be a valid number.";
    if (numericPrice <= 0) return "Price must be greater than zero.";
    if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Price must have up to 2 decimal places.";
    return "";
  };

  const validateGenre = (value) => {
    if (!value.trim()) return "Genre is required.";
    if (value.trim().length < 2) return "Genre must be at least 2 characters long.";
    if (value.trim().length > 30) return "Genre cannot exceed 30 characters.";
    if (!/^[a-zA-Z\s-]+$/.test(value)) return "Genre can only contain letters, spaces, and hyphens.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    let error = "";
    switch (name) {
      case "name": error = validateName(value); break;
      case "author": error = validateAuthor(value); break;
      case "publication": error = validatePublication(value); break;
      case "price": error = validatePrice(value); break;
      case "genre": error = validateGenre(value); break;
      default: break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(formData.name),
      author: validateAuthor(formData.author),
      publication: validatePublication(formData.publication),
      price: validatePrice(formData.price),
      genre: validateGenre(formData.genre)
    };

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please correct the errors in the form.");
      return;
    }

    try {
      const response = await apibk.saveBook(formData);
      console.log("Book saved successfully:", response.data);

      setBooks(prev => [...prev, response.data]);

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
          .error {
            color: red;
            font-size: 0.9rem;
            margin-left: 10px;
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
                autoComplete="off"
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.author && <span className="error">{errors.author}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="publication">Publication</label>
              <input
                type="text"
                id="publication"
                name="publication"
                value={formData.publication}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.publication && <span className="error">{errors.publication}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="price">Price</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                autoComplete="off"
              />
              {errors.price && <span className="error">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="genre">Genre</label>
              <input
                type="text"
                id="genre"
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                autoComplete="off"
              />
              {errors.genre && <span className="error">{errors.genre}</span>}
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