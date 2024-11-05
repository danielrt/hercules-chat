const router = require('express-promise-router')();

const HerculesController = require('../controllers/hercules');

const herculesController = new HerculesController();

router.post('/executeCommand', herculesController.executeCommand);

router.post('/askHerculesAI', herculesController.askHerculesAI);

router.post('/resetChat', herculesController.resetChat);

router.post('/stt', herculesController.stt);

router.post('/tts', herculesController.tts);

router.get('/ping', function(req, res) {
    res.status(200).send({ success : 1 });
});

module.exports = router;