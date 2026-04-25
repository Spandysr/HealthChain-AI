import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import api from './api';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5001);

app.use(cors());
app.use(express.json());

app.use('/api', api);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
