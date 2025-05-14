const bcrypt = require('bcrypt'); const password = 'testpass'; bcrypt.hash(password, 10, (err, hash) => { if (err) console.error(err); console.log('Hashed password:', hash); });
