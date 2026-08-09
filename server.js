const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(__dirname, 'students.json');

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]');
}

// GET - Ella data eduka
app.get('/api/students', (req, res) => {
  const data = fs.readFileSync(DATA_FILE);
  res.json(JSON.parse(data));
});

// POST - Add / Edit
app.post('/api/students', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const student = req.body;

  if (student.id) {
    // Edit
    const index = data.findIndex(s => s.id === student.id);
    if (index!== -1) data[index] = student;
  } else {
    // Add
    student.id = Date.now();
    data.push(student);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json(student);
});

// DELETE
app.delete('/api/students/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_FILE));
  data = data.filter(s => s.id!= req.params.id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});