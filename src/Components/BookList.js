import React, { useEffect, useState } from "react";
import axios from "../apibk";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import UpdateBook from "./UpdateBook";

function BookList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookToUpdate, setBookToUpdate] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Track rows per page

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.getBooks();
      const bookData = response.data || [];
      setBooks(bookData);
      setFilteredBooks(bookData);
    } catch (error) {
      console.error("Error fetching books:", error.response || error.message);
      setFilteredBooks([]);
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter(
        (book) =>
          book.name.toLowerCase().includes(value) ||
          book.author.toLowerCase().includes(value)
      );
      setFilteredBooks(filtered);
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
        alert("Book deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting book:", error.response || error.message);
      alert("Error deleting the book.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
  };

  const columns = [
    {
      name: "Sr.No.",
      selector: (_, index) => (currentPage - 1) * rowsPerPage + (index + 1),
      width: "80px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Author",
      selector: (row) => row.author,
      sortable: true,
    },
    {
      name: "Publication",
      selector: (row) => row.publication,
      sortable: true,
    },
    {
      name: "Price",
      selector: (row) => `$${row.price}`,
      sortable: true,
    },
    {
      name: "Genre",
      selector: (row) => row.genre,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <FaEdit
            style={{ cursor: "pointer", marginRight: "10px", color: "green" }}
            title="Update Book"
            onClick={() => handleUpdate(row)}
          />
          <FaTrash
            style={{ cursor: "pointer", color: "red" }}
            title="Delete Book"
            onClick={() => handleDelete(row.bid)}
          />
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Book List</h2>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name or author"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "10px",
            width: "60%",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
      </div>

      <div>
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

      <DataTable
        columns={columns}
        data={filteredBooks}
        pagination
        paginationPerPage={rowsPerPage}
        paginationRowsPerPageOptions={[5, 10, 15, 20]}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleRowsPerPageChange}
        highlightOnHover
        fixedHeader
        fixedHeaderScrollHeight="400px"
        noDataComponent={<div className="no-data">No books found!</div>}
        customStyles={{
          rows: {
            style: {
              minHeight: "50px",
            },
          },
          headCells: {
            style: {
              backgroundColor: '#3f51b5',
              color: 'black',
              fontWeight: 'bold',
              fontSize: '16px',
              textAlign: 'center',
              borderRight: '1px solid',
            },
          },
          cells: {
            style: {
              color: 'black',
              fontSize: '14px',
              textAlign: 'center',
              borderRight: '1px solid',
            },
          },
          pagination: {
            style: {
              color: 'black',
              padding: '10px',
            },
          },
        }}
      />

      <style jsx>{`
        .no-data {
          text-align: center;
          font-size: 18px;
          color: red;
          margin: 20px 0;
        }

        .pagination-button {
          background-color: #007bff;
          color: black;
          border: none;
          border-radius: 5px;
          padding: 5px 10px;
          margin: 0 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .pagination-button:hover {
          background-color: #0056b3;
        }

        .pagination-button-active {
          background-color: #28a745;
          color: #ffffff;
          font-weight: bold;
        }

        .pagination-container {
          background-color: #007BFF;
          border-top: 1px solid #ddd;
          padding: 10px;
        }

        .table-header {
          background-color: #3f51b5;
          color: #ffffff;
          font-weight: bold;
          font-size: 16px;
          text-align: center;
        }

        .react-data-table-component {
          overflow-x: hidden !important;
        }

        .react-data-table-component .rdt_Table {
          width: 100% !important;
          table-layout: auto !important;
          overflow: hidden !important;
        }

        .table-row {
          background-color: #007BFF;
          color: #212529;
          font-size: 14px;
          text-align: center;
        }

        .table-row:hover {
          background-color: #e9ecef;
        }

        /* Add vertical lines between columns */
        .rdt_Table .rdt_TableHeader {
          border-right: 1px solid #ddd;
        }

        .rdt_Table .rdt_TableBody .rdt_TableRow td {
          border-right: 1px solid #ddd;
        }

        .rdt_Table .rdt_TableBody .rdt_TableRow td:last-child,
        .rdt_Table .rdt_TableHeader th:last-child {
          border-right: none; /* Remove the right border from the last column */
        }

        .rdt_Table {
          width: 100%;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default BookList;
