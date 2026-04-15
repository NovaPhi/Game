const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express()
const port = 8081

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'Z_ATTACK'
    });
    connection.connect((err) => {
        if (err) throw err;
    //console.log('Connected to DB');
});

app.post('/Login', (req, res) => {
    const user = req.body.Username;
    const password = req.body.password;

    connection.query('SELECT * FROM User WHERE username = ? AND password = ?', [user, password], (err, results) => {
        if (err) throw err;


        

        if (results.length === 0) {
            res.json({ success: false, message: 'User not found' });
            //console.log('false - user not found');
            return;
        }

        const { id_user, username, status } = results[0];
        
        if (status != 1) {
            res.json({ success: false, message: 'Account inactive' });
            ////console.log('false - account inactive');
            return;
        }

        res.json({ success: true, user_ID: id_user, username, status });
        //console.log('true -', username, id_user);
    });
});

app.get('/UserStats', (req, res) => {
  const { user_ID} = req.query; // match the frontend
  //console.log('userId received:', user_ID); // verify it's coming through

  connection.query('SELECT * FROM Stats WHERE id_user = ?', [user_ID], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.json({ success: false });
      return;
    }

    const { total_runs, best_score, best_level, playtime } = results[0];
    res.json({ success: true, total_runs, best_score, best_level, playtime });
  });
});

app.get('/deleteAccount', (req, res) => {
    const { user_ID } = req.query;
    //console.log('user_id:', user_ID);  

    connection.query('UPDATE User SET status = 3 WHERE id_user = ?', [user_ID], (err, results) => {
        if (err){
            console.error(err);
            res.status(500).json({succes: false});
            return;
        }else{
            res.json({success:true});
            ////console.log('user dectivated')
        }
    });
});

app.post('/SignUp', (req, res) => {
    const { username, password, email } = req.body;
    //console.log('registering:', username, email);

    connection.query(
        'INSERT INTO User (username, password, email, role, status) VALUES (?, ?, ?, 2, 1)',
        [username, password, email],
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.json({ success: false, message: 'Username or email already exists' });
                    return;
                }
                console.error(err);
                res.status(500).json({ success: false, message: 'Server error' });
                return;
            }

            const newUserId = results.insertId; 

            connection.query(
            'INSERT INTO Stats (id_user, total_runs, best_score, best_level, playtime) VALUES (?, 0, 0, 0, 0)',
            [newUserId],
                (err) => {
                    if (err) console.error('Stats insert error:', err);
                }
            );

            res.json({ success: true });
            //console.log('user created:', username);
        }
    );
});

app.listen(port, () => {
    //console.log(`API listening on port ${port}`)
});
