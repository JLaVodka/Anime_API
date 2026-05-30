const createGenericRouter = require('./genericRouter');

/**
 * @swagger
 * /api/onepiece:
 *   get:
 *     summary: Obtener todos los personajes de One Piece
 *     tags: [OnePiece]
 *     responses:
 *       200:
 *         description: Lista de personajes
 *       500:
 *         description: Error en base de datos
 * /api/onepiece/{nombre}:
 *   get:
 *     summary: Obtener un personaje de One Piece por nombre
 *     tags: [OnePiece]
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
module.exports = createGenericRouter('onepiece', 'Personaje');
