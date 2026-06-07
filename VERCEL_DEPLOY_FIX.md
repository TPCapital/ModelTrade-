# Vercel Deploy Fix

This package fixes the schema validation issue:

> The `vercel.json` schema validation failed: should NOT have additional property `private`

## What changed

1. `vercel.json` was rewritten to contain only valid Vercel fields for a Vite SPA.
2. `private: true` was removed from `package.json` to avoid confusion when copying config or importing the project.

## Recommended Vercel settings

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: default / `npm install`

## Important

Do not put `private` inside `vercel.json`. If you need it, it belongs only in `package.json`; however, this deployment-safe package removes it completely because it is unnecessary for Vercel deployment.
