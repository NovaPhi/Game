const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express()
const bcrypt = require('bcrypt')
const port = 8081
const SALT_ROUNDS = 10;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));



const connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Alo111204*',
        database: 'z_attack'
    });
    connection.connect((err) => {
        if (err) throw err;
    console.log('Connected to DB');
});

app.post('/Login', (req, res) => {
    const user = req.body.Username;
    const password = req.body.password;
    const date = new Date();
    const ip = req.ip;
    const device_browser = req.headers['user-agent'];

    connection.query('SELECT * FROM User WHERE username = ?', [user], async (err, results) => {
        if (err) throw err;
        if (results.length === 0) return res.json({ success: false, message: 'User not found' });

        const dbUser = results[0];
        
        const match = await bcrypt.compare(password, dbUser.password);
        if (!match) return res.json({ success: false, message: 'User not found' });

        if (dbUser.status != 1) return res.json({ success: false, message: 'Account inactive' });

        res.json({ success: true, user_ID: dbUser.id_user, username: dbUser.username, status: dbUser.status, role: dbUser.role });

        connection.query(
            `INSERT INTO Connection_logs (id_user, connection_timestamp, disconnection_timestamp, ip_address, location, device_browser_info)
            VALUES (?, ?, NULL, ?, 'Mexico', ?)`,
            [dbUser.id_user, date, ip, device_browser],
            (err) => {
                if (err) console.error('Connection log insert error:', err);
            }
        );
    });
});

