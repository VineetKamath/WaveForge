import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import analyzeRoute from './routes/analyze.js';
import cloudRoute from './routes/cloud.js';
import migrateRoute from './routes/migrate.js';

const app = express();
const PORT = 3001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests', code: 'RATE_LIMIT_EXCEEDED', details: null }
});

app.use('/api/', limiter);

app.use('/api/analyze', analyzeRoute);
app.use('/api/cloud-recommend', cloudRoute);
app.use('/api/migration-steps', migrateRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: err.message || 'Internal Server Error',
    code: 'INTERNAL_ERROR',
    details: null
  });
});

app.listen(PORT, () => {
  console.log(`Backend starts on port ${PORT} without errors.`);
});
