const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors');
app.use(cors());


// ===bodyparser===
app.use(express.urlencoded({extended: true})) 
app.use(express.json());

// ===cookieParser===
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.listen(5000,function(){
    console.log('서버를 열었습니다.')
})


const config = require('./config/key')
const { auth } = require('./middleware/auth')

const mongoose = require("mongoose");
const { User } = require('./models/User');
mongoose.connect(config.mongoURI)
.then( ()=>console.log('몽고DB Connected...'))
.catch(err=>console.log('몽고디비 에러',err))



// ------------------------------ user Routes ------------------------------

app.use('/api/user', require('./routes/users'));
app.use('/api/board', require('./routes/board'))


// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

    // Set static folder   
    // All the javascript and css files will be read and served from this folder
    app.use(express.static("client/build"));
  
    // index.html for all page routes    html or routing and naviagtion
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
  }
  
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
  