import express, { Express } from "express";
import { save, list, load, update } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
//app.get("/api/dummy", dummy);  // TODO: REMOVE
app.get("/api/list", list)
app.post("/api/save", save)
app.get("/api/load", load)
app.post("/api/update", update)

app.listen(port, () => console.log(`Server listening on ${port}`));
