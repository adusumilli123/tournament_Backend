import express from "express";
import { verifyLoginToken } from "../middlewares/verifyLoginToken.js";
import {
  addTournament,
  checkTournamentExist,
  deleteTournament,
  getAllTournaments,
  getFilteredTournaments,
  isTournamentAlreadyExistById,
  updateTournament,
} from "../services/tournaments.service.js";
const router = express.Router();

router.get("/all", verifyLoginToken, async function (request, response) {
  try {
    const allTournaments = await getAllTournaments();
    // console.log("tournaments, ", allTournaments);
    response.send({ message: "fetched", payload: allTournaments });
  } catch (err) {
    // console.log("error in getAllTournaments, ", err);
    response.status(500).send({ message: "not fetched" });
  }
});

router.get("/filtered", verifyLoginToken, async function (request, response) {
  try {
    const { start, end } = request.headers;
    const filteredTournaments = await getFilteredTournaments(
      parseFloat(start),
      parseFloat(end)
    );
    // console.log("filtered tournaments, ", filteredTournaments);
    response.send({
      message: "filtered tournaments fetched",
      payload: filteredTournaments,
    });
  } catch (err) {
    // console.log("error in getFilteredTournaments, ", err);
    response.status(500).send({ message: "not fetched" });
  }
});

router.post("/new", verifyLoginToken, async function (request, response) {
  try {
    const newData = request.body;
    // console.log("new Data, ", newData);
    const isTournamentAlreadyExistRes = await checkTournamentExist({
      name: newData.name,
      start: newData.start,
      end: newData.end,
    });
    if (isTournamentAlreadyExistRes) {
      // console.log("res", isTournamentAlreadyExistRes);
      response.status(400).send({
        message: "tournament with same name,duration already exist",
        payload: isTournamentAlreadyExistRes,
      });
    } else {
      const formattedTournamentData = {
        ...newData,
        createdAt: Date.now(),
        modifiedAt: "",
      };
      const addTournamentRes = await addTournament(formattedTournamentData);
      response.send({ message: "added", payload: addTournamentRes });
    }
  } catch (err) {
    // console.log("error in addition of new Tournament, ", err);
    response.status(500).send({ message: err.message });
  }
});

export function generateModifyObj(modifiableFields, newData) {
  const currentFields = modifiableFields.filter((field) =>
    Object.keys(newData).includes(field)
  );
  // console.log("current fields", currentFields);
  const modifyObj = {};
  currentFields.forEach((field) => {
    modifyObj[field] = newData[field];
  });

  return modifyObj;
}

router.put("/update", verifyLoginToken, async function (request, response) {
  try {
    const newData = request.body;
    const { tournamentId, ...newDataWOId } = newData;
    // console.log("new Body Data to modify, ", newData);
    // console.log("new Data to WO ID, ", newDataWOId);

    const modifiableFields = ["name", "start", "end", "status"];
    // const currentFields = modifiableFields.filter((field) =>
    //   Object.keys(newData).includes(field)
    // );
    // console.log("current fields", currentFields);
    // const modifyObj = {};
    // currentFields.forEach((field) => {
    //   modifyObj[field] = newData[field];
    // });

    // console.log("modify obj is", modifyObj);

    const modifyObj = generateModifyObj(modifiableFields, newData);

    const isTournamentAlreadyExistRes = await isTournamentAlreadyExistById(
      newData.tournamentId
    );
    // console.log("already exist by id", isTournamentAlreadyExistRes);
    if (isTournamentAlreadyExistRes) {
      const updateTournamentRes = await updateTournament(
        tournamentId,
        modifyObj
      );

      // console.log("update tournament Result", updateTournamentRes);
      if (updateTournamentRes.modifiedCount === 1) {
        response.send({
          message: `tournament updated`,
        });
      } else {
        response.status(400).send({
          message: `tournament not updated`,
        });
      }
    } else {
      response.status(400).send({
        message: `tournament with id ${newData.tournamentId} NOT exist`,
      });
    }
  } catch (err) {
    // console.log("error in modification of Tournament, ", err);
    response.status(500).send({ message: err });
  }
});

router.delete("/delete", verifyLoginToken, async function (request, response) {
  try {
    const newData = request.body;
    const { tournamentId } = newData;
    // console.log("new Body Data to delete, ", newData);
    // console.log("tournament ID, ", tournamentId);

    const isTournamentAlreadyExitRes = await isTournamentAlreadyExistById(
      tournamentId
    );
    // console.log("already exist by id", isTournamentAlreadyExitRes);
    if (isTournamentAlreadyExitRes) {
      const deleteTournamentRes = await deleteTournament(tournamentId);

      // console.log("delete tournament Result", deleteTournamentRes);
      if (deleteTournamentRes.deletedCount === 1) {
        response.send({
          message: `tournament deleted`,
        });
      } else {
        response.status(400).send({
          message: `tournament not deleted`,
        });
      }
    } else {
      response.status(400).send({
        message: `tournament with id ${newData.tournamentId} NOT exist`,
      });
    }
  } catch (err) {
    // console.log("error in deletion of Tournament, ", err);
    response.status(500).send({ message: err.message });
  }
});

export default router;
