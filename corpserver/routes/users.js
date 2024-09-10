const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();




// Initialize Database
function initializedb() {
	try {
		const db = new sqlite3.Database('./database.sqlite');
		db.run("CREATE TABLE IF NOT EXISTS items (itemcode TEXT PRIMARY KEY, item TEXT, price TEXT)");
		db.run("CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, username TEXT, password TEXT)");
		db.run(`CREATE TABLE IF NOT EXISTS cashiers (
			registernumber TEXT PRIMARY KEY,
			cashierdate TEXT,
			pettycash TEXT,
			cashtransactions TEXT,
			athmoviltransactions TEXT,
			debitcredittransactions TEXT,
			salestotal TEXT,
			returntransactions TEXT,
			earlydeposit TEXT,
			finaldeposit TEXT,
			cashierstatus TEXT)`);
		console.log("Database activity");
		return db;
	}
	catch (err) {
		console.log(err);
	};
};




// Users //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/createuser", (req, res) => {
	let db = initializedb();

	db.run("INSERT INTO users (userid, name, email, phone, username, password) VALUES ($userid, $name, $email, $phone, $username, $password)",
		[req.body.userid, req.body.name, req.body.email, req.body.phone, req.body.username, req.body.password], (err) => {
			if (err) {
				console.log(err);
				res.send({ message: "User id already exists. Try a different id please." });
			}
		});
	console.log("---User created.---");
	res.end;
});

router.get("/readusers", (req, res) => {
	let db = initializedb();
	db.all("SELECT * FROM users", (err, data) => {
		if (data) {
			console.log("---Read data.---");
			res.send(JSON.stringify(data));
		} else {
			console.log(err);
		};
	});
});

router.put("/updateuser", (req, res) => {
	let db = initializedb();
	db.run("UPDATE users SET name = $name, email = $email, phone = $phone, username = $username, password = $password WHERE userid = $userid",
		[req.body.name, req.body.email, req.body.phone, req.body.username, req.body.password, req.body.userid], (err) => {
			if (err) {
				console.log(err);
			};
		});
	console.log("--- User updated");
	res.end;
});

router.delete("/deleteuser", (req, res) => {
	let db = initializedb();
	db.run("DELETE FROM users WHERE userid = $userid", req.body.userid, (err) => {
		if (err) {
			console.log(err);
			res.send({ message: "Failed to delete user" });
		};
	});
	console.log("--- User deleted");
	res.send({ message: "User deleted from records" });
});


module.exports = router;