const app = require('express')();

app.get('/api', (req, res) =>
    res.json({ message: 'Docker setup'})
);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`app listening on http://localhost:${port}`))