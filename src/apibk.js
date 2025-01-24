import axios from "axios";
const apibk = axios.create({
  baseURL: "http://localhost:9090", // Your backend API base URL
});

export default {
  saveBook: (book) => apibk.post("/save", book),
  getBooks: () => apibk.get("/view"),
  deleteBook: (id) => apibk.delete(`/delete/${id}`),
  searchBook: (name) => apibk.get(`/searchbk/${name}`),
  updateBook: (book) => apibk.put("/updatebk", book),
  
  // Get Book Count
  getBookCount: () => apibk.get("/count")
};
