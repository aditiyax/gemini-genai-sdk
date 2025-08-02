require("dotenv").config();
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable not set.");
}

const genAI = new GoogleGenAI({ apiKey });

async function main() {
  // Make sure to include the following import:
  // import {GoogleGenAI} from '@google/genai';
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: "Write a story about a magic backpack.",
  });
  let text = "";
  for await (const chunk of response) {
    console.log(chunk.text);
    text += chunk.text;
  }
}

main();
