const createGenericRouter = require('./genericRouter');

/**
 * @swagger
 * /api/hunter:
 *   get:
 *     summary: Obtener todos los personajes de Hunter x Hunter
 *     tags: [HunterxHunter]
 *     responses:
 *       200:
 *         description: Lista de personajes
 *       500:
 *         description: Error en base de datos
 * /api/hunter/{nombre}:
 *   get:
 *     summary: Obtener un personaje de Hunter x Hunter por nombre
 *     tags: [HunterxHunter]
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
module.exports = createGenericRouter('hunterxhunter', 'Personaje');
