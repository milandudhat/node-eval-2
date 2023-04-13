const express = require('express');
const demoContoller = require('../../controllers/demo/demoContoller');

const router = express.Router();

const EventEmitter = require('events');

const eventEmitter = new EventEmitter();





router.get('/', demoContoller.getData);
router.post('/', demoContoller.addData);
router.put('/', demoContoller.updateData);
router.delete('/', demoContoller.deleteData);

module.exports = router;