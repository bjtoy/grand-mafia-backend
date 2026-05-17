const pages = {
  dashboard: renderDashboardPage,
  members: renderMembersPage,
  roles: renderRolesPage,
  moderation: renderModerationPage,
  announcements: renderAnnouncementsPage,
  guides: renderGuidesPage
};

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    if (btn.dataset.page === page) {
      btn.classList.add('active');
    } else if (btn.dataset.page) {
      btn.classList.remove('active');
    }
  });
}

function loadPage(page) {
  const content = document.getElementById('content');
  const render = pages[page] || renderDashboardPage;
  content.innerHTML = '';
  render(content);
  setActiveNav(page);
}

function setupNav() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    const page = btn.dataset.page;
    const action = btn.dataset.action;

    if (page) {
      btn.addEventListener('click', () => loadPage(page));
    }

    if (action === 'logout') {
      btn.addEventListener('click', () => {
        handleLogout();
      });
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  setupNav();
  updateUserDisplay();
  loadPage('dashboard');
});
