const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const router = express.Router();

const db =
  require('../db/connection');

// ===================================
// REGISTER
// ===================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary:
 *       Registrar usuario
 */
router.post('/register', async (req, res) => {

  try {

    const {
      nombre,
      correo,
      password
    } = req.body;

    // VALIDACIONES

    if (
      !nombre ||
      !correo ||
      !password
    ) {

      return res.status(400).json({

        error:
          'Todos los campos son obligatorios'
      });
    }

    // VERIFICAR SI YA EXISTE

    const userExists =
      await db.query(

        'SELECT * FROM usuarios WHERE correo = $1',

        [correo]
      );

    if (userExists.rows.length > 0) {

      return res.status(400).json({

        error:
          'El usuario ya existe'
      });
    }

    // ENCRIPTAR PASSWORD

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // INSERTAR USUARIO

    const result =
      await db.query(

        `
        INSERT INTO usuarios
        (nombre, correo, password)

        VALUES ($1, $2, $3)

        RETURNING id, nombre, correo
        `,

        [
          nombre,
          correo,
          hashedPassword
        ]
      );

    res.status(201).json({

      message:
        'Usuario registrado',

      usuario:
        result.rows[0]
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error del servidor'
    });
  }
});

// ===================================
// LOGIN
// ===================================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary:
 *       Login usuario
 */
router.post('/login', async (req, res) => {

  try {

    const {
      correo,
      password
    } = req.body;

    // VALIDAR

    const result =
      await db.query(

        'SELECT * FROM usuarios WHERE correo = $1',

        [correo]
      );

    if (result.rows.length === 0) {

      return res.status(404).json({

        error:
          'Usuario no encontrado'
      });
    }

    const usuario =
      result.rows[0];

    // COMPARAR PASSWORD

    const validPassword =
      await bcrypt.compare(

        password,
        usuario.password
      );

    if (!validPassword) {

      return res.status(401).json({

        error:
          'Password incorrecto'
      });
    }

    // GENERAR JWT

    const token =
      jwt.sign(

        {
          id: usuario.id,
          correo: usuario.correo
        },

        process.env.JWT_SECRET,

        {
          expiresIn: '24h'
        }
      );

    res.json({

      message:
        'Login correcto',

      token,

      usuario: {

        id: usuario.id,

        nombre: usuario.nombre,

        correo: usuario.correo
      }
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      error:
        'Error del servidor'
    });
  }
});

module.exports = router;