const express = require("express");
const app = express();
const port = 3004;
const { Pool } = require("pg");
const path = require("path");

const pool = new Pool({
  user: "postgres",
  host: "127.0.0.1",
  database: "carshop",
  password: "4545",
  port: 5432,
});

app.use(express.json());

app.use(express.static(path.join(__dirname, ".")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/cars", async function (req, res) {
  await pool.query("SELECT * FROM cars", (err, result) => {
    if (err) {
      res.status(500).send("Server Error!");
    } else {
      res.json(result.rows);
    }
  });
});

app.get("/cars/:id", async function (req, res) {
  const id = req.params.id;
  await pool.query("SELECT * FROM cars WHERE id = $1 ", [id], (err, result) => {
    if (err) {
      res.status(500).send("Server Error!");
    } else if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).send("Not Found!");
    }
  });
});

app.post("/cars", async function (req, res) {
  if (!req.body.make || !req.body.model || isNaN(parseInt(req.body.year))) {
    res.status(400).send("Bad Request!");
    return;
  }
  const text = `INSERT INTO cars (make, model, year) VALUES ('${req.body.make}', '${req.body.model}', ${req.body.year} );`;
  await pool.query(text);
  res.status(201).send("Car Added");
});

app.put("/cars/:id", async (req, res) => {
  let id = req.params.id;
  let { make, model, year } = req.body;
  if (isNaN(id)) {
    res.status(400).send("Bad Request!");
  } else {
    const result =
      "UPDATE cars SET make = $1, model = $2, year = $3 WHERE id = $4";
    const values = [make, model, year, id];
    await pool.query(result, values);
    res.status(200).json({ id, make, model, year });
  }
});

app.delete("/cars/:id", async (req, res) => {
  let id = req.params.id;
  await pool.query("DELETE FROM cars WHERE id = $1 ", [id]);
  res.status(200).send("Car Deleted");
});

app.listen(port, function () {
  console.log("Listening on port", port);
});
