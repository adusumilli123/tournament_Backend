import express from "express";
var cors = require('cors')
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config();

import tournamentsRouter from "./routes/tournaments.route.js";
import participantsRouter from "./routes/participants.route.js";

const app = express();
app.use(express.json());
app.use(cors())
export var client = new MongoClient(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

try {
  await client.connect();
  console.log("mongo connected");
} catch (error) {
  console.error(error.message)
} finally {
  await client.close();
}

app.listen(process.env.PORT, () =>
  console.log("app started on PORT", process.env.PORT || 3000)
);
app.get("/", function (request, response) {
  response.send(
    ` welcome to Tournament API, refer "https://github.com/11m245/tournament_Backend"`
  );
});
app.use("/tournaments", tournamentsRouter);
app.use("/participants", participantsRouter);
