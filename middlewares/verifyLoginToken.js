function verifyLoginToken(request, response, next) {
  try {
    const { logintoken } = request.headers;
    // console.log("loginToken", logintoken);
    if (logintoken === "demotoken") {
      // console.log("token Verified");
      next();
    } else {
      // console.log("token invalid");
      response.status(401).send({ message: "Unauthorised Usage" });
    }
  } catch (err) {
    response.status(401).send({ message: err.message });
  }
}

export { verifyLoginToken };
