const jwt = require('jsonwebtoken');

const authMiddleware = (

  req,
  res,
  next

) => {

  try {

    const authHeader =
      req.headers.authorization;

    // VALIDAR TOKEN

    if (!authHeader) {

      return res.status(401).json({

        error:
          'Token requerido'
      });
    }

    // FORMATO:
    // Bearer TOKEN

    const token =
      authHeader.split(' ')[1];

    if (!token) {

      return res.status(401).json({

        error:
          'Token inválido'
      });
    }

    // VERIFICAR JWT

    const decoded =
      jwt.verify(

        token,
        process.env.JWT_SECRET
      );

    // GUARDAR USUARIO

    req.usuario = decoded;

    next();

  } catch (err) {

    return res.status(401).json({

      error:
        'Token inválido o expirado'
    });
  }
};

module.exports =
  authMiddleware;