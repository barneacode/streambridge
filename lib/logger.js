const util = require("util");

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const rawLevel = String(process.env.LOG_LEVEL || "INFO").trim().toUpperCase();
const currentLevel = Object.keys(LEVELS).find((level) => level.toUpperCase() === rawLevel) || "info";
const currentLevelValue = LEVELS[currentLevel];

function formatArg(arg) {
  if (typeof arg === "string") return arg;
  return util.inspect(arg, { depth: 4, colors: false, compact: true, maxArrayLength: 20 });
}

function write(level, args) {
  if (LEVELS[level] > currentLevelValue) return;
  const timestamp = new Date().toISOString();
  const message = args.map(formatArg).join(" ");
  process.stdout.write(`[${timestamp}] ${level.toUpperCase()} ${message}\n`);
}

function redactCfgPath(path) {
  if (!path || typeof path !== "string") return path;
  const segments = path.split("/");
  if (segments.length > 1 && segments[1] && !["api", "configure", "manifest.json", "public"].includes(segments[1])) {
    segments[1] = "[CFG]";
  }
  return segments.join("/");
}

module.exports = {
  level: currentLevel,
  isDebug: currentLevelValue >= LEVELS.debug,
  error: (...args) => write("error", args),
  warn: (...args) => write("warn", args),
  info: (...args) => write("info", args),
  debug: (...args) => write("debug", args),
  redactCfgPath,
};
