import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { analyzeDiaryEntry } from "./template/src/api/analyze.ts";

dotenv.config();

const app: express.Express = express();
app.use(cors());
app.use(express.json());

type DiaryLog = {
  entryId: string;
  text: string;
  response_text: string;
  timestamp: number;
};

const diaryLogs: DiaryLog[] = [];
app.post("/api/analyze", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing diary text" });

  try {
    const result = await analyzeDiaryEntry(text);
    diaryLogs.push({
      entryId: result.entryId,
      text,
      response_text: result.response_text,
      timestamp: Date.now(),
    });
    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
  }
});
app.get("/api/logs", (req, res) => {
  res.json({ logs: diaryLogs });
});
app.listen(5174, () => {
  console.log("Server is running on http://localhost:5173");
});
