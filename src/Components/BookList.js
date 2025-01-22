import React, { useEffect, useState } from "react";
import axios from "../apibk";
import { FaEdit, FaTrash } from "react-icons/fa";

import UpdateBook from "./UpdateBook";

function BookList() {
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [bookToUpdate, setBookToUpdate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.getBooks();
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error.response || error.message);
      }
    };

    fetchBooks();
  }, []);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = books.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(books.length / recordsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleUpdate = (book) => {
    setBookToUpdate(book);
    setIsAdding(false);
  };

  const handleAddNewBook = () => {
    setBookToUpdate(null);
    setIsAdding(true);
  };

  const handleCancelUpdate = () => {
    setBookToUpdate(null);
    setIsAdding(false);
  };

  const handleDelete = async (bookId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this book?");
      if (confirm) {
        await axios.deleteBook(bookId);
        setBooks(books.filter((book) => book.bid !== bookId));
        alert("Book deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting book:", error.response || error.message);
      alert("Error deleting the book.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Book List</h2>

      <div style={styles.formContainer}>
        {bookToUpdate && !isAdding ? (
          <UpdateBook
            bookToUpdate={bookToUpdate}
            onUpdateSuccess={() => {
              setBookToUpdate(null);
              setIsAdding(false);
              setBooks([...books]);
            }}
            onCancel={handleCancelUpdate}
          />
        ) : null}
      </div>

      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Sr. No.</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Author</th>
            <th style={styles.th}>Publication</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Genre</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((book, index) => (
            <tr key={book.bid} style={styles.row}>
              <td style={styles.td}>{index + indexOfFirstRecord + 1}</td>
              <td style={styles.td}>{book.name}</td>
              <td style={styles.td}>{book.author}</td>
              <td style={styles.td}>{book.publication}</td>
              <td style={styles.td}>{book.price}</td>
              <td style={styles.td}>{book.genre}</td>
              <td style={styles.td}>
                <FaEdit
                  style={{ cursor: "pointer", marginRight: "10px", color: "green" }}
                  title="Update Book"
                  onClick={() => handleUpdate(book)}
                />
                <FaTrash
                  style={{ cursor: "pointer", color: "red" }}
                  title="Delete Book"
                  onClick={() => handleDelete(book.bid)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={styles.pagination}>
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} style={styles.pageButton}>
          {"<<"}
        </button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} style={styles.pageButton}>
          {"<"}
        </button>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} style={styles.pageButton}>
          {">"}
        </button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} style={styles.pageButton}>
          {">>"}
        </button>
        <span style={styles.pageInfo}>
          Page <strong>{currentPage} of {totalPages}</strong>
        </span>
      </div>
    </div>
  );
}

const styles = {
  container: {
    margin: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#333",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    textAlign: "center",
  },
  thead: {
    backgroundColor: "blue",
    color: "#fff",
  },
  th: {
    padding: "15px",
    fontWeight: "bold",
    minWidth:"70px"
  },
  row: {
    backgroundColor: "#f9f9f9",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    marginTop: "20px",
  },
  pageButton: {
    padding: "10px",
    margin: "0 5px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    backgroundColor: "#003366", // Same dark blue as header
    color: "#ffffff",           // White text for buttons
    cursor: "pointer",
  },
  pageInfo: {
    marginLeft: "10px",
    fontSize: "16px",
  },
};

export default BookList;
