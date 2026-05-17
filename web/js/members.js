function renderMembersPage(root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'page active';

  wrapper.innerHTML = `
    <div class="page-title">Members</div>
    <div class="page-subtitle">
      View and manage members connected to your Grand Mafia Bot.
    </div>

    <div class="card">
      <div class="card-title">Members List</div>
      <div class="card-meta">Later: load from /api/members.</div>
      <table class="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Discord ID</th>
            <th>Roles</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PlaceholderUser</td>
            <td>1234567890</td>
            <td>Member</td>
            <td>Offline</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  root.appendChild(wrapper);
}
