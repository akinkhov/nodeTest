import express from "express";
import route from './route.js'

const app = express();
const port = 3000;

app.use(express.json());
route(app);

app.listen(port, function () {
    console.log(`App listening on port:${port}!`);
});