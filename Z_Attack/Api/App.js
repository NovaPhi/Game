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

    connection.query('SELECT * FROM User WHERE username = ? AND password = ?', [user, password], (err, results) => {
        if (err) throw err;

        if (results.length === 0) {
            res.json({ success: false, message: 'User not found' });
            console.log('false - user not found');
            return;
        }

        const { id_user, username, status } = results[0];

        if (status !== 1) {
            res.json({ success: false, message: 'Account inactive' });
            console.log('false - account inactive');
            return;
        }

        res.json({ success: true, user_id: id_user, username, status });
        console.log('true -', username, id_user);
    });
});

app.listen(port, () => {
    console.log('API listening on port ${port}')
});



app.get('/UserStats', (req, res) => {
  const { user_id } = req.query; // match the frontend
  console.log('userId received:', user_id); // verify it's coming through

  connection.query('SELECT * FROM Stats WHERE id_user = ?', [user_id], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.json({ success: false });
      return;
    }

    const { total_runs, best_score, best_level, playtime } = results[0];
    res.json({ success: true, total_runs, best_score, best_level, playtime });
  });
});
