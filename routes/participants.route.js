import express from "express";
import { verifyLoginToken } from "../middlewares/verifyLoginToken.js";
import { isTournamentAlreadyExistById } from "../services/tournaments.service.js";
import {
  addParticipant,
  checkParticipantExistInTournament,
  deleteParticipant,
  getTournamentParticipants,
  isParticipantAlreadyExistById,
  isParticipantAlreadyExistInTournament,
  updateParticipant,
} from "../services/participants.service.js";
import { generateModifyObj } from "./tournaments.route.js";
const router = express.Router();

router.use(verifyLoginToken);

router.post("/new", async function (request, response) {
  try {
    const newData = request.body;
    // console.log("new Participant Data, ", newData);

    const isTournamentAlreadyExistRes = await isTournamentAlreadyExistById(
      newData.tournamentId
    );
    // console.log("tournament exist by id", isTournamentAlreadyExistRes);
    if (isTournamentAlreadyExistRes) {
      if (await isParticipantAlreadyExistInTournament(newData)) {
        response
          .status(400)
          .send({ message: "already participant exist in same tournament" });
      } else {
        const addParticipantResult = await addParticipant(newData);
        console.log("participant inserted result", addParticipantResult);
        if (addParticipantResult.insertedId) {
          response.send({
            message: `participant added`,
          });
        } else {
          response.status(500).send({
            message: `participant not added`,
          });
        }
      }
    } else {
      response.status(400).send({
        message: `tournament with id ${newData.tournamentId} NOT exist`,
      });
    }
  } catch (err) {
    // console.log("error in participant addition", err);
    response.status(500).send({ message: err.message });
  }
});

router.put("/update", async function (request, response) {
  const { tournamentId, participantId, ...user } = request.body;
  const isParticipantExist = await checkParticipantExistInTournament(
    tournamentId,
    participantId
  );
  // console.log("participantExist REsult", isParticipantExist);
  if (isParticipantExist) {
    const modifiableFields = ["name", "aadhaarNo", "dob", "gender"];
    const modifyObj = generateModifyObj(modifiableFields, user);
    // console.log("modify obj in participant modify", modifyObj);
    const updateParticipantRes = await updateParticipant(
      tournamentId,
      participantId,
      modifyObj
    );
    // console.log("updateParticipantResult", updateParticipantRes);
    if (updateParticipantRes.modifiedCount === 1) {
      response.send({ message: "participant updated" });
    } else {
      response.status(400).send({ message: "participant NOT updated" });
    }
  } else {
    response.status(400).send({
      message: `participant NOT exist in the tournament`,
    });
  }
});

router.delete("/delete", async function (request, response) {
  try {
    const { participantId } = request.body;
    // console.log("participant ID, ", participantId);
    const isParticipantAlreadyExistRes = await isParticipantAlreadyExistById(
      participantId
    );
    // console.log(
    //   "already participant exist by id",
    //   isParticipantAlreadyExistRes
    // );
    if (isParticipantAlreadyExistRes) {
      const deleteParticipantRes = await deleteParticipant(participantId);

      // console.log("delete Participant Result", deleteParticipantRes);
      if (deleteParticipantRes.deletedCount === 1) {
        response.send({
          message: `participant deleted`,
        });
      } else {
        response.status(400).send({
          message: `participant not deleted`,
        });
      }
    } else {
      response.status(400).send({
        message: `participant with id ${participantId} NOT exist`,
      });
    }
  } catch (err) {
    // console.log("error in deletion of Participant, ", err);
    response.status(500).send({ message: err.message });
  }
});

router.get("/tournamentParticipants", async function (request, response) {
  try {
    const { tournament_id: tournamentId } = request.headers;
    // console.log("tournament ID, ", tournamentId);
    const isTournamentAlreadyExistRes = await isTournamentAlreadyExistById(
      tournamentId
    );
    // console.log("already Tournament exist by id", isTournamentAlreadyExistRes);
    if (isTournamentAlreadyExistRes) {
      const getTournamentParticipantsRes = await getTournamentParticipants(
        tournamentId
      );

      // console.log(
      //   "get Tournament Participants Result",
      //   getTournamentParticipantsRes
      // );
      if (getTournamentParticipantsRes.length > 0) {
        response.send({
          message: `Tournament Participants Fetched`,
          payload: getTournamentParticipantsRes,
        });
      } else {
        response.send({
          message: `Tournament Participants are not exist`,
        });
      }
    } else {
      response.status(400).send({
        message: `tournament with id ${tournamentId} NOT exist`,
      });
    }
  } catch (err) {
    // console.log("error in get of Tournament Participant, ", err);
    response.status(500).send({ message: err.message });
  }
});
export default router;
