require('dotenv').config();
const http = require('http');
const { Pool } = require('pg');

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const server = http.createServer(async (req, res) => {

  // 🔥 CORS (ESTO ES LO QUE TE FALTABA)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 🔥 Manejo de preflight (OBLIGATORIO)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  const match = req.url.match(/^\/pokemon\/([a-zA-Z0-9]+)$/);

  if (req.method === 'GET' && match) {
    const nombre = match[1].toLowerCase();

    try {
      const result = await db.query(
        'SELECT * FROM pokemon WHERE nombre = $1',
        [nombre]
      );

      if (result.rows.length === 0) {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Pokémon no encontrado' }));
      } else {
        res.writeHead(200);
        res.end(JSON.stringify(result.rows[0]));
      }

    } catch (err) {
      console.error('💥 ERROR DB:', err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Error en la base de datos' }));
    }

    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(3001, () => {
  console.log('Pokemon service corriendo en http://localhost:3001');
});
