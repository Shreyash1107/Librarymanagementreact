import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import apibk from "./apibk";
import apistudent from "./apistudent";
import BookForm from "./Components/BookForm";
import StudentForm from "./Components/Studentfom";

function App() {
  const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 30px",
      backgroundColor: "#007bff",
      color: "white",
    },
    navLink: {
      color: "white",
      textDecoration: "none",
      margin: "0 10px",
      fontWeight: "bold",
    },
    navMenu: {
      display: "flex",
      alignItems: "center",
    },
    container: {
      marginTop: "20px",
    },
    cardWrapper: {
      display: "flex",
      justifyContent: "space-around",
      gap: "20px",
      padding: "20px",
    },
    card: {
      flex: "1",
      maxWidth: "400px",
      height: "200px",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    cardBody: {
      textAlign: "center",
    },
    cardTitle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    cardNumber: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      marginTop: "10px",
    },
  };

  const Home = () => {
    const [bookCount, setBookCount] = useState(0);
    const [studentCount, setStudentCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchCounts = async () => {
        try {
          const bookResponse = await apibk.getBookCount();
          const studentResponse = await apistudent.getStudentCount();

          setBookCount(bookResponse.data || 0);
          setStudentCount(
            studentResponse.data !== undefined 
              ? studentResponse.data 
              : (studentResponse !== undefined ? studentResponse : 0)
          );
        } catch (error) {
          console.error("Error fetching counts:", error);
          setBookCount(0);
          setStudentCount(0);
        } finally {
          setLoading(false);
        }
      };

      fetchCounts();
    }, []);

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
      <div style={styles.cardWrapper} className="container">
        <div
          className="card text-white"
          style={{ ...styles.card, backgroundColor: "#007bff" }}
        >
          <div style={styles.cardBody}>
            <h5 style={styles.cardTitle} className="card-title">
              Total Books
            </h5>
            <p className="card-text">Number of books in the library.</p>
            <h2 style={styles.cardNumber}>{bookCount}</h2>
          </div>
        </div>
        <div
          className="card text-white"
          style={{ ...styles.card, backgroundColor: "#28a745" }}
        >
          <div style={styles.cardBody}>
            <h5 style={styles.cardTitle} className="card-title">
              Total Students
            </h5>
            <p className="card-text">Number of students registered.</p>
            <h2 style={styles.cardNumber}>{studentCount}</h2>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <div>
        <header style={styles.navbar}>
          <h1>Library Management System</h1>
          <nav style={styles.navMenu}>
            <Link to="/" style={styles.navLink}>
              Home
            </Link>
            <Link to="/books" style={styles.navLink}>
              Book Module
            </Link>
            <Link to="/students" style={styles.navLink}>
              Student Module
            </Link>
          </nav>
        </header>
        <main style={styles.container}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<BookForm />} />
            <Route path="/students" element={<StudentForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;