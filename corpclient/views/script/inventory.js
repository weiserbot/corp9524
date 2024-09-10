// INVENTORY //////////////////////////////////////////////////////////////////
// Clear user form
function clearForm() {
	document.getElementById('item-form').reset();
	readItems();
};

// Create user on server
function createItem(form) {
	fetch('http://localhost:3000/items/createitem', {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ itemcode: form.itemcode.value, item: form.item.value, price: form.price.value })
	}).then(res => res.json())
		.then(data => {
			window.alert(data.message);
		});
	clearForm();
	readItems();
	event.preventDefault();
};

// Read user table on server
async function readItems() {
	await fetch('http://localhost:3000/items/readitems')
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
		let itemcodeCell = document.createElement('td');
		let itemCell = document.createElement('td');
		let priceCell = document.createElement('td');

		// Assign values to data cells
		itemcodeCell.innerHTML = tableData[record].itemcode;
		itemCell.innerHTML = tableData[record].item;
		priceCell.innerHTML = tableData[record].price;

		// Assemble record
		dataTable.append(dataRow);
		dataRow.append(itemcodeCell, itemCell, priceCell);
		dataRow.setAttribute('onclick', 'selectRow(this);');
	};
};

// Update inventory item
function updateItem() {
	const itemForm = document.getElementById('item-form');
	fetch('http://localhost:3000/items/updateitem', {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ itemcode: itemForm.itemcode.value, item: itemForm.item.value, price: itemForm.price.value })
	});
	clearForm();
	readItems();
	event.preventDefault();
};

// Delete item
function deleteItem() {
	const itemForm = document.getElementById('item-form');
	fetch('http://localhost:3000/items/deleteitem', {
		method: "DELETE",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ itemcode: itemForm.itemcode.value })
	})
		.then(res => res.json())
		.then(data => {
			window.alert(data.message)
		});
	clearForm();
	readItems();
	event.preventDefault();
}

let previousRow;
// Select row
function selectRow(rowElement) {
	// Row selection definition
	let itemTable = document.getElementById('item-table');
	let rowNumber = rowElement.rowIndex;
	let itemcodeEntry = 0;
	let itemEntry = 1;
	let priceEntry = 2;

	// Get row data
	let itemcodeData = itemTable.rows[rowNumber].cells[itemcodeEntry].textContent;
	let itemData = itemTable.rows[rowNumber].cells[itemEntry].textContent;
	let priceData = itemTable.rows[rowNumber].cells[priceEntry].textContent;

	if (previousRow) {
		if (previousRow % 2 == 0) {
			itemTable.rows[previousRow].cells[itemcodeEntry].style.backgroundColor = "rgb(221, 227, 233)";
			itemTable.rows[previousRow].cells[itemEntry].style.backgroundColor = "rgb(221, 227, 233)";
			itemTable.rows[previousRow].cells[priceEntry].style.backgroundColor = "rgb(221, 227, 233)";
		}
		else {
			itemTable.rows[previousRow].cells[itemcodeEntry].style.backgroundColor = "rgb(245, 247, 248)";
			itemTable.rows[previousRow].cells[itemEntry].style.backgroundColor = "rgb(245, 247, 248)";
			itemTable.rows[previousRow].cells[priceEntry].style.backgroundColor = "rgb(245, 247, 248)";
		};
	};

	itemTable.rows[rowNumber].cells[itemcodeEntry].style.backgroundColor = "darkgray";
	itemTable.rows[rowNumber].cells[itemEntry].style.backgroundColor = "darkgray";
	itemTable.rows[rowNumber].cells[priceEntry].style.backgroundColor = "darkgray";

	previousRow = rowNumber;

	// Display in entry fields
	let formEntries = document.getElementById('item-form');
	formEntries.itemcode.value = itemcodeData;
	formEntries.item.value = itemData;
	formEntries.price.value = priceData;
};

readItems();
/////////////////////////////////////////////////////////////////////////////////////////////


