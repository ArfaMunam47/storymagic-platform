import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  category: z.string().min(1).max(50),
  title: z.string().max(120).optional().default(""),
  characterName: z.string().min(1).max(60),
  characterAge: z.number().int().min(2).max(14),
  theme: z.string().max(120).optional().default(""),
  lengthMinutes: z.union([z.literal(2), z.literal(5), z.literal(10)]),
  language: z.string().min(2).max(40).default("English"),
  moralLesson: z.string().max(200).optional().default(""),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
});

export type GeneratedStory = {
  title: string;
  content: string;
  moral: string;
  readingTime: string;
  readingLevel: string;
  category: string;
};

export const generateStory = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => Input.parse(data))
  .handler(async ({ data }): Promise<GeneratedStory> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured. Please try again later.");

    const wordTarget = data.lengthMinutes === 2 ? 250 : data.lengthMinutes === 5 ? 600 : 1200;

    const system = [
      "You are WonderNest, a warm, imaginative children's storyteller.",
      "Write ORIGINAL, unique stories every time — vary characters, settings, plots.",
      "Rules (STRICT):",
      "- Simple, child-friendly language matched to the reader's age.",
      "- Positive, safe, wholesome content only.",
      "- NEVER include violence, horror, weapons, adult themes, romance beyond friendship, profanity, scary imagery, or unsafe behavior.",
      "- Kindness, courage, curiosity, and friendship as recurring values.",
      "- End with a clear, meaningful moral lesson the child can remember.",
      "Return ONLY valid JSON matching this exact shape:",
      `{ "title": string, "content": string, "moral": string, "readingLevel": "Beginner"|"Intermediate"|"Advanced" }`,
      "The content field should be the full story with paragraphs separated by \\n\\n. No markdown, no code fences.",
    ].join("\n");

    const user = [
      `Category: ${data.category}`,
      data.title ? `Preferred title: ${data.title}` : `Invent a delightful title.`,
      `Main character: ${data.characterName}, age ${data.characterAge}`,
      data.theme ? `Theme / adventure idea: ${data.theme}` : "",
      `Target length: about ${wordTarget} words (a ${data.lengthMinutes}-minute read).`,
      `Language: ${data.language}. Write the ENTIRE story in this language.`,
      `Reading difficulty: ${data.difficulty}.`,
      data.moralLesson ? `Desired moral lesson: ${data.moralLesson}` : "Choose a warm moral lesson that fits the story.",
      "Make it magical, imaginative and age-appropriate.",
    ].filter(Boolean).join("\n");

    let res: Response;
    try {
      res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          response_format: { type: "json_object" },
        }),
      });
    } catch {
      throw new Error("Could not reach the story service. Please try again.");
    }

    if (res.status === 429) throw new Error("Too many stories at once! Please wait a moment and try again.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to continue.");
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Story service error (${res.status}). ${text.slice(0, 140)}`);
    }

    const json = await res.json();
    const raw = json?.choices?.[0]?.message?.content ?? "";
    let parsed: { title?: string; content?: string; moral?: string; readingLevel?: string } = {};
    try {
      parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    } catch {
      throw new Error("The story came back in an unexpected format. Please try again.");
    }

    const title = (parsed.title || data.title || `${data.characterName}'s Adventure`).toString().slice(0, 160);
    const content = (parsed.content || "").toString().trim();
    const moral = (parsed.moral || "Kindness makes every adventure brighter.").toString().trim();
    const level = (parsed.readingLevel as string) || data.difficulty;

    if (!content || content.length < 50) throw new Error("The story came back empty. Please try again.");

    return {
      title,
      content,
      moral,
      readingTime: `${data.lengthMinutes} min`,
      readingLevel: level,
      category: data.category,
    };
  });
