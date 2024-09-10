const express = require('express');
const cors = require('cors');
const fs = require('fs');


const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');
const storeRouter = require('./routes/store');
const cashiersRouter = require('./routes/cashiers');

// Server configuration
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/items', itemsRouter);
app.use('/users', usersRouter);
app.use('/store', storeRouter);
app.use('/cashiers', cashiersRouter);


// Login
app.post("/", (req, res) => {
	if (req.body.loginusername == process.env.ADMIN_USERNAME && req.body.loginpassword == process.env.ADMIN_PASSWORD) {
		res.send(JSON.stringify({ message: "Valid" }));
		console.log(`Log in activity: ${req.body.loginusername}, success`);
	}
	else {
		res.send(JSON.stringify({ message: "Not valid" }));
		console.log(`Log in activity: ${req.body.loginusername}, fail`);
	};
});





app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));