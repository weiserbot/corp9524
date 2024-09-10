const express = require('express');
const fs = require('fs');
const router = express.Router();





// Retail Store Information //////////////////////////////////////////////////////////////////////////////////////
router.post("/registerretailstore", (req, res) => {
	fs.writeFile('retailstore.json', JSON.stringify(req.body), (err) => {
		if (err) {
			console.log(err);
		};
	});
});

router.get("/readretailstore", (req, res) => {
	fs.readFile('retailstore.json', 'utf-8', (err, data) => {
		res.send(data);
	});
});


module.exports = router;