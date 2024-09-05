const express = require('express');
const cors = require('cors');
const path = require('path');
const env_variables = require('./env.json');
//const PORT = process.env.PORT || 8000;
const sqlite3 = require('sqlite3');
const fs = require('fs');





// Server configuration
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Front-end
app.use(express.static(path.join(__dirname, 'views')));





// Back-end
// Login
app.post("/", (req, res) => {
	if (req.body.loginusername == env_variables.ADMIN_USERNAME && req.body.loginpassword == env_variables.ADMIN_PASSWORD) {
		res.send(JSON.stringify({ message: "Valid" }));
		console.log(`Log in activity: ${req.body.loginusername}, success`);
	}
	else {
		res.send(JSON.stringify({ message: "Not valid" }));
		console.log(`Log in activity: ${req.body.loginusername}, fail`);
	};
});

// Initialize Database
function initializedb() {
	try {
		const db = new sqlite3.Database('./database.sqlite');
		db.run("CREATE TABLE IF NOT EXISTS items (itemcode TEXT PRIMARY KEY, item TEXT, price TEXT)");
		db.run("CREATE TABLE IF NOT EXISTS users (name TEXT PRIMARY KEY, email TEXT, phone TEXT, username TEXT, password TEXT)");
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
app.post("/createitem", (req, res) => {
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

app.get("/readitems", (req, res) => {
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

app.put("/updateitem", (req, res) => {
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

app.delete("/deleteitem", (req, res) => {
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





// Users //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.post("/createuser", (req, res) => {
	let db = initializedb();

	db.run("INSERT INTO users (name, email, phone, username, password) VALUES ($name, $email, $phone, $username, $password)",
		[req.body.name, req.body.email, req.body.phone, req.body.username, req.body.password], (err) => {
			if (err) {
				console.log(err);
				res.send({ message: "Name already exists. Try a different name please." });
			}
		});
	console.log("---User created.---");
	res.end;
});

app.get("/readusers", (req, res) => {
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

app.put("/updateuser", (req, res) => {
	let db = initializedb();
	db.run("UPDATE users SET email = $email, phone = $phone, username = $username, password = $password WHERE name = $name",
		[req.body.email, req.body.phone, req.body.username, req.body.password, req.body.name], (err) => {
			if (err) {
				console.log(err);
			};
		});
	console.log("--- User updated");
	res.end;
});

app.delete("/deleteuser", (req, res) => {
	let db = initializedb();
	db.run("DELETE FROM users WHERE name = $name", req.body.name, (err) => {
		if (err) {
			console.log(err);
			res.send({ message: "Failed to delete user" });
		};
	});
	console.log("--- User deleted");
	res.send({ message: "User deleted from records" });
});





// Retail Store Information //////////////////////////////////////////////////////////////////////////////////////
app.post("/registerretailstore", (req, res) => {
	fs.writeFile('retailstore.json', JSON.stringify(req.body), (err) => {
		if (err) {
			console.log(err);
		};
	});
});

app.get("/readretailstore", (req, res) => {
	fs.readFile('retailstore.json', 'utf-8', (err, data) => {
		res.send(data);
	});
});





// Cashier Management ///////////////////////////////////////////////////////////////////////////////////////////
app.post("/createcashier", (req, res) => {
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

app.get("/readcashiers", (req, res) => {
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

app.put("/updateearlydeposit", (req, res) => {
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

app.put("/closecashier", (req, res) => {
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

app.put("/runcashierupdate", (req, res) => {
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







initializedb();
app.listen(env_variables.PORT, () => console.log(`Server running on port ${env_variables.PORT}`));