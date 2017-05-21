'use strict';

const express = require('express');
const app = express();

app.use('/videos', require('./src/routes/videos'));


app.listen(3000);
