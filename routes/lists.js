import express from 'express';
import {
  createList,
  getBoardLists,
  getList,
  updateList,
  deleteList,
  reorderLists
} from '../controllers/listController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Create a new list
 *     tags: [Lists]
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
 *               - board
 *             properties:
 *               title:
 *                 type: string
 *                 example: To Do
 *               board:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               position:
 *                 type: number
 *                 example: 0
 *     responses:
 *       201:
 *         description: List created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Not authorized
 */
router.post('/', protect, createList);

/**
 * @swagger
 * /api/lists/reorder:
 *   put:
 *     summary: Reorder lists
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - boardId
 *               - lists
 *             properties:
 *               boardId:
 *                 type: string
 *               lists:
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
 *         description: Lists reordered successfully
 *       401:
 *         description: Not authorized
 */
router.put('/reorder', protect, reorderLists);

/**
 * @swagger
 * /api/lists/board/{boardId}:
 *   get:
 *     summary: Get all lists for a board
 *     tags: [Lists]
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
 *         description: List of lists
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/List'
 *       401:
 *         description: Not authorized
 */
router.get('/board/:boardId', protect, getBoardLists);

/**
 * @swagger
 * /api/lists/{id}:
 *   get:
 *     summary: Get a specific list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     responses:
 *       200:
 *         description: List details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: List not found
 *   put:
 *     summary: Update a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               position:
 *                 type: number
 *     responses:
 *       200:
 *         description: List updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/List'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: List not found
 *   delete:
 *     summary: Delete a list
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: List ID
 *     responses:
 *       200:
 *         description: List deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: List not found
 */
router.route('/:id')
  .get(protect, getList)
  .put(protect, updateList)
  .delete(protect, deleteList);

export default router;
