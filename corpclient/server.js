const express = require('express');
const cors = require('cors');
const path = require('path');





// Server configuration
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Front-end
app.use(express.static(path.join(__dirname, 'views')));


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));