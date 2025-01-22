// import React, { useState, useEffect } from "react";
// import axios from "../apibk"; 
// import { FaTrash } from "react-icons/fa";

// function StudentList() {
//   const [students, setStudents] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(5);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       try {
//         const response = await axios.get("/viewstud");
//         setStudents(response.data);
//       } catch (error) {
//         console.error("Error fetching students:", error);
//       }
//     };

//     fetchStudents();
//   }, []);

//   const indexOfLastRecord = currentPage * recordsPerPage;
//   const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
//   const currentRecords = students.slice(indexOfFirstRecord, indexOfLastRecord);
//   const totalPages = Math.ceil(students.length / recordsPerPage);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber >= 1 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleDelete = async (studentId) => {
//     try {
//       const confirm = window.confirm("Are you sure you want to delete this student?");
//       if (confirm) {
//         await axios.delete(`/removestud/${studentId}`);
//         setStudents(students.filter((student) => student.sid !== studentId));
//         alert("Student deleted successfully!");
//       }
//     } catch (error) {
//       console.error("Error deleting student:", error);
//       alert("Error deleting the student.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <table style={styles.table}>
//         <thead style={styles.thead}>
//           <tr>
//             <th style={styles.th}>Sr. No.</th>
//             <th style={styles.th}>Name</th>
//             <th style={styles.th}>Age</th>
//             <th style={styles.th}>Contact</th>
//             <th style={styles.th}>Email</th>
//             <th style={styles.th}>Department</th>
//             <th style={styles.th}>Book</th>
//             <th style={styles.th}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentRecords.map((student, index) => (
//             <tr key={student.sid}>
//               <td>{index + 1}</td>
//               <td>{student.name}</td>
//               <td>{student.age}</td>
//               <td>{student.contact}</td>
//               <td>{student.email}</td>
//               <td>{student.dept}</td>
//               <td>{student.book?.name}</td>
//               <td>
//                 <button
//                   onClick={() => handleDelete(student.sid)}
//                   style={styles.deleteButton}
//                 >
//                   <FaTrash />
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <div style={styles.pagination}>
//         <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
//           Prev
//         </button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

// const styles = {
//   container: {
//     marginTop: "30px",
//   },
//   table: {
//     width: "100%",
//     borderCollapse: "collapse",
//   },
//   thead: {
//     backgroundColor: "#007bff",
//     color: "white",
//   },
//   th: {
//     padding: "10px",
//     textAlign: "left",
//   },
//   deleteButton: {
//     backgroundColor: "red",
//     color: "white",
//     border: "none",
//     cursor: "pointer",
//     padding: "5px",
//     borderRadius: "5px",
//   },
//   pagination: {
//     marginTop: "20px",
//     textAlign: "center",
//   },
// };

// export default StudentList;
