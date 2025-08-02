"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const genai_1 = require("@google/genai");
const prompts_1 = require("./prompts");
const express_1 = __importDefault(require("express"));
const react_1 = require("./defaults/react");
const node_1 = require("./defaults/node");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = req.body.prompt;
    const response = yield ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "Analyze the content prompt, and Return only a single word, either node or react or notSupported, based on what you think this project should be ",
            maxOutputTokens: 500,
        },
    });
    const answer = response.text; //react or node
    if (answer == "react") {
        console.log("REACT project received");
        res.json({
            prompts: [prompts_1.REACT_BLRPT_PROMPT, react_1.reactBasePrompt],
        });
        return;
    }
    else if (answer == "node") {
        console.log("NODE project received");
        res.json({
            prompts: [node_1.nodeBasePrompt],
        });
        return;
    }
    else {
        console.log("NOT_SUPPORTED received");
        res.status(403).json({
            message: "Code Language Not Supported, Pls provide 'react' or 'node' code! ",
        });
        return;
    }
}));
app.listen(3000);
console.log(`Server Running on {http://localhost:3000}`);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, e_1, _b, _c;
        const response = yield ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: "Write a story about a magic backpack.",
            config: {
                systemInstruction: (0, prompts_1.getSystemPrompt)(),
                maxOutputTokens: 4025,
            },
        });
        let text = "";
        try {
            for (var _d = true, response_1 = __asyncValues(response), response_1_1; response_1_1 = yield response_1.next(), _a = response_1_1.done, !_a; _d = true) {
                _c = response_1_1.value;
                _d = false;
                const chunk = _c;
                console.log(chunk.text);
                text += chunk.text;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = response_1.return)) yield _b.call(response_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
// main();
