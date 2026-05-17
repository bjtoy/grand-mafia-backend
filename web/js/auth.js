function updateUserDisplay() {
  const nameEl = document.getElementById('user-name');
  if (!nameEl) return;

  nameEl.textContent = 'Guest';
}

function handleLogout() {
  alert('Logout clicked (backend wiring later).');
}
