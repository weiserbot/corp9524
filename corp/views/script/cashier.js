// INVENTORY //////////////////////////////////////////////////////////////////
// Clear user form
function clearCashierForm() {
	document.getElementById('cashier-form').reset();
};

function clearEarlyDepositForm() {
	document.getElementById('early-deposit-form').reset();
};

// Create user on server
function createCashier(form) {
	fetch('http://localhost:3000/createcashier', {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			registernumber: form.registernumber.value,
			cashierdate: form.cashierdate.value,
			pettycash: form.pettycash.value,
			cashtransactions: "0",
			athmoviltransactions: "0",
			debitcredittransactions: "0",
			salestotal: "0",
			returntransactions: "0",
			earlydeposit: "0",
			finaldeposit: "0",
			cashierstatus: "open"
		})
	}).then(res => res.json())
		.then(data => {
			window.alert(data.message);
		});
	clearCashierForm();
	clearEarlyDepositForm();
	readCashiers();
	event.preventDefault();
};

// Read user table on server
async function readCashiers() {
	await fetch('http://localhost:3000/readcashiers')
		.then(res => res.json())
		.then(data => {
			displayTable(data);
		});
};

// Display table
function displayTable(tableData) {
	document.querySelector('tbody').remove();
	document.querySelector('table').append(document.createElement('tbody'));
	for (record in tableData) {
		// Table row definition
		let dataTable = document.querySelector('tbody');
		let dataRow = document.createElement('tr');
		let registernumberCell = document.createElement('td');
		let cashierdateCell = document.createElement('td');
		let pettycashCell = document.createElement('td');
		let cashtransactionsCell = document.createElement('td');
		let athmoviltransactionsCell = document.createElement('td');
		let debitcredittransactionsCell = document.createElement('td');
		let salestotalCell = document.createElement('td');
		let returntransactionsCell = document.createElement('td');
		let earlydepositCell = document.createElement('td');
		let finaldepositCell = document.createElement('td');
		let cashierstatusCell = document.createElement('td');

		// Assign values to data cells
		registernumberCell.innerHTML = tableData[record].registernumber;
		cashierdateCell.innerHTML = tableData[record].cashierdate;
		pettycashCell.innerHTML = tableData[record].pettycash;
		cashtransactionsCell.innerHTML = tableData[record].cashtransactions;
		athmoviltransactionsCell.innerHTML = tableData[record].athmoviltransactions;
		debitcredittransactionsCell.innerHTML = tableData[record].debitcredittransactions;
		salestotalCell.innerHTML = tableData[record].salestotal;
		returntransactionsCell.innerHTML = tableData[record].returntransactions;
		earlydepositCell.innerHTML = tableData[record].earlydeposit;
		finaldepositCell.innerHTML = tableData[record].finaldeposit;
		cashierstatusCell.innerHTML = tableData[record].cashierstatus;

		// Assemble record
		dataTable.append(dataRow);
		dataRow.append(registernumberCell, cashierdateCell, pettycashCell, cashtransactionsCell, athmoviltransactionsCell,
			debitcredittransactionsCell, salestotalCell, returntransactionsCell, earlydepositCell,
			finaldepositCell, cashierstatusCell);
		dataRow.setAttribute('onclick', 'selectRow(this);');
	};
};

// Update inventory item
function earlyDeposit(form) {
	if (checkEarlyDeposit == "0" && checkCashierStatus == "open") {
		const cashierform = document.getElementById('cashier-form');
		fetch('http://localhost:3000/updateearlydeposit', {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ earlydeposit: form.earlydeposit.value, registernumber: cashierform.registernumber.value })
		});
		clearCashierForm();
		clearEarlyDepositForm();
		readCashier();
		event.preventDefault();
	}
	else {
		window.alert("Early deposit already processed or cashier is closed");
	};
};

// Delete item
function closeCashier() {
	if (checkCashierStatus == "open") {
		const cashierForm = document.getElementById('cashier-form');
		fetch('http://localhost:3000/closecashier', {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ registernumber: cashierForm.registernumber.value, cashierstatus: "closed" })
		});
		clearCashierForm();
		clearEarlyDepositForm();
		readCashiers();
		event.preventDefault();
	}
	else {
		window.alert("Cashier selected is already closed");
	};
};

