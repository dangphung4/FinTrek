const router = require('express').Router();

router.get('/', (req, res) =>
    res.json({ message: 'Docker setup. @root'})
);

module.exports = router;