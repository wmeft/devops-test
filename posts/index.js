const express = require("express");
const { randomBytes } = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };

  await axios.post("http://svc-event-bus/events", {
    type: "PostCreated",
    data: posts[id],
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  console.log("recieved event:", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("V60");
  console.log("Listening on http://localhost:4000");
});
