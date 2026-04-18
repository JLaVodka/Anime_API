const http = require('http');

const SERVICES = {
  pokemon: 'http://localhost:3001'
};

const swaggerJson = JSON.stringify({
  openapi: '3.0.0',
  info: { title: 'Pokémon API', description: 'API propia conectada a MySQL con XAMPP', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
  paths: {
    '/api/pokemon/{nombre}': {
      get: {
        summary: 'Obtener un Pokémon por nombre',
        tags: ['Pokémon'],
        parameters: [{
          name: 'nombre', in: 'path', required: true,
          schema: { type: 'string', example: 'pikachu' }
        }],
        responses: {
          200: { description: 'Pokémon encontrado' },
          404: { description: 'Pokémon no encontrado' },
          502: { description: 'Microservicio no disponible' }
        }
      }
    }
  }
});

const swaggerHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Pokémon API - Docs</title>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script>
    SwaggerUIBundle({
      url: '/swagger.json',
      dom_id: '#swagger-ui'
    });
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  console.log(req.method, req.url);

  // 🔥 CORS GLOBAL (SIEMPRE)
  const setCorsHeaders = () => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  };

  setCorsHeaders();

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 📄 Swagger UI
  if (req.method === 'GET' && (req.url === '/api-docs' || req.url === '/api-docs/')) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(swaggerHtml);
    return;
  }

  // 📄 Swagger JSON
  if (req.method === 'GET' && req.url === '/swagger.json') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(swaggerJson);
    return;
  }

  // 🔎 GET /api/pokemon/:nombre
  if (req.method === 'GET' && /^\/api\/pokemon\/[a-zA-Z0-9]+$/.test(req.url)) {
    const nombre = req.url.split('/').pop();

    http.get(`${SERVICES.pokemon}/pokemon/${nombre}`, (serviceRes) => {
      let data = '';

      serviceRes.on('data', chunk => data += chunk);

      serviceRes.on('end', () => {
        res.writeHead(serviceRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end(data);
      });

    }).on('error', () => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Servicio no disponible' }));
    });

    return;
  }

  // ➕ POST /api/pokemon
  if (req.method === 'POST' && req.url === '/api/pokemon') {
    let body = '';

    req.on('data', chunk => body += chunk);

    req.on('end', () => {
      const options = {
        hostname: 'localhost',
        port: 3001,
        path: '/pokemon',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body)
        }
      };

      const proxyReq = http.request(options, (serviceRes) => {
        let data = '';

        serviceRes.on('data', chunk => data += chunk);

        serviceRes.on('end', () => {
          res.writeHead(serviceRes.statusCode, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
          });
          res.end(data);
        });
      });

      proxyReq.on('error', () => {
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Servicio no disponible' }));
      });

      proxyReq.write(body);
      proxyReq.end();
    });

    return;
  }

  // ❌ Ruta no encontrada
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
});

server.listen(3000, () => {
  console.log('API Gateway corriendo en http://localhost:3000');
  console.log('Swagger UI en http://localhost:3000/api-docs');
});