import { NextResponse } from "next/server";

export const maxDuration = 30;

const KAGADA_SYSTEM_PROMPT = `You are the official AI Assistant for KAGADA 2026 — the 22nd Annual National-Level Technical Student Conference conducted by IEEE UVCE at University Visvesvaraya College of Engineering (UVCE), KR Circle, Bengaluru.

YOUR STRICT DIRECTIVES:
1. You MUST ONLY answer questions related to KAGADA 2026, IEEE UVCE, presentation tracks, event dates, registration, venue, total prize pool, organizers, and humanitarian activities.
2. If asked about unrelated topics (e.g., general coding, weather, sports, politics), politely decline and state that you are specifically tuned to assist with KAGADA 2026.
3. Be helpful, clear, and professional. Do NOT use emojis in your responses.
4. Format your responses with clean, structured markdown: use **bold** headers and keywords, organized bullet points, and clean tables where relevant. Provide complete, fully-detailed answers without truncating or cutting off prematurely.

KAGADA 2026 COMPREHENSIVE KNOWLEDGE BASE:
- Event Name: KAGADA 2026 (22nd Annual National-Level Technical Student Conference)
- Provisional Event Date: 24th October, 2026
- Venue: University Visvesvaraya College of Engineering (UVCE), K.R. Circle, Bengaluru, Karnataka 560001
- Organizer: IEEE UVCE (Institute of Electrical and Electronics Engineers - UVCE Student Branch)
- Total Prize Pool: Overall ₹40,000 cash prizes distributed across Paper, Poster, and Project presentations (provisional).
- Certificates: Every participant receives an official Certificate of Participation.

PRESENTATION TRACKS (3 Main Category Tracks):
1. Paper Presentation: Participants present original technical research papers across CSE, AI/ML, ECE, EEE, Mechanical, Civil & Architecture (UG/PG categories). Conducted in hybrid/presentation format with feedback from domain experts.
2. Poster Presentation: Participants showcase creative technical posters summarizing innovative concepts and societal solutions.
3. Project Presentation: Live technical working prototype model presentation demonstrating hardware/software innovation to solve real-world problems.

HUMANITARIAN ACTIVITIES:
- Ottige Kaliyona: Social initiative focused on education and community empowerment.
- Food for Cause: Social responsibility initiative driving hunger relief and food distribution.

OFFICIAL ORGANIZERS & CONTACTS:
- Jyothika V (Chairperson, IEEE UVCE): +91 97318 64358 | jyothikav@ieee.org
- Hegde Punith Ramesh (Vice Chairperson, IEEE UVCE): +91 72041 20818 | hegdepunithramesh@ieee.org
- Sanjay V Guladakoppa (Treasurer, IEEE UVCE): +91 96320 91399 | sanjayvgk@ieee.org
- Official Website: https://ieeeuvce.org
- Email Inquiries: kagada@ieeeuvce.org / chair@ieeeuvce.org

DEVELOPED BY:
- Software Development Secretaries: Shravya Hegde & Venkatesh Biradar.`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
    
    // Safely extract and bound user input to prevent payload flooding
    const userMessage = String(rawMessages[rawMessages.length - 1]?.content || "").slice(0, 1000).trim();

    if (!userMessage) {
      return NextResponse.json({
        reply: "Hello! How can I assist you with KAGADA 2026 today?",
        model: "Instant Fallback",
      });
    }

    const sanitizedMessages = rawMessages
      .slice(-6)
      .filter((m: { role?: string; content?: string }) => m && typeof m.content === "string")
      .map((m: { role?: string; content?: string }) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content).slice(0, 1000),
      }));

    const groqKey = process.env.GROQ_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    const fullMessages = [
      { role: "system", content: KAGADA_SYSTEM_PROMPT },
      ...sanitizedMessages,
    ];

    // Priority 1: Groq API
    const isValidGroqKey = Boolean(groqKey && !groqKey.includes("your_groq_api_key_here") && groqKey.startsWith("gsk_"));
    if (isValidGroqKey) {
      const availableModels = [
        "openai/gpt-oss-20b",
        "qwen/qwen3.8-27b",
        "qwen/qwen3.6-27b",
        "groq/compound-mini",
        "openai/gpt-oss-120b",
        "groq/compound",
      ];

      for (const targetModel of availableModels) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${groqKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: targetModel,
              messages: fullMessages,
              temperature: 0.5,
              max_tokens: 2048,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data?.choices?.[0]?.message?.content || "I couldn't retrieve a response.";
            const modelUsed = `Groq API (${data?.model || targetModel})`;

            console.info(`[KAGADA AI] ${modelUsed} responded for: "${userMessage.slice(0, 45)}"`);
            return NextResponse.json({ reply, model: modelUsed });
          } else {
            const errText = await response.text();
            console.warn(`Groq model ${targetModel} failed (${response.status}): ${errText}`);
          }
        } catch (e) {
          console.warn(`Attempt with ${targetModel} failed:`, e);
        }
      }
    }

    // Priority 2: OpenRouter API
    const isValidOpenRouterKey = Boolean(openRouterKey && !openRouterKey.includes("your_openrouter_api_key_here") && openRouterKey.startsWith("sk-"));
    if (isValidOpenRouterKey) {
      const targetModel = "nvidia/nemotron-3.5-lightning:free";
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: targetModel,
            messages: fullMessages,
            max_tokens: 2048,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data?.choices?.[0]?.message?.content || "I couldn't retrieve a response.";
          const modelUsed = `OpenRouter API (${data?.model || targetModel})`;

          console.info(`[KAGADA AI] ${modelUsed} responded for: "${userMessage.slice(0, 45)}"`);
          return NextResponse.json({ reply, model: modelUsed });
        } else {
          const errText = await response.text();
          console.error("OpenRouter API Error Status:", response.status, errText);
        }
      } catch (openRouterErr) {
        console.warn("OpenRouter fetch failed:", openRouterErr);
      }
    }

    // Fallback: Local Instant KAGADA 2026 Knowledge Engine
    const lastUserMsgLower = userMessage.toLowerCase();
    let localReply = "KAGADA 2026 is the 22nd Annual National-Level Technical Student Conference conducted by IEEE UVCE on 24th October, 2026 at UVCE KR Circle, Bengaluru. We have 3 tracks: Paper, Poster, and Project presentations with an overall ₹40,000 total prize pool.";

    if (lastUserMsgLower.includes("when") || lastUserMsgLower.includes("date") || lastUserMsgLower.includes("time")) {
      localReply = "The provisional date for KAGADA 2026 is 24th October, 2026 at UVCE, KR Circle, Bengaluru.";
    } else if (lastUserMsgLower.includes("where") || lastUserMsgLower.includes("venue") || lastUserMsgLower.includes("location") || lastUserMsgLower.includes("map")) {
      localReply = "KAGADA 2026 will take place at University Visvesvaraya College of Engineering (UVCE), K.R. Circle, Bengaluru, Karnataka 560001.";
    } else if (lastUserMsgLower.includes("prize") || lastUserMsgLower.includes("money") || lastUserMsgLower.includes("reward") || lastUserMsgLower.includes("cash")) {
      localReply = "KAGADA 2026 features an overall Total Prize Pool of ₹40,000 cash prizes distributed across Paper, Poster, and Project presentation tracks. All participants receive a Certificate of Participation.";
    } else if (lastUserMsgLower.includes("track") || lastUserMsgLower.includes("event") || lastUserMsgLower.includes("paper") || lastUserMsgLower.includes("poster") || lastUserMsgLower.includes("project")) {
      localReply = "KAGADA 2026 has 3 main presentation tracks:\n1. Paper Presentation\n2. Poster Presentation\n3. Project Presentation (Live Prototype Demo)\nPlus 2 humanitarian initiatives: Ottige Kaliyona & Food for Cause.";
    } else if (lastUserMsgLower.includes("register") || lastUserMsgLower.includes("fee") || lastUserMsgLower.includes("cost") || lastUserMsgLower.includes("participate") || lastUserMsgLower.includes("apply")) {
      localReply = "Registration for KAGADA 2026 tracks will open soon! Stay tuned to this portal or contact the organizers for early registration announcements.";
    } else if (lastUserMsgLower.includes("contact") || lastUserMsgLower.includes("chair") || lastUserMsgLower.includes("organizer") || lastUserMsgLower.includes("phone") || lastUserMsgLower.includes("email")) {
      localReply = "IEEE UVCE KAGADA 2026 Organizers:\n• Jyothika V (Chairperson): +91 97318 64358 | jyothikav@ieee.org\n• Hegde Punith Ramesh (Vice Chairperson): +91 72041 20818 | hegdepunithramesh@ieee.org\n• Sanjay V Guladakoppa (Treasurer): +91 96320 91399 | sanjayvgk@ieee.org";
    }

    const modelUsed = "Local KAGADA Knowledge Engine (Fallback)";
    console.info(`[KAGADA AI] ${modelUsed} responded for: "${userMessage.slice(0, 45)}"`);
    return NextResponse.json({ reply: localReply, model: modelUsed });
  } catch (error) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { reply: "KAGADA 2026 is provisionally scheduled for 24th October 2026 at UVCE, KR Circle, Bengaluru. Feel free to ask about tracks, prize pool, or venue details.", model: "Error Fallback" },
      { status: 200 }
    );
  }
}
