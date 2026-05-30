const createGenericRouter = require('./genericRouter');

/**
 * @swagger
 * /api/pokemon:
 *   get:
 *     summary: Obtener todos los pokemon
 *     tags: [Pokemon]
 *     responses:
 *       200:
 *         description: Lista de pokemon
 *       500:
 *         description: Error en base de datos
 * /api/pokemon/{nombre}:
 *   get:
 *     summary: Obtener un pokemon por nombre
 *     tags: [Pokemon]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pokemon encontrado
 *       404:
 *         description: Pokemon no encontrado
 *       500:
 *         description: Error en base de datos
 */
module.exports = createGenericRouter('pokemon', 'Pokemon');
