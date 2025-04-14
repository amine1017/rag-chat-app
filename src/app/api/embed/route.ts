import fs from "fs";
import { pinecone } from "@/lib/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const raw = fs.readFileSync("scripts/logs.txt", "utf-8");

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });

    const docs = await splitter.createDocuments([raw]);

    const pineconeIndex = pinecone.Index("logs"); // must exist in Pinecone console

    await PineconeStore.fromDocuments(docs, new OpenAIEmbeddings({
      modelName: "text-embedding-3-small",
    }), {
      pineconeIndex,
      namespace: "transaction-logs",
    });

    return NextResponse.json({ status: "ok", message: "Pinecone embed complete" });
  } catch (err:any) {
    console.error(err);
    return NextResponse.json({ status: "error", message: err.message }, { status: 500 });
  }
}
