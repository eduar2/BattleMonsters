import express from 'express';
import router from './router';

const app = express();

app.disable('etag');
app.use(express.json());
app.use(router);
console.log("1")
export default app;
