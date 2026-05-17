function renderGuidesPage(root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'page active';

  wrapper.innerHTML = `
    <div class="page-title">Guides</div>
    <div class="page-subtitle">
      Manage and organize guides for The Grand Mafia.
    </div>

    <div class="card">
      <div class="card-title">Guide List</div>
      <div class="card-meta">Later: load from /api/guides.</div>
      <ul style="padding-left:18px;font-size:0.9rem;color:#e5e7eb;">
        <li>Enforcer Basics (placeholder)</li>
        <li>Faction War Strategy (placeholder)</li>
        <li>Underground Market Guide (placeholder)</li>
      </ul>
    </div>
  `;

  root.appendChild(wrapper);
}
