import React, { useState } from "react";
import BookForm from "./BookForm";
import BookList from "./BookList";

function Book() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshBooks = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  const styles = {
    container: {
      maxWidth: "1200px",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    heading: {
      textAlign: "center",
      color: "#007bff",
      marginBottom: "20px",
      fontSize: "24px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Book Module</h1>
      <BookForm onAddSuccess={refreshBooks} />
      <BookList key={refreshKey} />
    </div>
  );
}

export default Book;
