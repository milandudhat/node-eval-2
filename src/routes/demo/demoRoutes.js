const express = require('express');
const demoContoller = require('../../controllers/demo/demoContoller');

const router = express.Router();

const EventEmitter = require('events');

const eventEmitter = new EventEmitter();




router.get('/', demoContoller.demo);
router.post('/', demoContoller.addDemo);
router.put('/', demoContoller.updateDemo);
router.delete('/', demoContoller.deleteDemo);

module.exports = router;