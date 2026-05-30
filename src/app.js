require('dotenv').config();

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');
const app = express();

app.disable('x-powered-by');

// MIDDLEWARES
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:5173'];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.some(o => origin.startsWith(o.trim())) ||
      origin.includes('localhost') ||
      origin.includes('192.168') ||
      origin.includes('exp://') ||
      origin.includes('exp.direct')
    ) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());

// SWAGGER
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Anime API',
      version: '1.0.0',
      description: 'API de Pokemon y Anime'
    },
    servers: [
      {
        url: process.env.SERVER_URL || 'http://localhost:3000'
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// POKEMON
app.use('/api/pokemon', require('./routes/pokemon'));

// SAINT SEIYA
app.use('/api/saintseiya', require('./routes/saintseiya'));

// HUNTER X HUNTER
app.use('/api/hunter', require('./routes/hunterxhunter'));

// ONE PIECE
app.use('/api/onepiece', require('./routes/onepiece'));

// AUTH
app.use('/api/auth', require('./routes/auth'));

// CATEGORIAS Y ANIMES
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/animes', require('./routes/animes'));
app.use('/api/personajes', require('./routes/personajes'));

// RUTA TEST
app.get('/', (req, res) => {
  res.json({ message: 'Anime API funcionando' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Swagger en http://localhost:${PORT}/api-docs`);
});
