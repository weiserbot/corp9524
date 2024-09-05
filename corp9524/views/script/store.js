// Clear user form
function clearForm() {
  formEntries = document.getElementById('retail-form').reset();
};

// Create user on server
async function createRetailStore(form) {
  await fetch("http://localhost:3000/registerretailstore", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: form.name.value, address: form.address.value, email: form.email.value, phone: form.phone.value, storenumber: form.storenumber.value, taxid: form.taxid.value })
  });
  readRetailStore();
  clearForm();
  event.preventDefault();
};

// Read user table on server
async function readRetailStore() {
  await fetch("http://localhost:3000/readretailstore")
    .then(res => res.json())
    .then(data => {
      displayTable(data);
    });
};

function displayTable(data) {
  document.getElementById('retail-name').textContent = data.name;
  document.getElementById('retail-address').textContent = data.address;
  document.getElementById('retail-email').textContent = data.email;
  document.getElementById('retail-phone').textContent = data.phone;
  document.getElementById('retail-store-number').textContent = data.storenumber;
  document.getElementById('retail-tax-id').textContent = data.taxid;
};

readRetailStore();