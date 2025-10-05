import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { getData } from "../data/jsonHelper.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

const ALLOWED_ORIGIN = "";

export default function initExpress() {
  console.log("Initializing API...");

  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin !== ALLOWED_ORIGIN) {
      return res.status(403).json({ error: "Forbidden." });
    }

    const key = req.headers["x-api-key"];

    if (!key || key !== process.env.GUI_KEY) {
      return res.status(403).json({ error: "Unauthorized access." });
    }

    next();
  });

  app.get("/api/users", (req, res) => {
    res.json({
      number: Object.keys(getData()).length,
    });
  });

  app.get("/api/users/:username", (req, res) => {
    const { username } = req.params;
    const { type } = req.query;

    const data = getData();
    const user = data[username];

    console.log(`Fetching ${username}..`);

    if (!user) return res.status(404).json({ error: "User is not found." });

    if (type) {
      if (!user[type])
        return res.status(404).json({ error: `Type '${type}' not found. ` });

      return res.json({ [type]: user[type] });
    }

    res.json(user);
  });

  app.listen(PORT, () =>
    console.log(`Opened Express API Server running on port ${PORT}`)
  );
}
