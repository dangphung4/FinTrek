require('dotenv').config();
const app = require('express')();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

app.use(cors(corsOptions));
app.use(helmet());
//allows acceptance of json and encoded urls
app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
  );
app.use(bodyParser.json());

const rootRouter = require('./routes/root');
app.use('/', rootRouter);

const supabaseRouter = require('./routes/api/setSupabaseSession');
app.use('/api/set_supabase_session', supabaseRouter)

const apiCreateLinkTokenRouter = require('./routes/api/createLinkToken');
app.use('/api/create_link_token', apiCreateLinkTokenRouter);

const apiSetAccessTokenRouter = require('./routes/api/setAccessToken');
app.use('/api/set_access_token', apiSetAccessTokenRouter);

const apiCreateUserToken = require('./routes/api/createUserToken');
app.use('/api/create_user_token', apiCreateUserToken);

const apiInfo = require('./routes/api/info');
app.use('/api/info', apiInfo);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  }).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
  });
  
// Graceful shutdown handling
const shutdown = async () => {
  console.log('Shutting down server...');
  await new Promise((resolve) => server.close(resolve));
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);