app.get('/Logout', (req, res) => {
    const { user_ID } = req.query;

    connection.query(
        'UPDATE Connection_logs SET disconnection_timestamp = NOW() WHERE id_user = ? AND disconnection_timestamp IS NULL ORDER BY connection_timestamp DESC LIMIT 1', [user_ID], (err, results) => {
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

app.get('/UserStats', (req, res) => {
  const { user_ID } = req.query; // match the frontend
  //console.log('userId received:', user_ID); // verify it's coming through

  connection.query('SELECT * FROM Stats WHERE id_user = ?', [user_ID], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.json({ success: false });
      return;
    }

    const { total_runs, best_score, best_level, playtime, total_xp } = results[0];
    res.json({ success: true, total_runs, best_score, best_level, playtime, total_xp });
  });
});

//app.post('/saveStats', (req, res) => {
//    const { user_ID, score, level, playtime } = req.body;
//
//    connection.query(
//        `UPDATE Stats SET
//            total_runs = total_runs + 1,
//            best_score = GREATEST(best_score, ?),
//            best_level = GREATEST(best_level, ?),
//            playtime = playtime + ?
//        WHERE id_user = ?`,
//        [score, level, playtime, user_ID],
//        (err) => {
//            if (err) {
//                console.error(err);
//                return res.status(500).json({ success: false });
//            }
//            res.json({ success: true });
//        }
//    );
//});

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

app.post('/SignUp', async (req, res) => {
    console.log(req.body);
    const { username, password, email } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    connection.query(
        'INSERT INTO User (username, password, email, role, status) VALUES (?, ?, ?, 2, 1)',
        [username, hashedPassword, email],
        (err, results) => {
            if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.json({ success: false, message: 'Username or email already exists' });
            console.error('User insert error:', err); // add this
            return res.status(500).json({ success: false, message: 'Server error' });
        }

            const newUserId = results.insertId;

            connection.query(
                'INSERT INTO Stats (id_user, total_runs, best_score, best_level, playtime) VALUES (?, 0, 0, 0, 0)',
                [newUserId],
                (err) => {
                    if (err) console.error('Stats insert error:', err);

                    connection.query(
                        `INSERT INTO User_Collection (id_user, id_card) 
                         SELECT ?, id_card FROM Cards ORDER BY id_card LIMIT 3`,
                        [newUserId],
                        (err, colResult) => {
                            if (err) console.error('Starter collection insert error:', err);
                            console.log('Collection rows inserted:', colResult?.affectedRows);

                            connection.query(
                                `INSERT INTO User_Deck (id_user, id_card, slot)
                                 SELECT ?, id_card, ROW_NUMBER() OVER (ORDER BY id_card) - 1
                                 FROM Cards ORDER BY id_card LIMIT 3`,
                                [newUserId],
                                (err, deckResult) => {
                                    if (err) console.error('Starter deck insert error:', err);
                                    console.log('Deck rows inserted:', deckResult?.affectedRows);
                                    res.json({ success: true });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
});

app.get('/UserRegistry', (req, res) => {
    const roleMap = { 1: 'Admin', 2: 'User' };
    const statusMap = { 1: 'Active', 2: 'Banned', 3: 'Disabled' };

    connection.query('SELECT id_user, username, email, role, status, created_at FROM User', [], (err, results) => {
        if (err) throw err;
        let Users = results.map(User => ({
            id: User.id_user,
            username: User.username,
            email: User.email,
            role: roleMap[User.role] || User.role,
            status: statusMap[User.status] || User.status,
            created: User.created_at ? User.created_at.toString() : 'N/A',
        }));
        res.json({ success: true, Users });
    });
});

app.get('/Admin', (req,res)=>{
    connection.query('SELECT id_user, username, status FROM User',[],(err,results,fields)=>{
        if(err) throw err;
        let Users = results.map(User => ({
            user_ID: User.id_user,
            username: User.username,
            Stauts: User.status
        }));

        res.json({ success: true, Users});
        //console.log(Users);
        
    })
    
});

app.get('/LogsTable', (req,res)=>{
    connection.query('SELECT * FROM Connection_logs',[],(err,results)=>{
        if(err) throw err;
        let Logs = results.map(Logs => ({
            log_id: Logs.id_log,
            user_ID: Logs.id_user,
            connection_date: Logs.connection_timestamp ? Logs.connection_timestamp.toString() : null,
            disconnection_date: Logs.disconnection_timestamp ? Logs.disconnection_timestamp.toString() : null,
            ip_address: Logs.ip_address,
            location: Logs.location,
            device_browser: Logs.device_browser_info
        }));

        res.json({ success: true, Logs});
        //console.log(Users);
        
    })
    
});

app.post('/Admin', (req,res)=>{
    const {user_ID} = req.body;

    connection.query('UPDATE User SET status = 2 WHERE id_user =?', [user_ID], (err,result) =>{
        if (err){ 
            console.error('status update: ', err)
            console.log(sessionUser.id_user, sessionUser.status);
            return res.json({success: false});
        };
        res.json({success: true});

    });
});

app.get('/heroes', (req,res)=>{
    connection.query('SELECT id_hero, hero_name, description, asset, cardColor, speedMod, maxHp, dmgMult, dmgReduction FROM Hero',[],(err,results,fields)=>{
        if(err) throw err;
        let Heroes = results.map(hero => ({
                id: hero.id_hero,
                name: hero.hero_name,
                description: hero.description,
                asset: hero.asset,
                cardColor: hero.cardColor,
                speedMod: hero.speedMod, 
                maxHp: hero.maxHp,
                dmgMult: hero.dmgMult,
                dmgReduction: hero.dmgReduction
        }));

        res.json({ success: true, Heroes});
        //console.log(Users);
        
    })
    
    
});

app.get('/DeckBuilder', (req, res) => {
    const { user_ID } = req.query;  // ← GET uses query params not body
    
    connection.query(
        `SELECT c.id_card, c.name, c.description, c.rarity, c.card_type, 
                c.targeting, c.is_ability, c.modifier_value, c.modifier, c.cooldown_sec, 
                c.buff_value, c.duration_sec, c.is_immortal
         FROM User_Collection uc
         JOIN Cards c ON uc.id_card = c.id_card
         WHERE uc.id_user = ?`,
        [user_ID],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }
            //console.log("connection succesfull")
            const Cards = results.map(c => ({
                id:            c.id_card,
                name:          c.name,
                description:   c.description,
                rarity:        c.rarity,
                card_type:     c.card_type,
                targeting:     c.targeting,
                is_ability:    c.is_ability,
                modifier_value: parseFloat(c.modifier_value),
                modifier:      c.modifier,
                cooldown_sec:  parseFloat(c.cooldown_sec),
                buff_value:    parseFloat(c.buff_value),
                duration_sec:  parseFloat(c.duration_sec),
                is_immortal:   c.is_immortal
            }));
            res.json({ success: true, Cards });

           //Cconsole.log("cards Api",results);
        }
    );
});

app.post('/saveDeck', (req, res) => {
    const { user_ID, cardIds } = req.body;

    connection.query('DELETE FROM User_Deck WHERE id_user = ?', [user_ID], (err) => {
        if (err) return res.status(500).json({ success: false });
        if (cardIds.length === 0) return res.json({ success: true });

        const values = cardIds.map((id, index) => [user_ID, id, index]);
        connection.query(
            'INSERT INTO User_Deck (id_user, id_card, slot) VALUES ?',
            [values],
            (err) => {
                if (err) { console.error(err); return res.status(500).json({ success: false }); }
                res.json({ success: true });
            }
        );
    });
});

app.get('/loadDeck', (req, res) => {
    const { user_ID } = req.query;
    connection.query(
        `SELECT c.id_card, c.name, c.description, c.rarity, c.card_type,
                c.targeting, c.modifier, c.modifier_value, c.buff_value,
                c.duration_sec, c.is_immortal
         FROM User_Deck ud
         JOIN Cards c ON ud.id_card = c.id_card
         WHERE ud.id_user = ?
         ORDER BY ud.slot`,
        [user_ID],
        (err, results) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, Cards: results });
        }
    );
});

app.get('/getAllCards', (req, res) => {
    connection.query('SELECT * FROM Cards', [], (err, results) => {
        if (err) return res.status(500).json({ success: false });
        const Cards = results.map(c => ({
            id:             c.id_card,
            name:           c.name,
            description:    c.description,
            rarity:         c.rarity,
            card_type:      c.card_type,
            targeting:      c.targeting,
            modifier:       c.modifier,
            modifier_value: parseFloat(c.modifier_value),
            buff_value:     parseFloat(c.buff_value),
            duration_sec:   parseFloat(c.duration_sec),
            is_immortal:    c.is_immortal
        }));
        res.json({ success: true, Cards });
    });
});

app.post('/openLootbox', (req, res) => {
    const { user_ID, tier, card_id } = req.body;

    const tierCosts = { basic: 900, rare: 1800, legendary: 6000 };
    const cost = tierCosts[tier];
    if (!cost) return res.status(400).json({ success: false, message: 'Invalid tier' });

    // Check XP
    connection.query('SELECT total_xp FROM Stats WHERE id_user = ?', [user_ID], (err, results) => {
        if (err) return res.status(500).json({ success: false });
        if (results.length === 0) return res.json({ success: false, message: 'User not found' });

        const currentXP = results[0].total_xp;
        if (currentXP < cost) return res.json({ success: false, message: 'Not enough XP' });

        // Deduct XP
        connection.query(
            'UPDATE Stats SET total_xp = total_xp - ? WHERE id_user = ?',
            [cost, user_ID],
            (err) => {
                if (err) return res.status(500).json({ success: false });

                // Verify card exists and user doesn't own it
                connection.query(
                    `SELECT id_card FROM Cards WHERE id_card = ?
                     AND id_card NOT IN (
                         SELECT id_card FROM User_Collection WHERE id_user = ?
                     )`,
                    [card_id, user_ID],
                    (err, check) => {
                        if (err) return res.status(500).json({ success: false });
                        if (check.length === 0) return res.json({ success: false, message: 'Card not available' });

                        // Add to collection
                        connection.query(
                            'INSERT INTO User_Collection (id_user, id_card) VALUES (?, ?)',
                            [user_ID, card_id],
                            (err) => {
                                if (err) return res.status(500).json({ success: false });
                                res.json({ success: true, new_xp: currentXP - cost });
                            }
                        );
                    }
                );
            }
        );
    });
});


app.post('/saveStats', (req, res) => {
    const { user_ID, score, level, playtime } = req.body;
    connection.query(
        `UPDATE Stats SET
            total_runs = total_runs + 1,
            best_score = GREATEST(best_score, ?),
            best_level = GREATEST(best_level, ?),
            playtime   = playtime + ?,
            total_xp   = total_xp + ?
        WHERE id_user = ?`,
        [score, level, playtime, score, user_ID],
        (err) => {
            if (err) { console.error(err); return res.status(500).json({ success: false }); }
            res.json({ success: true });
        }
    );
});

app.listen(port, () => {
    //console.log(`API listening on port ${port}`)
});

 