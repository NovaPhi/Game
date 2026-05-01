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
        password: '',
        database: 'EVA_Cafe'
    });
    connection.connect((err) => {
        if (err) throw err;
    console.log('Connected to DB');
});

app.get('/Menu', (req, res) => {
    const day = req.query.day;
    const query = `
        SELECT mi.item_name, mi.imageSrc, mid.price, d.promotion_type
        FROM Menu_items mi
        JOIN Menu_item_day mid ON mi.id_item = mid.item_id
        JOIN Days d ON mid.day_id = d.id_day
        WHERE d.day_name = ?
    `;
    connection.query(query, [day], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.get('/Mangas', (req, res) => {
    connection.query('SELECT * FROM Mangas', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});