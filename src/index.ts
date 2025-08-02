require("dotenv").config();
import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt, REACT_BLRPT_PROMPT } from "./prompts";
import express from "express";
import { reactBasePrompt } from "./defaults/react";
import { nodeBasePrompt } from "./defaults/node";

const app = express();
app.use(express.json());
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/template", async (req, res) => {
  const prompt = req.body.prompt;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      systemInstruction:
        "Analyze the content prompt, and Return only a single word, either node or react or notSupported, based on what you think this project should be ",
      maxOutputTokens: 500,
    },
  });

  const answer = response.text; //react or node
  if (answer == "react") {
    console.log("REACT project received");
    res.json({
      prompts: [REACT_BLRPT_PROMPT, reactBasePrompt],
    });
    return;
  } else if (answer == "node") {
    console.log("NODE project received");
    res.json({
      prompts: [nodeBasePrompt],
    });
    return;
  } else {
    console.log("NOT_SUPPORTED received");
    res.status(403).json({
      message:
        "Code Language Not Supported, Pls provide 'react' or 'node' code! ",
    });
    return;
  }
});

app.listen(3000);
console.log(`Server Running on 'http://localhost:3000' `);

async function main() {
  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: "Write a story about a magic backpack.",
    config: {
      systemInstruction: getSystemPrompt(),
      maxOutputTokens: 4025,
    },
  });
  let text = "";
  for await (const chunk of response) {
    console.log(chunk.text);
    text += chunk.text;
  }
}

// main();
