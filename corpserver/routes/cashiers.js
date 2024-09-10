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





// Cashier Management ///////////////////////////////////////////////////////////////////////////////////////////
router.post("/createcashier", (req, res) => {
	let db = initializedb();
	db.run(`INSERT INTO cashiers (
			registernumber,
			cashierdate,
			pettycash,
			cashtransactions,
			athmoviltransactions,
			debitcredittransactions,
			salestotal,
			returntransactions,
			earlydeposit,
			finaldeposit,
			cashierstatus
		) VALUES (
			$registernumber,
			$cashierdate,
			$pettycash,
			$cashtransactions,
			$athmoviltransactions,
			$debitcredittransactions,
			$salestotal,
			$returntransactions,
			$earlydeposit,
			$finaldeposit,
			$cashierstatus 
		)`,
		[
			req.body.registernumber,
			req.body.cashierdate,
			req.body.pettycash,
			req.body.cashtransactions,
			req.body.athmoviltransactions,
			req.body.debitcredittransactions,
			req.body.salestotal,
			req.body.returntransactions,
			req.body.earlydeposit,
			req.body.finaldeposit,
			req.body.cashierstatus
		], (err) => {
			if (err) {
				console.log(err);
				res.send({ message: "Cashier already exists. Try a different Id please." });
			}
		});
	console.log("--- Cashier open");
	res.end;
});

router.get("/readcashiers", (req, res) => {
	let db = initializedb();
	db.all("SELECT * FROM cashiers", (err, data) => {
		if (data) {
			console.log("--- Read database table");
			res.send(JSON.stringify(data));
		} else {
			console.log(err);
		};
	});
});

router.put("/updateearlydeposit", (req, res) => {
	let db = initializedb();
	db.run("UPDATE cashiers SET earlydeposit = $earlydeposit WHERE registernumber = $registernumber",
		[req.body.earlydeposit, req.body.registernumber], (err) => {
			if (err) {
				console.log(err);
			};
		});
	console.log("--- Early deposit");
	res.end;
});

router.put("/closecashier", (req, res) => {
	let db = initializedb();
	db.run("UPDATE cashiers SET cashierstatus = $cashierstatus WHERE registernumber = $registernumber",
		[req.body.cashierstatus, req.body.registernumber], (err) => {
			if (err) {
				console.log(err);
			};
		});
	console.log("--- Closed cashier");
	res.end;
});

router.put("/runcashierupdate", (req, res) => {
	let db = initializedb();
	db.each("SELECT * FROM cashiers WHERE registernumber = $registernumber", [req.body.registernumber], (err, data) => {
		if (data) {
			console.log("--- Run cashier update");
			if (data.cashierstatus == "open") {
				console.log(data)
				let totalSales = Number(data.cashtransactions) + Number(data.athmoviltransactions) + Number(data.debitcredittransactions);
				let finalDeposit = Number(totalSales) - Number(data.returntransactions) - Number(data.earlydeposit);

				let db = initializedb();
				db.run("UPDATE cashiers SET salestotal = $salestotal, finaldeposit = $finaldeposit WHERE registernumber = $registernumber",
					[String(totalSales), String(finalDeposit), data.registernumber], (err) => {
						if (err) {
							console.log(err);
						};
					});
				res.send({ message: "Cashier updated" });
			}
			else {
				res.send({ message: "Cashier selected is closed" })
			};
		} else {
			console.log(err);
		};
	});
});

module.exports = router;