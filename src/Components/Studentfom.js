import React, { useState, useEffect } from "react";
import apibk from "../apibk"; // Assuming apibk is the service for books API
import apistudent from "../apistudent"; // Assuming apistudent is the service for student API

const StudentForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    dept: "",
    bid: "", // book id
  });
  const [students, setStudents] = useState([]);
  const [editId, setEditId] = useState(null);
  const [books, setBooks] = useState([]);

  // Fetch books and students
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apibk.getBooks();
        setBooks(response.data); // Assuming response.data is the list of books
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const studentData = await apistudent.getStudents();
        console.log("Fetched Students Data:", studentData); // Check if bid is included
        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };


    fetchBooks();
    fetchStudents();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        // Update student
        await apistudent.updateStudent({ id: editId, ...formData });
        setEditId(null); // Reset edit mode
      } else {
        // Save new student
        await apistudent.saveStudent(formData);
      }

      // Fetch updated students list after save/update
      const studentData = await apistudent.getStudents();

      // Map the data to include bid directly
      const updatedStudents = studentData.map((student) => ({
        ...student,
        bid: student.book.bid, // Extract bid from book object
      }));
      setStudents(updatedStudents); // Update students state with the latest data

      // Clear form after submission
      setFormData({ name: "", email: "", contact: "", dept: "", bid: "" });
    } catch (error) {
      console.error("Error saving/updating student:", error);
    }
  };



  // Handle edit action
  const handleEdit = (student) => {
    setFormData(student);
    setEditId(student.id); // Set the id for editing
  };

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await apistudent.deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id)); // Remove deleted student from state
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <div>
      <style>
        {`
          .student-container {
            margin: 20px auto;
            padding: 20px;
            max-width: 800px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .student-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
          }
          .student-input {
            padding: 10px;
            font-size: 16px;
            border-radius: 4px;
            border: 1px solid #ccc;
            transition: border-color 0.3s ease;
          }
          .student-input:focus {
            outline: none;
            border-color: #007bff;
            box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
          }
          .submit-button {
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 4px;
            border: none;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .submit-button:hover {
            background-color: #0056b3;
          }
          .student-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .student-table th {
            background-color: #007bff;
            color: white;
            padding: 10px;
            text-align: left;
          }
          .student-table td {
            padding: 10px;
            border: 1px solid #ddd;
          }
          .action-buttons {
            display: flex;
            gap: 10px;
          }
          .edit-button {
            padding: 5px 10px;
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .delete-button {
            padding: 5px 10px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}
      </style>

      <div className="student-container">
        <h2>Student Management</h2>
        <form onSubmit={handleSubmit} className="student-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="student-input"
            autoComplete="off"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="student-input"
            autoComplete="off"
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleInputChange}
            required
            className="student-input"
            autoComplete="off"
          />
          <input
            type="text"
            name="dept"
            placeholder="Department"
            value={formData.dept}
            onChange={handleInputChange}
            required
            className="student-input"
            autoComplete="off"
          />
          <select
            name="bid"
            value={formData.bid}
            onChange={handleInputChange}
            required
            className="student-input"
          >
            <option value="">Select Book ID</option>
            {books.map((book) => (
              <option key={book.bid} value={book.bid}>
                {book.bid} {/* Display only the Book ID */}
              </option>
            ))}
          </select>
          <button type="submit" className="submit-button">
            {editId ? "Update" : "Add"} Student
          </button>
        </form>
        <h3>Student List</h3>
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Book ID</th> {/* Display Book ID instead of Book Name */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.sid}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.contact}</td>
                <td>{student.dept}</td>
                <td>{student.bid}</td> {/* Display the bid */}
                <td>
                  <div className="action-buttons">
                    <button onClick={() => handleEdit(student)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(student.sid)} className="delete-button">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>


        </table>
      </div>
    </div>
  );
};
export default StudentForm;