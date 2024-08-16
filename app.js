const express = require('express');
const app = express();
const usersRouter = require('./database/routes/users.js');
const conn = require('./database/conn.js')

app.use('/api/users', usersRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});