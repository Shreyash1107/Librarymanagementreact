import React, { useState } from "react";

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    dept: "",
    bid: "",
  });
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);

  const books = [
    { id: "1", name: "Introduction to Java" },
    { id: "2", name: "React Essentials" },
    { id: "3", name: "Database Management" },
  ];

  const styles = {
    container: {
      margin: "20px auto",
      padding: "20px",
      maxWidth: "800px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#007bff",
      color: "white",
      cursor: "pointer",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "20px",
    },
    th: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px",
      textAlign: "left",
    },
    td: {
      padding: "10px",
      border: "1px solid #ddd",
    },
    actions: {
      display: "flex",
      gap: "10px",
    },
    editButton: {
      padding: "5px 10px",
      fontSize: "14px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#28a745",
      color: "white",
      cursor: "pointer",
    },
    deleteButton: {
      padding: "5px 10px",
      fontSize: "14px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#dc3545",
      color: "white",
      cursor: "pointer",
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editId) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editId ? { ...student, ...formData } : student
        )
      );
      setEditId(null);
    } else {
      const newStudent = {
        id: Date.now().toString(),
        ...formData,
      };
      setStudents((prev) => [...prev, newStudent]);
    }

    setFormData({ name: "", email: "", contact: "", dept: "", bid: "" });
  };

  const handleEdit = (student) => {
    setFormData(student);
    setEditId(student.id);
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  return (
    <div style={styles.container}>
      <h2>Student Management</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={formData.contact}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="dept"
          placeholder="Department"
          value={formData.dept}
          onChange={handleInputChange}
          required
          style={styles.input}
        />
        <select
          name="bid"
          value={formData.bid}
          onChange={handleInputChange}
          required
          style={styles.input}
        >
          <option value="">Select Book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
        </select>
        <button type="submit" style={styles.button}>
          {editId ? "Update" : "Add"} Student
        </button>
      </form>
      <h3>Student List</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Contact</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Book</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td style={styles.td}>{student.name}</td>
              <td style={styles.td}>{student.email}</td>
              <td style={styles.td}>{student.contact}</td>
              <td style={styles.td}>{student.dept}</td>
              <td style={styles.td}>
                {books.find((book) => book.id === student.bid)?.name}
              </td>
              <td style={styles.td}>
                <div style={styles.actions}>
                  <button
                    onClick={() => handleEdit(student)}
                    style={styles.editButton}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student.id)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentForm;
