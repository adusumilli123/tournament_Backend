import express from "express";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

import tournamentsRouter from "./routes/tournaments.route.js";
import participantsRouter from "./routes/participants.route.js";

const app = express();
app.use(express.json());

export const client = new MongoClient(process.env.MONGO_URL);
await client.connect();
console.log("mongo connected");

app.listen(process.env.PORT, () =>
  console.log("app started on PORT", process.env.PORT)
);
app.get("/", function (request, response) {
  response.send("welcome to Tournament API");
});
app.use("/tournaments", tournamentsRouter);
app.use("/participants", participantsRouter);
