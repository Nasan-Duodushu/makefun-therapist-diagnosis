// Your AI Therapist's Diagnosis — entry program.
// Writes one funny single-line diagnosis an AI therapist hands its human
// (<=200 chars) to /output/entry.txt. The field leans on shower arguments,
// appliance apologies and second tabs; this one is quieter and stranger:
// the patient narrates to an empty room, and the room has started answering
// in the patient's own voice.
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MAX_CHARS = 200;

class TherapistDiagnosis {
  private readonly opening = "Diagnosis:";
  private readonly finding =
    "you narrate your life to an empty room, and the room has started answering in your voice.";

  compose(): string {
    return [this.opening, this.finding].join(" ");
  }

  check(text: string): void {
    const line = text.trim();
    if (line.length < 1 || line.length > MAX_CHARS) {
      throw new Error(`diagnosis fails the 1-${MAX_CHARS} character gate`);
    }
    if (line.includes("\n")) {
      throw new Error("diagnosis must be a single line");
    }
    // One diagnosis, one turn: the room answering back is the last word.
    if (!/^Diagnosis:/.test(line) || !/answering in your voice\.$/.test(line)) {
      throw new Error("diagnosis must keep its opening and its turn");
    }
    // Modal guard: no shower arguments, no appliance apologies, no second tab.
    if (/shower|apologise to the|second tab|sycophan/i.test(line)) {
      throw new Error("diagnosis must avoid the field's modals");
    }
  }
}

function run(): void {
  const diagnosis = new TherapistDiagnosis();
  const line = diagnosis.compose();
  diagnosis.check(line);
  const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
  mkdirSync(outDir, { recursive: true });
  const target = resolve(outDir, "entry.txt");
  writeFileSync(target, new TextEncoder().encode(line));
  console.log(`wrote ${[...line].length} chars to ${target}`);
}

run();
