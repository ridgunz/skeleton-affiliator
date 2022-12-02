require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;
const bookRoute = require('./app/routes/book.routes');
const otpRoute = require('./app/routes/otp.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
db.sequelize.sync();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/books', bookRoute);
app.use('/api/otp', otpRoute);

app.listen(port, () => console.log(`App listening on port http://localhost:${port}!`));
