const express = require("express");
const mysql = require('mysql2');
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(cors())
app.use(express.json()) 

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: "localhost", // Database host
    user: "root",      // Database username
    password: "Test@123", // Database password
    database: "logindb" // Name of the database
});

app.get("/test", (req, res) => {
    return res.json("From backend side");
});

// Define a route to fetch all items from the 'items' table
app.get('/items', (req, res) => {
    const sql = "select * from test"; // SQL query to select all items
    db.query(sql, (err, data) => { // Execute the SQL query
        if (err) return res.json(err); // If there's an error, return the error
        return res.json(data); // Otherwise, return the data as JSON
    })
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});


const createUser = (name, email, hashedPassword) => {
    const sql = "INSERT INTO users (name, email, password) values (?)";
    const values = [name, email, hashedPassword];
    console.log("Inside Insert");
   db.query(sql, [values], (err,data) => {
    if (err) {
        throw err
    }else if (data) {
        return name;
    }
   }
,   );
  return name;
};

const findUserByEmail = async(email) => {
    const result = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]); 
    return result;
};



// const { createUser, findUserByEmail } = require("../models/userModel");

app.post("/register", async(req,res) => {
     console.log(req.body.password);
    const { name, email, password} = req.body;    
    try {
      const existingUser =  await findUserByEmail(email);    
      console.log("Inside register 1");
      console.log(existingUser);
     if (existingUser.length>0 && existingUser[0].length>0) return res.status(400).json({ msg: "User already exists" });
     else {
      console.log(password.toString());
      const hashedPassword =  bcrypt.hashSync(password.toString(), 2);
      console.log(hashedPassword);
      const user =  createUser(name, email, hashedPassword);
      console.log("After Insert");  
      res.status(201).json(user);
     }
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server error" });
    }
});


app.post("/login", async(req, res) => {
    console.log("Inside Login");
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (user.length<=0 || user[0].length<=0) return res.status(400).json({ msg: "Invalid credentials" });

    console.log(user[0][0]);
    console.log(user[0][0].email);
    const isMatch = bcrypt.compare(password.toString(), user[0][0].password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user[0][0].email }, 'secret', { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});




// const express = require("express");
// const { register, login } = require("../controllers/authController");
const router = express.Router();

module.exports = router;

require('dotenv').config();
console.log(process.env.MY_VARIABLE);





