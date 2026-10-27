
type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, context: string, message: string, meta?: Record<string, unknown>) {
  const payload = {
    level,
    context,
    message,
    ...(meta && Object.keys(meta).length > 0 ? meta : {}),
    timestamp: new Date().toISOString(),
  };
  if (process.env.NODE_ENV === "development") {
    const methodMap: Record<LogLevel, "error" | "warn" | "log"> = {
      error: "error",
      warn: "warn",
      info: "log",
    };
    const method = methodMap[level];
    console[method](JSON.stringify(payload));
  }
}

export const logger = {
  info: (context: string, message: string, meta?: Record<string, unknown>) => log("info", context, message, meta),
  warn: (context: string, message: string, meta?: Record<string, unknown>) => log("warn", context, message, meta),
  error: (context: string, message: string, meta?: Record<string, unknown>) => log("error", context, message, meta),
};
