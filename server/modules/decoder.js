var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("../firebase-service-account.json"),
  databaseURL: "https://christian-cupboard.firebaseio.com"
});
