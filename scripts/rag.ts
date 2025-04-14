import fs from "fs";
import path from "path";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings } from "@langchain/openai";

async function run() {
  const raw = fs.readFileSync("logs.txt", "utf-8");

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const docs = await splitter.createDocuments([raw]);

  const persistDirectory = path.join(__dirname, "../.vectorstore");

  const vectorStore = await Chroma.fromDocuments(docs, new OpenAIEmbeddings(), {
    collectionName: "logs",
    //url: "http://localhost:8000", // only if using Chroma server
    collectionMetadata: { source: "logs.txt" },
    persistDirectory,
  } as any);

  console.log("✅ Embedding & persistence complete");
}

run();
