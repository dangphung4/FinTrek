const router = require('express').Router();

router.get('/', (req, res) =>
    res.json({ message: 'Docker setup. @root'})
);

router.get('/health', async (req, res) => {
        try {
            // TODO: Add Plaid client health check
            const status = {
                status: 'healthy',
                timestamp: new Date().toISOString(),
                services: {
                    api: 'healthy',
                    plaid: 'unknown' // To be implemented with Plaid client check
                }
            };
            res.status(200).json(status);
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Health check failed',
                timestamp: new Date().toISOString()
            });
        }
    });

module.exports = router;