import express from 'express'
import dotenv from 'dotenv';

dotenv.config();
let port = 4000;

const jokes = [
    {
        id: 1,
        joke: "Why don't scientists trust atoms? Because they make up everything!"
    },
    {
        id: 2,
        joke: "What do you get when you cross a snowman and a vampire? Frostbite."
    },
    {
        id: 3,
        joke: "Why was the math book sad? It had too many problems."
    },
    {
        id: 4,
        joke: "Why did the scarecrow win an award? Because he was outstanding in his field!"
    },
    {
        id: 5,
        joke: "What do you call fake spaghetti? An impasta!"
    }
];

const app = express();

app.get('/', (req, res) => {
    res.send('Server is ready')
})

app.get('/api/jokes', (req, res) => {
    res.json(jokes);
})

app.listen(port, () => {
    console.log(process.env.PORT)
    console.log("Server is runing on the port:", port)
})