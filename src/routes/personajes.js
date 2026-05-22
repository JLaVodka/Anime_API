const express = require('express');

const router = express.Router();

const db =
  require('../db/connection');

// OBTENER PERSONAJES
router.get('/', async (req, res) => {

  try {

    const result =
      await db.query(

        `
        SELECT
          personajes.*,
          animes.nombre
          AS anime

        FROM personajes
        INNER JOIN animes
        ON personajes.anime_id =
        animes.id
        ORDER BY personajes.id
        `
      );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error obteniendo personajes'
    });
  }
});

// AGREGAR PERSONAJE
router.post('/', async (req, res) => {

  try {

    const {
      anime_id,
      nombre,
      edad,
      imagen1,
      imagen2,
      imagen3,
      imagen4
    } = req.body;

    // VALIDAR

    if (
      !anime_id ||
      !nombre ||
      !edad
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
        INSERT INTO personajes
        (
          anime_id,
          nombre,
          edad,
          imagen1,
          imagen2,
          imagen3,
          imagen4
        )

        VALUES
        ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [
          anime_id,
          nombre,
          edad,
          imagen1,
          imagen2,
          imagen3,
          imagen4
        ]
      );

    res.json({

      message:
        'Personaje agregado',

      personaje:
        result.rows[0]
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error agregando personaje'
    });
  }
});

module.exports = router;