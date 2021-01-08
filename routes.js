const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const database = require('./database');

const app = express();
const port = 8080;

app.use(express.static("frontend/public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.set('views',path.join(__dirname,'frontend/views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.post('/auth', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        connection.query('SELECT * FROM members WHERE email = ? AND password = ?', [email, password], (error, results, fields) => {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.email = email;
                res.redirect('/home');
            } else {
                res.redirect('/');
                res.end();
            }
        });
    } else {
        res.send('Indtast Email / Adgangskode');
        res.end();
    }
});

app.get('/logout',function(req,res){
    req.session.destroy((err) => {
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect('/');
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/frontend/index.html'));
});

app.get('/resetPassword', (req, res) => {
    return res.sendFile(__dirname + '/frontend/resetPassword.html');
});

app.get('/jquery', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(__dirname + '/frontend/jquery.html') 
    } else {
        res.sendFile(__dirname + '/frontend/index.html');
    }
});

app.get('/frontend', (req, res) => {
    if (req.session.loggedin) {
        return res.sendFile(__dirname + '/frontend/frontend.html');
    } else {
        res.sendFile(__dirname + '/frontend/index.html');
    }
});

app.get('/backend', (req, res) => {
    if (req.session.loggedin) {
        return res.sendFile(__dirname + '/frontend/backend.html');
    } else {
        res.sendFile(__dirname + '/frontend/index.html');
    }
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        return res.sendFile(__dirname + '/frontend/home.html');
    } else {
        res.sendFile(__dirname + '/frontend/index.html');
    }
});


app.get('/api', (req, res) => {
    if (req.session.loggedin) {
        res.sendFile(__dirname + '/frontend/api.html') 
    } else {
        res.sendFile(__dirname + '/frontend/index.html');
    }
})


app.listen(port, () => {
    console.log("Server is running on port: ", port)
});


