function renderRolesPage(root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'page active';

  wrapper.innerHTML = `
    <div class="page-title">Roles</div>
    <div class="page-subtitle">
      Role mapping and permissions for your faction server.
    </div>

    <div class="card">
      <div class="card-title">Roles Overview</div>
      <div class="card-meta">Later: load from /api/roles.</div>
      <table class="table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Discord Role</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Leader</td>
            <td>@Leader</td>
            <td>Faction leadership role.</td>
          </tr>
          <tr>
            <td>Officer</td>
            <td>@Officer</td>
            <td>Helps manage members and events.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  root.appendChild(wrapper);
}
