
import express from 'express';

const router = express.Router();

// GET / -> mounted at /check in server
router.get('/', (req, res) => {
    res.json({
        name: 'A certain User',
        password: 'ah well',
    });
});

export default router;


