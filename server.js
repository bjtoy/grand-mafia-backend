const express = require('express');
const path = require('path');
const app = express();

// Serve the entire /web folder
app.use(express.static(path.join(__dirname, 'web')));

// Explicitly serve /assets (fixes your icons)
app.use('/assets', express.static(path.join(__dirname, 'web/assets')));

// Fallback: always load index.html for the dashboard
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'web/index.html'));
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Grand Mafia Bot Dashboard running at http://localhost:${PORT}`);
});
