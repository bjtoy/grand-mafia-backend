function renderDashboardPage(root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'page active';

  wrapper.innerHTML = `
    <div class="page-title">Dashboard Overview</div>
    <div class="page-subtitle">
      High-level view of your Grand Mafia Bot activity.
    </div>

    <div class="card-grid">
      <div class="card">
        <div class="card-title">Total Members</div>
        <div class="card-value">0</div>
        <div class="card-meta">Live data will appear once connected.</div>
      </div>
      <div class="card">
        <div class="card-title">Online Now</div>
        <div class="card-value">0</div>
        <div class="card-meta">Discord presence integration coming.</div>
      </div>
      <div class="card">
        <div class="card-title">Recent Actions</div>
        <div class="card-meta">Moderation logs will show here.</div>
      </div>
    </div>
  `;

  root.appendChild(wrapper);
}
