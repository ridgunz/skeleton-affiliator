const bookController = require('../controllers/book.controller');
const router = require('express').Router();

router.post('/create', bookController.create);
router.get('/', bookController.findAll);
router.put('/:id', bookController.update);
router.delete('/:id', bookController.delete);
router.get('/:id', bookController.findOne);

module.exports = router;