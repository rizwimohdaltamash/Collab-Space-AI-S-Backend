import express from 'express';
import {
  createBoard,
  getUserBoards,
  getBoard,
  updateBoard,
  deleteBoard,
  addMember,
  inviteUser,
  acceptInvite,
  getBoardInvites,
  getCardRecommendationsInBoard
} from '../controllers/boardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: Create a new board
 *     tags: [Boards]
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
 *             properties:
 *               title:
 *                 type: string
 *                 example: My Project Board
 *               description:
 *                 type: string
 *                 example: Board for managing project tasks
 *     responses:
 *       201:
 *         description: Board created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       401:
 *         description: Not authorized
 *   get:
 *     summary: Get all boards for the current user
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of boards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Board'
 *       401:
 *         description: Not authorized
 */
router.route('/')
  .post(protect, createBoard)
  .get(protect, getUserBoards);

/**
 * @swagger
 * /api/boards/accept-invite/{token}:
 *   post:
 *     summary: Accept board invitation
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Invitation token
 *     responses:
 *       200:
 *         description: Invitation accepted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Invalid or expired invitation
 */
router.post('/accept-invite/:token', protect, acceptInvite);

/**
 * @swagger
 * /api/boards/{id}:
 *   get:
 *     summary: Get a specific board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Board details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Board not found
 *   put:
 *     summary: Update a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
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
 *     responses:
 *       200:
 *         description: Board updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Board'
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Board not found
 *   delete:
 *     summary: Delete a board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     responses:
 *       200:
 *         description: Board deleted successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Board not found
 */
router.route('/:id')
  .get(protect, getBoard)
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

/**
 * @swagger
 * /api/boards/{id}/members:
 *   post:
 *     summary: Add a member to board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member added successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Board not found
 */
router.post('/:id/members', protect, addMember);

/**
 * @swagger
 * /api/boards/{id}/invite:
 *   post:
 *     summary: Invite user to board
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Invitation sent successfully
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Board not found
 */
router.post('/:id/invite', protect, inviteUser);

/**
 * @swagger
 * /api/boards/{id}/invites:
 *   get:
 *     summary: Get board invitations
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *     responses:
 *       200:
 *         description: List of invitations
 *       401:
 *         description: Not authorized
 *       404:
 *         description: Board not found
 */
router.get('/:id/invites', protect, getBoardInvites);

/**
 * @swagger
 * /api/boards/{id}/cards/{cardId}/recommendations:
 *   get:
 *     summary: Get AI recommendations for a card
 *     tags: [Boards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Board ID
 *       - in: path
 *         name: cardId
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
 *         description: Board or card not found
 */
router.get('/:id/cards/:cardId/recommendations', protect, getCardRecommendationsInBoard);

export default router;
