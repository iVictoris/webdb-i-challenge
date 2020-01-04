const express = require('express')
const app = express()
const {router: accountRouter} = require('./router/accountRouter');

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use('/api/accounts', accountRouter);

module.exports = app;