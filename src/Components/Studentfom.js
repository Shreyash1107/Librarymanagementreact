import React, { useState, useEffect } from "react";
import apibk from "../apibk"; 
import apistudent from "../apistudent";
import DataTable from "react-data-table-component";
import UpdateStudent from "./UpdateStudent";
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
  const [studentToUpdate, setStudentToUpdate] = useState(null);
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    contact: "",
    dept: "",
    bid: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await apibk.getBooks();
        setBooks(response.data);
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
  const handleEdit = (student) => {
    setStudentToUpdate(student);
  };
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
    const phoneRegex = /^[0-9]{10}$/; // Adjust the regex as needed
    if (!phoneRegex.test(contact)) return "Please enter a valid 10-digit phone number.";
    return "";
  };
  const validateDept = (dept) => {
    if (!dept.trim()) return "Department is required.";
    return "";
  };
  const validateBid = (bid) => {
    if (!bid) return "Please select a book.";
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleRowsPerPageChange = (event) => {
    const value = event.target ? event.target.value : 5; // Default to 5 if undefined
    setPerPage(Number(value));
    setCurrentPage(1); // Reset to the first page when rows per page is changed
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
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const columns = [
    {
      name: "Sr.No.",
      selector: (row, index) => {
        const serialNo = (currentPage - 1) * perPage + index + 1;
        return serialNo; // Display sequential number based on page
      },
      sortable: true,
      maxWidth: '5px',
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      minWidth: '150px',
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      minWidth: '220px',
      style: {
        textAlign: "center", // Center-align content
      },
    },
    {
      name: "Contact",
      selector: (row) => row.contact,
      sortable: true,
      minWidth: '150px',
      style: {
        textAlign: "center", // Center-align content
      },
    },
    {
      name: "Department",
      selector: (row) => row.dept,
      sortable: true,
      minWidth: '150px',
      style: {
        textAlign: "center", // Center-align content
      },
    },
    {
      name: "Book",
      selector: (row) => row.book?.bid || "N/A",
      sortable: true,
      style: {
        textAlign: "center", // Center-align content
      },
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <button
          className="edit-button"
          onClick={() => handleEdit(row)}
          title="Edit"
        >
          <i className="fas fa-edit"></i>
        </button>
      ),
    },
  ];
  const indexOfLastStudent = currentPage * perPage;
  const indexOfFirstStudent = indexOfLastStudent - perPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
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
          .edit-button {
            padding: 5px 10px;
            background-color:blue;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
          .search-input {
            margin-bottom: 20px;
            padding: 10px;
            font-size: 16px;
            width: 100%;
            border-radius: 4px;
            border: 1px solid #ccc;
            transition: border-color 0.3s ease;
          }
          .per-page-select {
            margin-bottom: 20px;
            padding: 10px;
            font-size: 16px;
            width: 100px;
            border-radius: 4px;
            border: 1px solid #ccc;
          }
        `}
      </style>
      {studentToUpdate && (
  <UpdateStudent
    studentToUpdate={studentToUpdate}
    onUpdateSuccess={() => {
      setStudentToUpdate(null);
      apistudent.getStudents().then(data => setStudents(data));
    }}
    onCancel={() => setStudentToUpdate(null)}
  />
)}
      <div className="student-container">
        <h2>Student Management</h2>
        <form className="student-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="student-input"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
          />
          {errors.name && <p className="error">{errors.name}</p>}
          <input
            type="email"
            name="email"
            className="student-input"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
          />
          {errors.email && <p className="error">{errors.email}</p>}
          <input
            type="text"
            name="contact"
            className="student-input"
            placeholder="Contact"
            value={formData.contact}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
          />
          {errors.contact && <p className="error">{errors.contact}</p>}
          <input
            type="text"
            name="dept"
            className="student-input"
            placeholder="Department"
            value={formData.dept}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
          />
          {errors.dept && <p className="error">{errors.dept}</p>}
          <select
            name="bid"
            className="student-input"
            value={formData.bid}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
          >
            <option value="">Select Book</option>
            {books.map((book) => (
              <option key={book.bid} value={book.bid}>
                {book.bid}
              </option>
            ))}
          </select>
          {errors.bid && <p className="error">{errors.bid}</p>}
          <button type="submit" className="submit-button">
            {editId ? "Update Student" : "Add Student"}
          </button>
        </form>
        <input
          type="text"
          className="search-input"
          placeholder="Search students..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select
          className="per-page-select"
          value={perPage}
          onChange={handleRowsPerPageChange}
        >
          <option value={5}>5 rows</option>
          <option value={10}>10 rows</option>
          <option value={15}>15 rows</option>
        </select>
        <DataTable
          title="Student List"
          columns={columns}
          data={currentStudents}
          pagination
          paginationServer
          paginationRowsPerPageOptions={[5, 10, 15, 20]}
          paginationTotalRows={filteredStudents.length}
          onChangePage={(page) => setCurrentPage(page)}
          onChangeRowsPerPage={handleRowsPerPageChange}
          paginationPerPage={perPage}
          customStyles={{
            rows: {
              style: {
                minHeight: "50px",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              },
            },
            headCells: {
              style: {
                backgroundColor: '#3f51b5',
                color: 'black',
                fontWeight: 'bold',
                fontSize: '16px',
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
                borderRight: '1px solid',
              },
            },
            cells: {
              style: {
                color: 'black',
                fontSize: '14px',
                textAlign: 'center',
                justifyContent: 'center',
                display: 'flex',
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
      </div>
    </div>
  );
};
export default StudentForm;