import express from "express";
const app = express();
const port = 3000;

// Serve static files from 'public'
app.use(express.static("public"));

app.get("/submit", (req, res) => {
  const name = req.query.name;
  const age = req.query.age;
  console.log("Received name:", name);
  console.log("Received age:", age);
  res.send(`Received, ${name}! and you are ${age} Old`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
