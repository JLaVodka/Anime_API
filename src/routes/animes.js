const express = require('express');

const router = express.Router();

const db =
  require('../db/connection');

// ======================================
// OBTENER ANIMES
// ======================================

router.get('/', async (req, res) => {

  try {

    const result =
      await db.query(

        `
        SELECT
          animes.id,
          animes.nombre,
          categorias.nombre
          AS categoria

        FROM animes

        INNER JOIN categorias

        ON animes.categoria_id =
        categorias.id

        ORDER BY animes.id
        `
      );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error obteniendo animes'
    });
  }
});

// CREAR ANIME
router.post('/', async (req, res) => {

  try {

    const {
      nombre,
      categoria_id
    } = req.body;

    // VALIDAR

    if (
      !nombre ||
      !categoria_id
    ) {

      return res.status(400).json({

        error:
          'Faltan datos'
      });
    }

    // INSERTAR

    const result =
      await db.query(

        `
        INSERT INTO animes

        (
          nombre,
          categoria_id
        )

        VALUES ($1, $2)

        RETURNING *
        `,

        [
          nombre,
          categoria_id
        ]
      );

    res.json({

      message:
        'Anime creado',

      anime:
        result.rows[0]
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error creando anime'
    });
  }
});

module.exports = router;