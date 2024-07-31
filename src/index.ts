import express, { Request, Response } from 'express';
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Library Management System API!');
});

app.listen(port, () => {
    console.log(`The Server works at this http://localhost:${port} address.`);
});