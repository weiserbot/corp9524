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






// Inventory ////////////////////////////////////////////////////////////////////////////////////////////////////////
router.post("/createitem", (req, res) => {
	let db = initializedb();
	db.run("INSERT INTO items (itemcode, item, price) VALUES ($itemcode, $item, $price)",
		[req.body.itemcode, req.body.item, req.body.price], (err) => {
			if (err) {
				console.log(err);
				res.send({ message: "Item code already exists. Try a different item code please." });
			}
		});
	console.log("--- Item registered");
	res.end;
});

router.get("/readitems", (req, res) => {
	let db = initializedb();
	db.all("SELECT * FROM items", (err, data) => {
		if (data) {
			console.log("--- Read database table");
			res.send(JSON.stringify(data));
		} else {
			console.log(err);
		};
	});
});

router.put("/updateitem", (req, res) => {
	let db = initializedb();
	db.run("UPDATE items SET item = $item, price = $price WHERE itemcode = $itemcode",
		[req.body.item, req.body.price, req.body.itemcode], (err) => {
			if (err) {
				console.log(err);
			};
		});
	console.log("--- Item updated");
	res.end;
});

router.delete("/deleteitem", (req, res) => {
	let db = initializedb();
	db.run("DELETE FROM items WHERE itemcode = $itemcode", req.body.itemcode, (err) => {
		if (err) {
			console.log(err);
			res.send({ message: "Failed to delete item" });
		};
	});
	console.log("--- Item deleted");
	res.send({ message: "Item deleted from inventory" });
});


module.exports = router;