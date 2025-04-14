import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  try {
    const res = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: [
          { role: "system", content: "You are an assistant specialized in answering questions only related to financial transactions. If a question is unrelated, say: 'I'm only able to answer transaction-related questions.'" },
          { role: "user", content: message }
        ],
        stream: true,
      }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullText = "";

    while (reader) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n").filter(Boolean);

      for (const line of lines) {
        const json = JSON.parse(line);
        fullText += json.message?.content || "";
      }
    }

    return NextResponse.json({ reply: fullText });
  } catch (err) {
    console.error("Local LLM error:", err);
    return NextResponse.json({ reply: "Error talking to local model." });
  }
}
