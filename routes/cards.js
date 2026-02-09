import express from 'express';
import {
  createCard,
  getListCards,
  getBoardCards,
  getCard,
  updateCard,
  deleteCard,
  moveCard,
  reorderCards,
  getCardRecommendations
} from '../controllers/cardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - list
 *             properties:
 *               title:
 *                 type: string
 *                 example: Implement login feature
 *               description:
 *                 type: string
 *                 example: Create login form with validation
 *               list:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               position:
 *                 type: number
 *                 example: 0
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, createCard);

/**
 * @swagger
 * /api/cards/reorder:
 *   put:
 *     summary: Reorder cards
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listId
 *               - cards
 *             properties:
 *               listId:
 *                 type: string
 *               cards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     position:
 *                       type: number
 *     responses:
 *       200:
 *         description: Cards reordered successfully
 *       401:
 *         description: Not authorized
 */
router.put('/reorder', protect, reorderCards);

/**
 * @swagger
 * /api/cards/list/{listId}:
 *   get:
 *     summary: Get all cards for a list
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authorized
 */
router.get('/list/:listId', protect, getListCards);

/**
 * @swagger
 * /api/cards/board/{boardId}:
 *   get:
 *     summary: Get all cards for a board
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authorized
 */
router.get('/board/:boardId', protect, getBoardCards);

/**
 * @swagger
 * /api/cards/{id}:
 *   get:
 *     summary: Get a specific card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Card not found
 *   put:
 *     summary: Update a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               position:
 *                 type: number
 *               assignedTo:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Card not found
 *   delete:
 *     summary: Delete a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Card not found
 */
router.route('/:id')
  .get(protect, getCard)
  .put(protect, updateCard)
  .delete(protect, deleteCard);

/**
 * @swagger
 * /api/cards/{id}/recommendations:
 *   get:
 *     summary: Get AI recommendations for a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       200:
 *         description: AI recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendations:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Card not found
 */
router.get('/:id/recommendations', protect, getCardRecommendations);

/**
 * @swagger
 * /api/cards/{id}/move:
 *   put:
 *     summary: Move a card to a different list
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listId
 *             properties:
 *               listId:
 *                 type: string
 *                 description: Target list ID
 *               position:
 *                 type: number
 *                 description: Position in the new list
 *     responses:
 *       200:
 *         description: Card moved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Card or list not found
 */
router.put('/:id/move', protect, moveCard);

export default router;
