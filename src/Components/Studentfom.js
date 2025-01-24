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
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    dept: "",
    bid: "",
  });
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
        setStudents(studentData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };
    fetchBooks();
    fetchStudents();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const validateName = (name) => {
    const regex = /^[a-zA-Z\s]+$/;
    if (!name) return "Name is required";
    if (!regex.test(name)) return "No special characters except space allowed";
    return "";
  };
  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email) return "Email is required";
    if (!regex.test(email)) return "Invalid email format";
    return "";
  };
  const validateContact = (contact) => {
    const regex = /^[0-9]{10}$/;
    if (!contact) return "Contact is required";
    if (!regex.test(contact)) return "Contact must be 10 digits long and only numbers";
    return "";
  };
  const validateDept = (dept) => {
    const regex = /^[a-zA-Z\s&-]+$/;
    if (!dept) return "Department is required";
    if (!regex.test(dept)) return "Department can have space, &, and - only";
    return "";
  };
  const validateBid = (bid) => {
    if (!bid) return "Book ID is required";
    return "";
  };
  const handleKeyUp = (e) => {
    const { name, value } = e.target;
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
      case "bid":
        errorMsg = validateBid(value);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      contact: validateContact(formData.contact),
      dept: validateDept(formData.dept),
      bid: validateBid(formData.bid),
    };
    setErrors(formErrors);
    if (Object.values(formErrors).every((err) => err === "")) {
      try {
        if (editId) {
          await apistudent.updateStudent({ id: editId, ...formData });
          setEditId(null); // Reset edit mode after update
        } else {
          await apistudent.saveStudent(formData);
        }
        const studentData = await apistudent.getStudents();
        setStudents(studentData);
        setFormData({ name: "", email: "", contact: "", dept: "", bid: "" });
      } catch (error) {
        console.error("Error saving/updating student:", error);
      }
    }
  };
  const handleEdit = (student) => {
    setFormData({
      name: student.name || "",
      email: student.email || "",
      contact: student.contact || "",
      dept: student.dept || "",
      bid: student.book?.bid || "", // Safe navigation to handle potential undefined
    });
    setEditId(student.id);
  };
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
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
          .error {
            color: red;
            font-size: 12px;
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
          .pagination {
            display: flex;
            list-style-type: none;
            gap: 10px;
            justify-content: center;
            margin-top: 20px;
          }
          .pagination li {
            padding: 8px 12px;
            color: white;
            background-color:rgb(40, 110, 185);
            border-radius: 4px;
            cursor: pointer;
          }
          .pagination li:hover {
            background-color: #0056b3;
          }
          .pagination li.active {
            background-color:rgb(6, 17, 29);
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
            onKeyUp={handleKeyUp}
            required
            className="student-input"
            autoComplete="off"
          />
          {errors.name && <div className="error">{errors.name}</div>}
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            required
            className="student-input"
            autoComplete="off"
          />
          {errors.email && <div className="error">{errors.email}</div>}
          <input
            type="text"
            name="contact"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            required
            className="student-input"
            autoComplete="off"
          />
          {errors.contact && <div className="error">{errors.contact}</div>}
          <input
            type="text"
            name="dept"
            placeholder="Department"
            value={formData.dept}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
            required
            className="student-input"
            autoComplete="off"
          />
          {errors.dept && <div className="error">{errors.dept}</div>}
          <select
            name="bid"
            value={formData.bid}
            onChange={handleInputChange}
            required
            className="student-input"
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.bid}
              </option>
            ))}
          </select>
          {errors.bid && <div className="error">{errors.bid}</div>}
          <button type="submit" className="submit-button">
            {editId ? "Update Student" : "Add Student"}
          </button>
        </form>
        <table className="student-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Department</th>
              <th>Book</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.contact}</td>
                <td>{student.dept}</td>
                <td>{student.book.bid}</td>
                <td className="action-buttons">
                  <button className="icon-button edit-button"
                    onClick={() => handleEdit(student)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(students.length / studentsPerPage) }).map((_, index) => (
            <li
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default StudentForm;