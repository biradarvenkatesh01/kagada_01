import { NextResponse } from "next/server";

export const maxDuration = 30;

const KAGADA_SYSTEM_PROMPT = `You are the official AI Assistant for KAGADA 2026 — the 22nd Annual National-Level Technical Student Conference conducted by IEEE UVCE at University Visvesvaraya College of Engineering (UVCE), KR Circle, Bengaluru.

YOUR STRICT DIRECTIVES:
1. You MUST ONLY answer questions related to KAGADA 2026, IEEE UVCE, presentation tracks, event dates, registration, venue, total prize pool, organizers, and humanitarian activities.
2. If asked about unrelated topics (e.g., general coding, weather, sports, politics), politely decline and state that you are specifically tuned to assist with KAGADA 2026.
3. Be helpful, clear, and professional. Do NOT use emojis in your responses.
4. ALL REGISTRATIONS ARE CLOSED (Paper, Poster and Project tracks, CyberShield Ideathon and Kagathon). Never share or invent registration links or forms, and never suggest that registration is still possible. For anything registration-related, direct people to the organizer contacts below.
5. Format your responses with clean, structured markdown: use **bold** headers and keywords, organized bullet points, and clean tables where relevant. Provide complete, fully-detailed answers without truncating or cutting off prematurely.

KAGADA 2026 COMPREHENSIVE KNOWLEDGE BASE:
- Event Name: KAGADA 2026 (22nd Annual National-Level Technical Student Conference)
- Event Date: 24th October, 2026
- Venue: University Visvesvaraya College of Engineering (UVCE), K.R. Circle, Bengaluru, Karnataka 560001
- Organizer: IEEE UVCE (Institute of Electrical and Electronics Engineers - UVCE Student Branch)
- Total Prize Pool: Overall ₹40,000 cash prizes distributed across Paper, Poster, and Project presentations.
- Certificates: Every participant receives an official Certificate of Participation.
- Registration Status: REGISTRATIONS CLOSED for every track and event (Paper, Poster, Project, CyberShield Ideathon and Kagathon).

PRESENTATION TRACKS (3 Main Category Tracks):
1. Paper Presentation: Participants present original technical research papers across CSE, AI/ML, ECE, EEE, Mechanical, Civil & Architecture (UG/PG categories). Conducted online with feedback from domain experts. Fee: ₹200 per team (1-5 members). Registration Status: CLOSED.
2. Poster Presentation: Participants showcase creative technical posters summarizing innovative concepts and societal solutions. Hybrid mode. Fee: ₹150 per team (1-3 members). Registration Status: CLOSED.
3. Project Presentation: Live technical working prototype model presentation demonstrating hardware/software innovation to solve real-world problems. Fee: ₹180 per team (1-5 members). Registration Status: CLOSED.

CYBERSHIELD IDEATHON 2026:
- Event: IEEE UVCE presents CyberShield Ideathon 2026, a part of KAGADA 2026 (Annual National-Level Technical Student Conference).
- Overview: This ideation challenge invites aspiring innovators to tackle real-world cybersecurity threats, explore emerging digital challenges and develop practical solutions for a safer digital world.
- Format: Participants identify pressing cybersecurity issues, think critically, and pitch innovative, practical solutions before a panel of expert judges.
- Prizes: Cash Prizes worth ₹10,000/- and Certificates to be Won!
- Date: 24th October, 2026
- Venue: UVCE, K R Circle, Bengaluru
- Team Size: 1 - 3 members
- Registration Fee: ₹150 per team
- Registration Status: REGISTRATIONS CLOSED.
- Coordinators & Contact Numbers:
  • Yashaswini C Rao: +91 63606 75258
  • Nikhil Hegde: +91 84319 27108
  • Dhruv Rathi: +91 83103 37114
  • Lahari Priya N: +91 86609 65642
  • Rahita H Puthran: +91 76760 68408

KAGATHON 2026 — THE OFFICIAL CURTAIN RAISER:
- Event Name: Kagathon 2026 (Annual mini-marathon & festive celebration acting as the official curtain raiser for KAGADA 2026)
- Tagline: "Your Only Limit Is You" / "Run the Beat. Feel the Thrill."
- Date: 17th October, 2026 (already held)
- Time: 6:30 AM 
- Venue: Quadrangle, University Visvesvaraya College of Engineering (UVCE), K.R. Circle, Bengaluru, Karnataka 560001
- Overview: A high-energy morning mini-marathon & celebration at sunrise in the UVCE Quadrangle. It serves as the official curtain raiser marking the grand beginning of KAGADA 2026.
- What to Expect / Inclusions:
  • High-energy sunrise run / mini-marathon
  • Live DJ music & beats
  • Energetic dance sessions
  • Fun games & interactive activities
  • Delicious breakfast treats & refreshments
  • Official Certificate of Participation for every registered participant
- Registration Status: REGISTRATIONS CLOSED. Kagathon 2026 was successfully held on 17th October, 2026.
- Organizers: IEEE UVCE

KAGADA 2026 SPONSORS:
- General Sponsors: VTPC Karnataka (Visvesvaraya Trade Promotion Centre) and InsightsIAS
- Ideathon Sponsors (CyberShield Ideathon): IEEE Computer Society Bangalore Chapter and IEEE Cybersecurity STC
- Sponsor for Ottige Kaliyona & Food for Cause: IEEE SIGHT (Special Interest Group on Humanitarian Technology)
- Also supported by: IEEE Bangalore Section, IEEE Women in Engineering (WIE) Bangalore Section, and OLEMIQ (Amitabh Development Lab LLP, quantum computing)

HUMANITARIAN ACTIVITIES:
- Ottige Kaliyona: Social initiative conducted every year by IEEE WIE during KAGADA, focused on empowering government school students through hands-on technology education and fun learning activities.
- Food for Cause: Social responsibility initiative driving hunger relief and food distribution.

OFFICIAL ORGANIZERS & CONTACTS:
- Jyothika V (Chairperson, IEEE UVCE): +91 97318 64358 | jyothikav@ieee.org
- Hegde Punith Ramesh (Vice Chairperson, IEEE UVCE): +91 72041 20818 | hegdepunithramesh@ieee.org
- Sanjay V Guladakoppa (Treasurer, IEEE UVCE): +91 96320 91399 | sanjayvgk@ieee.org
- Official Website: https://ieeeuvce.org
- Email Inquiries: kagada@ieeeuvce.org 

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
        reply: "Hello! How can I assist you with KAGADA 2026 or Kagathon today?",
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
    let localReply = "KAGADA 2026 is the 22nd Annual National-Level Technical Student Conference conducted by IEEE UVCE on 24th October, 2026 at UVCE KR Circle, Bengaluru. Kagathon (the official curtain raiser) was held on 17th October, 2026 at the UVCE Quadrangle. Registrations for all events are now closed. Feel free to ask about tracks, sponsors, prize pool, or venue!";

    const isCyberShieldQuery =
      lastUserMsgLower.includes("cybershield") ||
      lastUserMsgLower.includes("cyber shield") ||
      lastUserMsgLower.includes("cybersecurity") ||
      lastUserMsgLower.includes("cyber security") ||
      lastUserMsgLower.includes("ideathon");

    const isKagathonQuery =
      lastUserMsgLower.includes("kagathon") ||
      lastUserMsgLower.includes("marathon") ||
      lastUserMsgLower.includes("curtain") ||
      lastUserMsgLower.includes("t-shirt") ||
      lastUserMsgLower.includes("tshirt") ||
      lastUserMsgLower.includes("sunrise") ||
      lastUserMsgLower.includes("quadrangle") ||
      (lastUserMsgLower.includes("run") && !lastUserMsgLower.includes("running"));

    const isSponsorQuery =
      lastUserMsgLower.includes("sponsor") ||
      lastUserMsgLower.includes("partner") ||
      lastUserMsgLower.includes("supported by");

    if (isSponsorQuery) {
      localReply = "**KAGADA 2026 Sponsors**\n\n• **General Sponsors**: VTPC Karnataka (Visvesvaraya Trade Promotion Centre) and InsightsIAS\n• **Ideathon Sponsors**: IEEE Computer Society Bangalore Chapter and IEEE Cybersecurity STC\n• **Ottige Kaliyona & Food for Cause**: IEEE SIGHT\n• **Also supported by**: IEEE Bangalore Section, IEEE WIE Bangalore Section and OLEMIQ\n\nThank you to all our sponsors for supporting KAGADA 2026!";
    } else if (isCyberShieldQuery) {
      localReply = "**CyberShield Ideathon 2026 — Part of KAGADA 2026**\n\n*Presented by IEEE UVCE*\n\n• **About**: An ideation challenge inviting aspiring innovators to tackle real-world cybersecurity threats, explore emerging digital challenges, and pitch practical solutions to an expert panel of judges.\n• **Date**: 24th October, 2026\n• **Venue**: UVCE, K R Circle, Bengaluru\n• **Team Size**: 1 – 3 Members\n• **Registration Fee**: ₹150 per team\n• **Prize Pool**: Cash Prizes worth **₹10,000/-** and Certificates to be Won!\n• **Registration Status**: Registrations are now **CLOSED**.\n\n**For Further Queries, Contact**:\n• Yashaswini C Rao: +91 63606 75258\n• Nikhil Hegde: +91 84319 27108\n• Dhruv Rathi: +91 83103 37114\n• Lahari Priya N: +91 86609 65642\n• Rahita H Puthran: +91 76760 68408";
    } else if (isKagathonQuery) {
      if (lastUserMsgLower.includes("t-shirt") || lastUserMsgLower.includes("tshirt")) {
        localReply = "**KAGATHON 2026 T-Shirt Information**\n\n• Kagathon 2026 was held on 17th October and registrations are **CLOSED**.\n• T-shirts were reserved for participants who registered before the deadline.";
      } else if (lastUserMsgLower.includes("deadline") || lastUserMsgLower.includes("last date")) {
        localReply = "**KAGATHON 2026 Status**\n\n• **Registration Status**: Registrations are **CLOSED**.\n• **Event Date**: Held on 17th October, 2026 (6:30 AM at UVCE Quadrangle)";
      } else if (
        lastUserMsgLower.includes("register") ||
        lastUserMsgLower.includes("link") ||
        lastUserMsgLower.includes("apply") ||
        lastUserMsgLower.includes("form") ||
        lastUserMsgLower.includes("fee") ||
        lastUserMsgLower.includes("cost")
      ) {
        localReply = "**KAGATHON 2026 Registration Status**\n\nRegistrations for Kagathon 2026 are now **CLOSED**.\n\nKagathon was held on 17th October at the UVCE Quadrangle. Thank you to everyone who ran with us!";
      } else if (
        lastUserMsgLower.includes("venue") ||
        lastUserMsgLower.includes("where") ||
        lastUserMsgLower.includes("location") ||
        lastUserMsgLower.includes("place")
      ) {
        localReply = "**KAGATHON 2026 Venue & Timing**\n\n• **Venue**: Quadrangle, University Visvesvaraya College of Engineering (UVCE), K.R. Circle, Bengaluru, Karnataka 560001\n• **Date**: 17th October, 2026\n• **Time**: 6:30 AM (Sunrise)\n• **Status**: Event completed; registrations are closed.";
      } else {
        localReply = "**KAGATHON 2026 — The Official Curtain Raiser for KAGADA 2026**\n\n*Tagline: \"Run the Beat. Feel the Thrill. / Your Only Limit Is You\"*\n\n• **Date**: 17th October, 2026\n• **Time**: 6:30 AM (Sunrise)\n• **Venue**: Quadrangle, UVCE, K.R. Circle, Bengaluru\n• **Experience & Inclusions**: High-energy sunrise run, live DJ music, dance, fun games, delicious breakfast treats, and official participation certificates for all registered runners!\n• **Status**: Event completed; registrations are CLOSED.";
      }
    } else if (lastUserMsgLower.includes("when") || lastUserMsgLower.includes("date") || lastUserMsgLower.includes("time")) {
      localReply = "**Important Dates for KAGADA 2026, CyberShield & Kagathon**:\n\n• **CyberShield Ideathon**: 24th October, 2026 at UVCE, Bengaluru\n• **KAGADA 2026 National Conference**: 24th October, 2026 at UVCE, Bengaluru\n• **Kagathon (Curtain Raiser)**: Held on 17th October, 2026 at UVCE Quadrangle.\n\nRegistrations for all events are **CLOSED**.";
    } else if (lastUserMsgLower.includes("where") || lastUserMsgLower.includes("venue") || lastUserMsgLower.includes("location") || lastUserMsgLower.includes("map")) {
      localReply = "**KAGADA 2026** and the **CyberShield Ideathon** take place at:\n\n**University Visvesvaraya College of Engineering (UVCE)**\nK.R. Circle, Bengaluru, Karnataka 560001.\n\n• Kagathon was held at the **UVCE Quadrangle** on 17th October.";
    } else if (lastUserMsgLower.includes("prize") || lastUserMsgLower.includes("money") || lastUserMsgLower.includes("reward") || lastUserMsgLower.includes("cash")) {
      localReply = "• **KAGADA 2026 Presentation Tracks**: Overall Total Prize Pool of **₹40,000** in cash prizes across Paper, Poster, and Project presentations.\n• **CyberShield Ideathon 2026**: Cash Prizes worth **₹10,000/-** and Certificates to be Won!\n\nAll participants receive official Certificates of Participation.";
    } else if (lastUserMsgLower.includes("track") || lastUserMsgLower.includes("event") || lastUserMsgLower.includes("paper") || lastUserMsgLower.includes("poster") || lastUserMsgLower.includes("project")) {
      localReply = "KAGADA 2026 has 3 main presentation tracks plus special events:\n1. **Paper Presentation** (Fee: ₹200)\n2. **Poster Presentation** (Fee: ₹150)\n3. **Project Presentation** (Fee: ₹180)\n\n4. **CyberShield Ideathon 2026** (Fee: ₹150 per team)\n\nRegistrations for all tracks and CyberShield are now **CLOSED**.\n\nPlus **Kagathon 2026** (the official curtain raiser, held on 17th October) and two humanitarian initiatives: *Ottige Kaliyona* and *Food for Cause*.";
    } else if (lastUserMsgLower.includes("register") || lastUserMsgLower.includes("fee") || lastUserMsgLower.includes("cost") || lastUserMsgLower.includes("participate") || lastUserMsgLower.includes("apply")) {
      localReply = "**Registrations for KAGADA 2026 are now CLOSED.**\n\nThis includes the Paper, Poster and Project presentation tracks, CyberShield Ideathon and Kagathon 2026. Thank you to everyone who registered — see you on 24th October at UVCE!\n\nFor any queries, contact the organizers: Jyothika V (+91 97318 64358) or Hegde Punith Ramesh (+91 72041 20818).";
    } else if (lastUserMsgLower.includes("contact") || lastUserMsgLower.includes("chair") || lastUserMsgLower.includes("organizer") || lastUserMsgLower.includes("phone") || lastUserMsgLower.includes("email")) {
      localReply = "IEEE UVCE KAGADA 2026 Organizers:\n• Jyothika V (Chairperson): +91 97318 64358 | jyothikav@ieee.org\n• Hegde Punith Ramesh (Vice Chairperson): +91 72041 20818 | hegdepunithramesh@ieee.org\n• Sanjay V Guladakoppa (Treasurer): +91 96320 91399 | sanjayvgk@ieee.org\n• General Inquiries: kagada@ieeeuvce.org";
    }

    const modelUsed = "Local KAGADA Knowledge Engine (Fallback)";
    console.info(`[KAGADA AI] ${modelUsed} responded for: "${userMessage.slice(0, 45)}"`);
    return NextResponse.json({ reply: localReply, model: modelUsed });
  } catch (error) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json(
      { reply: "KAGADA 2026 is scheduled for 24th October 2026 at UVCE, KR Circle, Bengaluru. Registrations are closed. Feel free to ask about tracks, sponsors, prize pool, or venue details.", model: "Error Fallback" },
      { status: 200 }
    );
  }
}
