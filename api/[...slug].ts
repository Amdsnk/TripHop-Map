// Vercel serverless entry point.
// Vercel routes any request under /api/* to this function; the Express app
// itself expects to receive the full path (including the /api prefix), so
// no path rewriting is needed here — this just adapts the existing Express
// app to Vercel's Node.js serverless function signature.
//
// Dynamic import() is used instead of a static import so that Vercel's
// CommonJS compilation of this file can still load the ESM .mjs bundle.
export default async function handler(req: any, res: any) {
  // @ts-expect-error - dist/app.mjs is a pre-built JS bundle with no type declarations
  const { default: app } = await import("../artifacts/api-server/dist/app.mjs");
  app(req, res);
}
