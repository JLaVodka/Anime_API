const express = require('express');

const router = express.Router();

const db =
  require('../db/connection');

/**
 * @swagger
 * /api/pokemon/{nombre}:
 *   get:
 *     summary:
 *       Obtener un pokemon
 */
router.get('/:nombre', async (req, res) => {

  const nombre =
    req.params.nombre.toLowerCase();

  try {

    const result = await db.query(

      'SELECT * FROM pokemon WHERE nombre = $1',

      [nombre]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({

        error:
          'Pokemon no encontrado'
      });
    }

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error base datos'
    });
  }
});

module.exports = router;