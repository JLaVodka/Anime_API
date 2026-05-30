const createGenericRouter = require('./genericRouter');

/**
 * @swagger
 * /api/saintseiya:
 *   get:
 *     summary: Obtener todos los personajes de Saint Seiya
 *     tags: [SaintSeiya]
 *     responses:
 *       200:
 *         description: Lista de personajes
 *       500:
 *         description: Error en base de datos
 * /api/saintseiya/{nombre}:
 *   get:
 *     summary: Obtener un personaje de Saint Seiya por nombre
 *     tags: [SaintSeiya]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *       404:
 *         description: Personaje no encontrado
 *       500:
 *         description: Error en base de datos
 */
module.exports = createGenericRouter('saintseiya', 'Personaje');
