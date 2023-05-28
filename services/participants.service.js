import { ObjectId } from "mongodb";
import { client } from "../index.js";

export async function isParticipantAlreadyExistInTournament(data) {
  return await client
    .db("tournamentApp")
    .collection("participants")
    .findOne({
      tournamentId: new ObjectId(data.tournamentId),
      aadhaarNo: data.aadhaarNo,
    });
}

export async function addParticipant(data) {
  return await client
    .db("tournamentApp")
    .collection("participants")
    .insertOne({
      tournamentId: new ObjectId(data.tournamentId),
      aadhaarNo: data.aadhaarNo,
      name: data.name,
      dob: data.dob,
      gender: data.gender,
      createdAt: Date.now(),
      modifiedAt: "",
    });
}

export async function checkParticipantExistInTournament(
  tournamentId,
  participantId
) {
  return await client
    .db("tournamentApp")
    .collection("participants")
    .findOne({
      tournamentId: new ObjectId(tournamentId),
      _id: new ObjectId(participantId),
    });
}

export async function updateParticipant(
  tournamentId,
  participantId,
  modifyObj
) {
  return await client
    .db("tournamentApp")
    .collection("participants")
    .updateOne(
      {
        tournamentId: new ObjectId(tournamentId),
        _id: new ObjectId(participantId),
      },
      { $set: { ...modifyObj, modifiedAt: Date.now() } }
    );
}

export async function isParticipantAlreadyExistById(participantId) {
  return await client
    .db("tournamentApp")
    .collection("participants")
    .findOne({
      _id: new ObjectId(participantId),
    });
}

export async function deleteParticipant(participantId) {
  return await client
    .db("tournamentApp")
    .collection("participants")
    .deleteOne({
      _id: new ObjectId(participantId),
    });
}

export async function getTournamentParticipants(torunamentId) {
  return await client
    .db("tournamentApp")
    .collection("participants")
    .find({
      tournamentId: new ObjectId(torunamentId),
    })
    .toArray();
}
