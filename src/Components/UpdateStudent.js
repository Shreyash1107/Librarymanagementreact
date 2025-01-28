import React, { useState, useEffect } from "react";
import apistudent from "../apistudent";

function UpdateStudent({ studentToUpdate, onUpdateSuccess, onCancel }) {
  const [student, setStudent] = useState({
    name: "",
    email: "",
    contact: "",
    dept: "",
    bid: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    dept: "",
    bid: "",
  });

  useEffect(() => {
    if (studentToUpdate) {
      setStudent({
        ...studentToUpdate,
        bid: studentToUpdate.book?.bid || "",
      });
    }
  }, [studentToUpdate]);

  const validateName = (name) => {
    if (!name.trim()) return "Name is required.";
    if (!/^[A-Za-z\s]+$/.test(name)) return "Name must contain only letters and spaces.";
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required.";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const validateContact = (contact) => {
    if (!contact.trim()) return "Contact is required.";
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(contact)) return "Please enter a valid 10-digit phone number.";
    return "";
  };

  const validateDept = (dept) => {
    if (!dept.trim()) return "Department is required.";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
    
    // Validate field on change
    let errorMsg = "";
    switch (name) {
      case "name":
        errorMsg = validateName(value);
        break;
      case "email":
        errorMsg = validateEmail(value);
        break;
      case "contact":
        errorMsg = validateContact(value);
        break;
      case "dept":
        errorMsg = validateDept(value);
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields before submission
    const formErrors = {
      name: validateName(student.name),
      email: validateEmail(student.email),
      contact: validateContact(student.contact),
      dept: validateDept(student.dept),
    };

    setErrors(formErrors);

    // Check if there are any errors
    if (Object.values(formErrors).every(error => error === "")) {
      try {
        await apistudent.updateStudent({
          id: studentToUpdate.id,
          ...student
        });
        alert("Student updated successfully!");
        onUpdateSuccess();
      } catch (error) {
        alert("Error updating student. Please try again.");
        console.error("Error details:", error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={student.name}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}
      </div>

      <div style={styles.inputGroup}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={student.email}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.email && <span style={styles.error}>{errors.email}</span>}
      </div>

      <div style={styles.inputGroup}>
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={student.contact}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.contact && <span style={styles.error}>{errors.contact}</span>}
      </div>

      <div style={styles.inputGroup}>
        <input
          type="text"
          name="dept"
          placeholder="Department"
          value={student.dept}
          onChange={handleChange}
          style={styles.input}
        />
        {errors.dept && <span style={styles.error}>{errors.dept}</span>}
      </div>

      <div style={styles.inputGroup}>
        <input
          type="text"
          name="bid"
          placeholder="Book ID"
          value={student.bid}
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.button}>
          Update Student
        </button>
        <button
          type="button"
          style={{ ...styles.button, backgroundColor: "#dc3545" }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
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
    maxWidth: "600px",
    margin: "0 auto",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
  },
  error: {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "5px",
    display: "block",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "20px",
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
};

export default UpdateStudent;