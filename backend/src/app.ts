import express from 'express';
import userRoutes from './routes/user.routes';
import bodyParser from 'body-parser';

const app = express();

app.use(express.json());
app.use('/api', userRoutes);
app.use(bodyParser.json());

export default app;
