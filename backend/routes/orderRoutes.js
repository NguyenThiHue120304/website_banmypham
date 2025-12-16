const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrders, updateOrderToDelivered, getOrderById, deleteOrder } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/myorders').get(protect, getMyOrders);

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id').get(protect, getOrderById);
router.route('/:id')
    .get(protect, getOrderById)
    .delete(protect, deleteOrder);

module.exports = router;