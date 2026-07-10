// Vercel serverless entry point.
// Vercel routes any request under /api/* to this function; the Express app
// itself expects to receive the full path (including the /api prefix), so
// no path rewriting is needed here — this just adapts the existing Express
// app to Vercel's Node.js serverless function signature.
import app from "../artifacts/api-server/src/app";

export default app;
