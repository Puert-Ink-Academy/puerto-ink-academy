import "server-only";

type Level = "INFO" | "WARN" | "ERROR" | "DEBUG";

const badge: Record<Level, string> = {
  ERROR: "\x1b[31mERROR\x1b[0m",
  WARN: "\x1b[33mWARN \x1b[0m",
  INFO: "\x1b[34mINFO \x1b[0m",
  DEBUG: "\x1b[90mDEBUG\x1b[0m",
};

const stream: Record<Level, "stdout" | "stderr"> = {
  INFO: "stdout",
  WARN: "stderr",
  ERROR: "stderr",
  DEBUG: "stdout",
};

function details(input: unknown): { message: string; stack?: string } {
  if (input instanceof Error) {
    return { message: input.message, stack: input.stack };
  }
  return { message: String(input) };
}

function write(level: Level, context: string, input: unknown) {
  const time = new Date().toISOString();
  const { message, stack } = details(input);
  const line =
    process.env.NODE_ENV === "production"
      ? JSON.stringify({ time, level, context, message, ...(stack ? { stack } : {}) })
      : `\x1b[2m${time}\x1b[0m ${badge[level]} \x1b[36m${context}\x1b[0m ${message}`;

  process[stream[level]].write(`${line}\n`);
  if (stack && process.env.NODE_ENV !== "production") {
    process.stderr.write(`\x1b[2m${stack}\x1b[0m\n`);
  }
}

export const logger = {
  info(context: string, message: unknown) {
    write("INFO", context, message);
  },
  warn(context: string, message: unknown) {
    write("WARN", context, message);
  },
  error(context: string, message: unknown) {
    write("ERROR", context, message);
  },
  debug(context: string, message: unknown) {
    write("DEBUG", context, message);
  },
};
