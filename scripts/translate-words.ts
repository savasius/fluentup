/**
 * Batch-translate English vocabulary rows to Turkish (translation_tr + example Turkish).
 * Requires OPENAI_API_KEY in env. Run manually: npx tsx scripts/translate-words.ts
 *
 * Do NOT run in CI — user executes locally after DB migration adds translation_tr.
 */

import "dotenv/config";

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("OPENAI_API_KEY is required.");
    process.exit(1);
  }

  const word = process.argv[2] ?? "hello";
  const definition = process.argv[3] ?? "used as a greeting";
  const example = process.argv[4] ?? "Hello, how are you?";

  const prompt = `Translate this English word to Turkish, simple and clear for a child:
Word: "${word}"
Definition: "${definition}"
Example: "${example}"

Return JSON only:
{
  "translation": "Türkçe karşılık (1-3 kelime)",
  "exampleTr": "Örnek cümlenin Türkçe çevirisi"
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!res.ok) {
    console.error(await res.text());
    process.exit(1);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const text = data.choices?.[0]?.message?.content ?? "";
  console.log(text);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
