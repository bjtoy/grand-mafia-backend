function renderModerationPage(root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'page active';

  wrapper.innerHTML = `
    <div class="page-title">Moderation</div>
    <div class="page-subtitle">
      Tools for managing warnings, kicks, bans, and more.
    </div>

    <div class="card">
      <div class="card-title">Moderation Actions</div>
      <div class="card-meta">Later: connect to /api/moderation.</div>
      <button class="btn btn-primary">Open Moderation Panel (placeholder)</button>
    </div>
  `;

  root.appendChild(wrapper);
}
