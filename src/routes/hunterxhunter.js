const express = require('express');

const router = express.Router();

const db =
  require('../db/connection');

/**
 * @swagger
 * /api/hunterxhunter/{nombre}:
 *   get:
 *     summary:
 *       Obtener un personaje de Hunter x Hunter
 */

router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM hunterxhunter');
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Error en base de datos' });
  }
});

router.get('/:nombre', async (req, res) => {

  const nombre =
    req.params.nombre.toLowerCase();

  try {

    const result = await db.query(

      'SELECT * FROM hunterxhunter WHERE nombre = $1',

      [nombre]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        error:
          'Personaje no encontrado'
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error en base de datos'
    });
  }
});

module.exports = router;