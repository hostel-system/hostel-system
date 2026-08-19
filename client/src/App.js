import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = () => {
    if(username === "" || password === ""){
      alert("Username and Password podanum Swetha");
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="login-container">
      <h1>Hostel Login</h1>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
}

function HomePage() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // 1. Page load aagumbodhe data eduka
  useEffect(() => {
    axios.get(fetch(`${import.meta.env.VITE_API_URL}/api/students`)).then(res => setStudents(res.data));
  }, []);

  // 2. Add / Update
  const addOrUpdateStudent = () => {
    if(name === "" || room === ""){
      alert("Name and Room podu");
      return;
    }

    axios.post(fetch(`${import.meta.env.VITE_API_URL}/api/students`), {id: editId, name: name, room: room})
   .then(() => {
      axios.get(fetch(`${import.meta.env.VITE_API_URL}/api/students`)).then(res => setStudents(res.data));
      setName(""); setRoom(""); setEditId(null);
    }).catch(err => alert("Server odudha nu paaru"));
  };

  // 3. Delete
  const deleteStudent = (id) => {
    axios.delete(fetch(`${import.meta.env.VITE_API_URL}/api/students`)${id}`)
   .then(() => {
      axios.get(fetch(`${import.meta.env.VITE_API_URL}/api/students`)).then(res => setStudents(res.data));
    });
  };

  // 4. Edit
  const editStudent = (s) => {
    setName(s.name);
    setRoom(s.room);
    setEditId(s.id);
  };

  // 5. Search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.room.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <h1>Swetha's Hostel Management 🔥</h1>
      <Link to="/" className="logout-btn">Logout</Link>

      <div className="form-box">
        <h2>{editId? "Edit Student" : "Add Student"}</h2>
        <input type="text" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Room Number" value={room} onChange={(e) => setRoom(e.target.value)} />
        <button onClick={addOrUpdateStudent}>{editId? "Update" : "Add"}</button>
      </div>

      <div className="list-box">
        <h2>Student List</h2>
        <input
          type="text"
          className="search-box"
          placeholder="🔍 Search by Name or Room"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredStudents.length === 0? <p>No students found</p> :
          filteredStudents.map((s) => (
            <div key={s.id} className="student-row">
              <span><b>{s.name}</b> - Room {s.room}</span>
              <div>
                <button className="btn-edit" onClick={() => editStudent(s)}>Edit</button>
                <button className="btn-delete" onClick={() => deleteStudent(s.id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;