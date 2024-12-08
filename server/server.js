import app from "./app.js";
import mongoose from "mongoose";

mongoose
  .connect(process.env.CON_STR)
  .then((con) => {
    console.log("DB connection successful!");
  })
  .catch((error) => {
    console.log(`DB connerction ${error}`);
  });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("Server has connected!");
});
