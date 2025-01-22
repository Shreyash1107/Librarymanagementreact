import React, { useState, useEffect } from "react";
import axios from "../apibk";

function UpdateBook({ bookToUpdate, onUpdateSuccess, onCancel }) {
  const [book, setBook] = useState({
    name: "",
    author: "",
    publication: "",
    price: "",
    genre: "",
  });

  useEffect(() => {
    if (bookToUpdate) {
      setBook(bookToUpdate);
    }
  }, [bookToUpdate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.updateBook(book);
      alert(response.data);
      onUpdateSuccess();
    } catch (error) {
      alert("Error updating book. Please try again.");
      console.error("Error details:", error.response || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        name="name"
        placeholder="Book Name"
        value={book.name}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={book.author}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        type="text"
        name="publication"
        placeholder="Publication"
        value={book.publication}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        type="number"
        name="price"
        placeholder="Price"
        value={book.price}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <input
        type="text"
        name="genre"
        placeholder="Genre"
        value={book.genre}
        onChange={handleChange}
        style={styles.input}
        required
      />
      <button type="submit" style={styles.button}>
        Update Book
      </button>
      <button
        type="button"
        style={{ ...styles.button, backgroundColor: "#dc3545" }}
        onClick={onCancel}
      >
        Cancel
      </button>
    </form>
  );
}

const styles = {
  form: {
    marginBottom: "20px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  input: {
    display: "block",
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    maxWidth: "400px",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "15px",
  },
};

export default UpdateBook;
