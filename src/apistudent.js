import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090', // Spring Boot API base URL
  timeout: 1000,
});

// Fetch all students
const getStudents = async () => {
  try {
    const response = await api.get('/viewstud'); // Matches the @GetMapping("/viewstud")
    console.log("Students fetched successfully:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error); // Error handling
    throw new Error("Error fetching students");
  }
};

// Fetch student count
const getStudentCount = async () => {
  try {
    const response = await api.get('/studcount'); // Matches the @GetMapping("/studcount")
    console.log("Student count fetched successfully:", response.data); // Debug log
    return response.data; // Assuming the response contains the count as a number
  } catch (error) {
    console.error("Error fetching student count:", error); // Error handling
    throw new Error("Error fetching student count");
  }
};

// Save a new student
const saveStudent = async (studentData) => {
  try {
    const response = await api.post('/savestud', studentData); // Matches the @PostMapping("/savestud")
    console.log("Student saved:", response.data); // Debug log
    console.log("Submitting data:", studentData);
    return response.data;
  } catch (error) {
    console.error("Error saving student:", error); // Error handling
    throw new Error("Error saving student");
  }
};

// Update an existing student
const updateStudent = async (studentData) => {
  try {
    const response = await api.put(`/updatestudent`, studentData); // Matches the @PutMapping("/updatestudent")
    console.log("Student updated:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error updating student:", error); // Error handling
    throw new Error("Error updating student");
  }
};

// Delete a student
const deleteStudent = async (id) => {
  try {
    const response = await api.delete(`/removestud/${id}`); // Matches the @DeleteMapping("/removestud/{sid}")
    console.log("Student deleted successfully");
    return response.data;
  } catch (error) {
    console.error("Error deleting student:", error); // Error handling
    throw new Error("Error deleting student");
  }
};

export default {
  getStudents,
  getStudentCount,  // Export the new function for getting the student count
  saveStudent,
  updateStudent,
  deleteStudent,
};
