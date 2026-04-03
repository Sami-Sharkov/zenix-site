const express = require('express'); // Backend framework
const query = require('query-a2s'); // Steam query library

const app = express();
const PORT = 3000;

// Replace with your Ark server IP and Query port
const SERVER_IP = '192.168.0.34'; // Example: "123.45.67.89"
const QUERY_PORT = 27021; // Typically 27015 unless configured otherwise

// Route to fetch player count
app.get('/api/playercount', async (req, res) => {
  try {
    const info = await query.info(SERVER_IP, QUERY_PORT);
    res.json({ players: info.players, maxPlayers: info.maxPlayers });
  } catch (error) {
    console.error('Error querying server:', error);
    res.status(500).json({ error: 'Unable to fetch player count' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
