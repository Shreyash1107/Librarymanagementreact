import React, { useEffect, useState } from "react";
import axios from "../apibk";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateBook from "./UpdateBook";

function BookList() {
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [bookToUpdate, setBookToUpdate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.getBooks();
      const bookData = response.data || [];
      setBooks(bookData);
      setFilteredBooks(bookData);
      setNoResults(bookData.length === 0);
    } catch (error) {
      console.error("Error fetching books:", error.response || error.message);
      setNoResults(true);
      setFilteredBooks([]);
    }
  };

  const handleSearch = async (event) => {
    const name = event.target.value;
    setSearchTerm(name);

    if (name.trim() === "") {
      setFilteredBooks(books);
      setCurrentPage(1);
      setNoResults(books.length === 0);
    } else {
      try {
        const response = await axios.searchBook(name);
        const searchResults = response.data || [];
        setFilteredBooks(searchResults);
        setNoResults(searchResults.length === 0);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error searching for books:", error.response || error.message);
        setNoResults(true);
        setFilteredBooks([]);
      }
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  // Ensure currentRecords is always an array
  const currentRecords = Array.isArray(filteredBooks)
    ? filteredBooks.slice(indexOfFirstRecord, indexOfLastRecord)
    : [];

  const totalPages = Math.max(1, Math.ceil((filteredBooks?.length || 0) / recordsPerPage));

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleUpdate = (book) => {
    setBookToUpdate(book);
    setIsAdding(false);
  };

  const handleDelete = async (bookId) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this book?");
      if (confirm) {
        await axios.deleteBook(bookId);
        const updatedBooks = books.filter((book) => book.bid !== bookId);
        setBooks(updatedBooks);
        setFilteredBooks(updatedBooks);
        setNoResults(updatedBooks.length === 0);
        setCurrentPage(1);
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

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by book name"
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.container}>
        {bookToUpdate && !isAdding && (
          <UpdateBook
            bookToUpdate={bookToUpdate}
            onUpdateSuccess={() => {
              setBookToUpdate(null);
              setIsAdding(false);
              fetchBooks();
            }}
            onCancel={() => {
              setBookToUpdate(null);
              setIsAdding(false);
            }}
          />
        )}
      </div>

      {noResults ? (
  <div style={styles.noResultsMessage}>
    {searchTerm
      ? `No books found matching "${searchTerm}"`
      : "Book Not Found"}
  </div>
) : (
  <>
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

    {filteredBooks.length > recordsPerPage && (
      <div style={styles.pagination}>
        {[...Array(totalPages)].map((_, pageNumber) => (
          <button
            key={pageNumber + 1}
            onClick={() => handlePageChange(pageNumber + 1)}
            disabled={currentPage === pageNumber + 1}
            style={{
              ...styles.pageButton,
              ...(currentPage === pageNumber + 1 ? styles.activePageButton : {}),
            }}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    )}
  </>
)}

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
  searchContainer: {
    marginBottom: "20px",
    textAlign: "center",
  },
  searchInput: {
    padding: "10px",
    width: "60%",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
    textAlign: "center",
  },
  thead: {
    backgroundColor: "blue",
    color: "grey",
  },
  th: {
    padding: "15px",
    fontWeight: "bold",
    minWidth: "70px",
    backgroundColor: "#007BFF",
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
    backgroundColor: "rgb(140, 182, 227)",
    color: "#ffffff",
    cursor: "pointer",
  },
  activePageButton: {
    backgroundColor: "rgb(6, 17, 29)",
  },
  noResultsMessage: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
    marginTop: "20px",
  },
};
export default BookList;