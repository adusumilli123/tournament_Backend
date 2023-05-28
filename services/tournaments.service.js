import { ObjectId } from "mongodb";
import { client } from "../index.js";
export async function getAllTournaments() {
  return await client
    .db("tournamentApp")
    .collection("tournaments")
    .find({})
    .toArray();
}

export async function getFilteredTournaments(startDate, endDate) {
  return await client
    .db("tournamentApp")
    .collection("tournaments")
    .find({
      $and: [{ start: { $gte: startDate } }, { start: { $lte: endDate } }],
    })
    .toArray();
}

export async function addTournament(newTournament) {
  return await client
    .db("tournamentApp")
    .collection("tournaments")
    .insertOne(newTournament);
}

export async function checkTournamentExist(data) {
  return await client
    .db("tournamentApp")
    .collection("tournaments")
    .findOne(data);
}

export async function isTournamentAlreadyExistById(id) {
  return await client
    .db("tournamentApp")
    .collection("tournaments")
    .findOne({ _id: new ObjectId(id) });
}

export async function updateTournament(id, modifyObj) {
  return await client
    .db("tournamentApp")
    .collection("tournaments")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...modifyObj, modifiedAt: Date.now() } }
    );
}

export async function deleteTournament(id) {
  return await client
    .db("tournamentApp")
    .collection("tournaments")
    .deleteOne({ _id: new ObjectId(id) });
}
