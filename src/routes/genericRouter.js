const express = require('express');
const db = require('../db/connection');

const createGenericRouter = (tabla, entidad, rutaBase) => {
  const router = express.Router();

  /**
   * @swagger
   * /api/{rutaBase}:
   *   get:
   *     summary: Obtener todos los {entidad}
   *     tags: [{entidad}]
   *     responses:
   *       200:
   *         description: Lista de {entidad}
   *       500:
   *         description: Error en base de datos
   */
  router.get('/', async (req, res) => {
    try {
      const result = await db.query(`SELECT * FROM ${tabla}`);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en base de datos' });
    }
  });

  /**
   * @swagger
   * /api/{rutaBase}/{nombre}:
   *   get:
   *     summary: Obtener un {entidad} por nombre
   *     tags: [{entidad}]
   *     parameters:
   *       - in: path
   *         name: nombre
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: {entidad} encontrado
   *       404:
   *         description: {entidad} no encontrado
   *       500:
   *         description: Error en base de datos
   */
  router.get('/:nombre', async (req, res) => {
    const nombre = req.params.nombre.toLowerCase();
    try {
      const result = await db.query(
        `SELECT * FROM ${tabla} WHERE nombre = $1`,
        [nombre]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: `${entidad} no encontrado` });
      }
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en base de datos' });
    }
  });

  return router;
};

module.exports = createGenericRouter;
