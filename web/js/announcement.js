function renderAnnouncementsPage(root) {
  const wrapper = document.createElement('div');
  wrapper.className = 'page active';

  wrapper.innerHTML = `
    <div class="page-title">Announcements</div>
    <div class="page-subtitle">
      Send announcements to your Discord faction channels.
    </div>

    <div class="card">
      <div class="card-title">Create Announcement</div>
      <div class="card-meta">Later: POST to /api/announcements.</div>
      <textarea style="width:100%;min-height:80px;background:#020617;color:#e5e7eb;border:1px solid #1f2937;border-radius:8px;padding:8px;font-size:0.9rem;" placeholder="Type your announcement here..."></textarea>
      <div style="margin-top:10px;">
        <button class="btn btn-primary">Send (placeholder)</button>
      </div>
    </div>
  `;

  root.appendChild(wrapper);
}