//// get record that is open, calculationd and update the sameone then refresh table.
async function runCashierUpdate() {
	if (checkCashierStatus == "open") {
		const cashierform = document.getElementById('cashier-form');
		await fetch('http://localhost:3000/runcashierupdate', {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ registernumber: cashierform.registernumber.value })
		}).then(res => res.json())
			.then(data => {
				window.alert(data.message);
			});
		clearCashierForm();
		clearEarlyDepositForm();
		readCashiers();
		event.preventDefault();
	}
	else {
		window.alert("Cashier selected is already closed");
	};
};

let checkEarlyDeposit = "";
let checkCashierStatus = "";
let previousRow;
// Select row
function selectRow(rowElement) {
	// Row selection definition
	let cashierTable = document.getElementById('open-cashier-table');
	let rowNumber = rowElement.rowIndex;
	let registerNumberEntry = 0;
	let cashierDateEntry = 1;
	let pettyCashEntry = 2;
	let cashTrasactionsEntry = 3;
	let athMovilTransactionsEntry = 4;
	let debitCreditTransactionsEntry = 5;
	let salesTotalEntry = 6;
	let returnTransactionEntry = 7;
	let earlyDepositEntry = 8;
	let finalDepositEntry = 9;
	let cashierStatusEntry = 10;

	// Get row data
	let registerNumberData = cashierTable.rows[rowNumber].cells[registerNumberEntry].textContent;
	let cashierDateData = cashierTable.rows[rowNumber].cells[cashierDateEntry].textContent;
	let pettyCashData = cashierTable.rows[rowNumber].cells[pettyCashEntry].textContent;
	let earlyDepositData = cashierTable.rows[rowNumber].cells[earlyDepositEntry].textContent;

	checkEarlyDeposit = cashierTable.rows[rowNumber].cells[earlyDepositEntry].textContent; // check early deposit done
	checkCashierStatus = cashierTable.rows[rowNumber].cells[cashierStatusEntry].textContent; // check if status is open

	if (previousRow) {
		if (previousRow % 2 == 0) {
			cashierTable.rows[previousRow].cells[registerNumberEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[cashierDateEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[pettyCashEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[cashTrasactionsEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[athMovilTransactionsEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[debitCreditTransactionsEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[salesTotalEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[returnTransactionEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[earlyDepositEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[finalDepositEntry].style.backgroundColor = "rgb(221, 227, 233)";
			cashierTable.rows[previousRow].cells[cashierStatusEntry].style.backgroundColor = "rgb(221, 227, 233)";
		}
		else {
			cashierTable.rows[previousRow].cells[registerNumberEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[cashierDateEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[registerNumberEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[pettyCashEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[cashTrasactionsEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[athMovilTransactionsEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[debitCreditTransactionsEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[salesTotalEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[returnTransactionEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[earlyDepositEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[finalDepositEntry].style.backgroundColor = "rgb(245, 247, 248)";
			cashierTable.rows[previousRow].cells[cashierStatusEntry].style.backgroundColor = "rgb(245, 247, 248)";
		};
	};

	cashierTable.rows[rowNumber].cells[registerNumberEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[cashierDateEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[pettyCashEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[cashTrasactionsEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[athMovilTransactionsEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[debitCreditTransactionsEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[salesTotalEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[returnTransactionEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[earlyDepositEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[finalDepositEntry].style.backgroundColor = "darkgray";
	cashierTable.rows[rowNumber].cells[cashierStatusEntry].style.backgroundColor = "darkgray";

	previousRow = rowNumber;

	// Display in entry fields
	let cashierFormEntries = document.getElementById('cashier-form');
	cashierFormEntries.registernumber.value = registerNumberData;
	cashierFormEntries.cashierdate.value = cashierDateData;
	cashierFormEntries.pettycash.value = pettyCashData;
	let earlyDepositFormEntries = document.getElementById('early-deposit-form');
	earlyDepositFormEntries.earlydeposit.value = earlyDepositData;
};

readCashiers();
/////////////////////////////////////////////////////////////////////////////////////////////


