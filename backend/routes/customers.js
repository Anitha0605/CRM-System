const express = require('express');
const router = express.Router();
const {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

router
  .route('/')
  .get(getAllCustomers)
  .post(createCustomer);

router
  .route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;
