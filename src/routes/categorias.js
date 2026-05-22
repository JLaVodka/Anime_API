const express = require('express');

const router = express.Router();

const db =
  require('../db/connection');

// ============================
// GET CATEGORIAS
// ============================

router.get('/', async (req, res) => {

  try {

    const result =
      await db.query(

        'SELECT * FROM categorias ORDER BY id'
      );

    res.json(result.rows);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error servidor'
    });
  }
});

// ============================
// POST CATEGORIA
// ============================

router.post('/', async (req, res) => {

  try {

    const { nombre } = req.body;

    const result =
      await db.query(

        `
        INSERT INTO categorias
        (nombre)

        VALUES ($1)

        RETURNING *
        `,

        [nombre]
      );

    res.json(result.rows[0]);

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error servidor'
    });
  }
});

module.exports = router;