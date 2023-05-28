# Tournament App

Using this Backend application, Tournament Management Persons can

- Get All Tournaments
- Get Filtered Tournaments within the user input dates range
- Add Tournament
- Update the tournament details
- Delete Tournament
- Add Participant to a Tournament
- Update a Tournament Participant Details
- Delete a Tournament Participant
- Get All Participants of a Tournament

## NOTE

send all requests with headers, {logintoken : "demotoken" }\
for dates use GMT epoch of milliseconds

## End Point Queries

- **Get All Tournaments**

  - END POINT -> "tournaments/all"
  - send GET request with headers data format {logintoken:"demotoken"}

  - response will contain all tournaments if exist

- **Filter Tournaments**

  - END POINT -> "tournaments/filtered"
  - send GET request with headers data format {logintoken:"demotoken",start:epochStartDateInMilliSeconds,end:epochEndDateInMilliSeconds}

  - response will contain the tournaments which are starting in between these dates range if exist

- **Add Tournament**

  - END POINT -> "tournaments/new"
  - send POST request with body tournament data format
    - {"name":"first Tournament", "start":1684540800000, "end":1685059199999,"status":"pending" }

- **Update the tournament details**

  - END POINT -> "tournaments/new"
  - send PUT request with body tournament data format
    - {"tournamentId":"6472262c213ba7b016fbd404", "modifyField1":"modifyFieldValue","modifyField2":"modifyFieldValue"}

- **Delete Tournament**

  - END POINT -> "tournaments/delete"
  - send a DELETE request with the body data format
    - {"tournamentId":"6471937841ace1afcc2abeb5" }

- **Add Participant to a Tournament**

  - END POINT -> "participants/new"
  - send a POST request with the body data format
    - {"tournamentId":"647226ab4a86286c0537e6de","name":"Sivaraj M","dob":770774400000,"gender":"male","aadhaarNo":"867794863822"}

- **Update a Tournament Participant Details**

  - END POINT -> "participants/update"
  - send a PUT request with the body data format

    - {"tournamentId":"647226ab4a86286c0537e6de","participantId":"64723d6b559e06e1f7a90c65","aadhaarNo":"modifyFieldValue1","dob":"modifyFieldValue2","name":"modifyFieldValue3"}

- **Delete a Tournament Participant**

  - END POINT -> "participants/delete"
  - send a DELETE request with the body data format

    - {"participantId":"64723df0559e06e1f7a90c66" }

- **Get All Participants of a Tournament**

  - END POINT -> "participants/tournamentParticipants"
  - send a GET request with the headers data format
    - {"logintoken":"demotoken","tournamentId":"647226ab4a86286c0537e6de"}
