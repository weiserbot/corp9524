// Clear user form
function clearForm() {
  formEntries = document.getElementById('user-form').reset();
};

// Create user on server
async function createUser(form) {
  await fetch("http://localhost:3000/createuser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid: form.userid.value, name: form.name.value, email: form.email.value, phone: form.phone.value, username: form.username.value, password: form.password.value })
  }).then(res => res.json())
    .then(data => {
      window.alert(data.message);
    });
  readUsers();
  clearForm();
  event.preventDefault();
};

// Read user table on server
async function readUsers() {
  await fetch("http://localhost:3000/readusers")
    .then(res => res.json())
    .then(data => {
      displayTable(data);
    });
};

// Update inventory item
function updateUser() {
  const userForm = document.getElementById('user-form');
  fetch('http://localhost:3000/updateuser', {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid: userForm.userid.value, name: userForm.name.value, email: userForm.email.value, phone: userForm.phone.value, username: userForm.username.value, password: userForm.password.value })
  });
  clearForm();
  readUsers();
  event.preventDefault();
};

// Delete user
function deleteUser() {
  const userForm = document.getElementById('user-form');
  fetch('http://localhost:3000/deleteuser', {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userid: userForm.userid.value })
  })
    .then(res => res.json())
    .then(data => {
      window.alert(data.message)
    });
  clearForm();
  readUsers();
  event.preventDefault();
}

// Display table
function displayTable(tableData) {
  const getReveal = document.getElementById('reveal');
  document.querySelector('tbody').remove();
  document.querySelector('table').append(document.createElement('tbody'));
  for (record in tableData) {
    // Table row definition
    let dataTable = document.querySelector('tbody');
    let dataRow = document.createElement('tr');
    let useridCell = document.createElement('td');
    let nameCell = document.createElement('td');
    let emailCell = document.createElement('td');
    let phoneCell = document.createElement('td');
    let usernameCell = document.createElement('td');
    let passwordCell = document.createElement('td');

    // Assign values to data cells
    useridCell.innerHTML = tableData[record].userid;
    nameCell.innerHTML = tableData[record].name;
    emailCell.innerHTML = tableData[record].email;
    phoneCell.innerHTML = tableData[record].phone;
    usernameCell.innerHTML = tableData[record].username;

    // Reveal password
    if (getReveal.checked) {
      passwordCell.innerHTML = tableData[record].password;
    }
    else {
      passwordCell.innerHTML = "**********";

    }

    // Assemble record
    dataTable.append(dataRow);
    dataRow.append(useridCell, nameCell, emailCell, phoneCell, usernameCell, passwordCell);
    dataRow.setAttribute('onclick', 'selectRow(this);');
  };
};

let previousRow;
// Select row
function selectRow(rowElement) {
  // Row selection definition
  let userTable = document.getElementById('user-table');
  let rowNumber = rowElement.rowIndex;
  let useridEntry = 0;
  let nameEntry = 1;
  let emailEntry = 2;
  let phoneEntry = 3;
  let usernameEntry = 4;
  let passwordEntry = 5;

  // Get row data
  let useridData = userTable.rows[rowNumber].cells[useridEntry].textContent;
  let nameData = userTable.rows[rowNumber].cells[nameEntry].textContent;
  let emailData = userTable.rows[rowNumber].cells[emailEntry].textContent;
  let phoneData = userTable.rows[rowNumber].cells[phoneEntry].textContent;
  let usernameData = userTable.rows[rowNumber].cells[usernameEntry].textContent;
  let passwordData = userTable.rows[rowNumber].cells[passwordEntry].textContent;

  if (previousRow) {
    if (previousRow % 2 == 0) {
      userTable.rows[previousRow].cells[useridEntry].style.backgroundColor = "rgb(221, 227, 233)";
      userTable.rows[previousRow].cells[nameEntry].style.backgroundColor = "rgb(221, 227, 233)";
      userTable.rows[previousRow].cells[emailEntry].style.backgroundColor = "rgb(221, 227, 233)";
      userTable.rows[previousRow].cells[phoneEntry].style.backgroundColor = "rgb(221, 227, 233)";
      userTable.rows[previousRow].cells[usernameEntry].style.backgroundColor = "rgb(221, 227, 233)";
      userTable.rows[previousRow].cells[passwordEntry].style.backgroundColor = "rgb(221, 227, 233)";
    }
    else {
      userTable.rows[previousRow].cells[useridEntry].style.backgroundColor = "rgb(245, 247, 248)";
      userTable.rows[previousRow].cells[nameEntry].style.backgroundColor = "rgb(245, 247, 248)";
      userTable.rows[previousRow].cells[emailEntry].style.backgroundColor = "rgb(245, 247, 248)";
      userTable.rows[previousRow].cells[phoneEntry].style.backgroundColor = "rgb(245, 247, 248)";
      userTable.rows[previousRow].cells[usernameEntry].style.backgroundColor = "rgb(245, 247, 248)";
      userTable.rows[previousRow].cells[passwordEntry].style.backgroundColor = "rgb(245, 247, 248)";

    };
  };
  userTable.rows[rowNumber].cells[useridEntry].style.backgroundColor = "darkgray";
  userTable.rows[rowNumber].cells[nameEntry].style.backgroundColor = "darkgray";
  userTable.rows[rowNumber].cells[emailEntry].style.backgroundColor = "darkgray";
  userTable.rows[rowNumber].cells[phoneEntry].style.backgroundColor = "darkgray";
  userTable.rows[rowNumber].cells[usernameEntry].style.backgroundColor = "darkgray";
  userTable.rows[rowNumber].cells[passwordEntry].style.backgroundColor = "darkgray";

  previousRow = rowNumber;

  // Display in entry fields
  let formEntries = document.getElementById('user-form');
  formEntries.userid.value = useridData;
  formEntries.name.value = nameData;
  formEntries.email.value = emailData;
  formEntries.phone.value = phoneData;
  formEntries.username.value = usernameData;
  formEntries.password.value = passwordData;
};


readUsers();