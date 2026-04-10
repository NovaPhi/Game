const express = require('express')
const cors = require('cors')
const mysql = require('mysql2');
const app = express()
const port = 8081

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors())

const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'Z_ATTACK'
    });
    connection.connect((err) => {
        if (err) throw err;
    console.log('Connected to DB');
});

app.post('/Login', (req, res) => {
    const user = req.body.Username;
    const password = req.body.password;
    console.log(user);
    console.log(password);
    
        
        connection.query('SELECT * FROM User WHERE username = ? AND password = ?', [user, password],(err, results, fields)=>{
            if (err) throw err;
            console.log(results);

            if (results.length === 0){
               res.json({success: false});
               console.log('false');
            }else{
                res.json({success: true});
                console.log('true');
            }

        })
    });

app.listen(port, () => {
    console.log('API listening on port ${port}')
});