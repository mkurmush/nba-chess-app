import { mkdir, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const releaseBase =
  "https://github.com/nmrugg/stockfish.js/releases/download/v18.0.0";

const files = [
  {
    url: `${releaseBase}/stockfish-18-lite-single.js`,
    dest: "stockfish.js",
  },
  {
    url: `${releaseBase}/stockfish-18-lite-single.wasm`,
    dest: "stockfish.wasm",
  },
];

async function downloadFile(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  await pipeline(response.body, createWriteStream(destination));
}

async function main() {
  await mkdir(publicDir, { recursive: true });

  for (const file of files) {
    const destination = path.join(publicDir, file.dest);
    console.log(`Downloading ${file.url}`);
    await downloadFile(file.url, destination);
    console.log(`Saved ${destination}`);
  }

  const readme = `# Stockfish assets

These files were downloaded by \`npm run setup:stockfish\`.
Do not edit manually.
`;
  await writeFile(path.join(publicDir, "README.md"), readme, "utf8");
  console.log("Stockfish setup complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
