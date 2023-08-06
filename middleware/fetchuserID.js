const jwt = require("jsonwebtoken");

const fetchUserID = async (request, response, next) => {
  const token = request.header("auth-token");
  if (!token) {
    return response.status(401).send({
      error:
        "please cigerette ki dabi ka barcode nahein chalega, proper token do!",
    });
  }

  try {
    const data = jwt.verify(token, "secretkey");
    request.user = data.user;
    next();
  } catch (error) {
    response.status(401).send({
      error:
        "please cigerette ki dabi ka barcode nahein chalega, proper token do!",
    });
  }
};

module.exports = fetchUserID;
