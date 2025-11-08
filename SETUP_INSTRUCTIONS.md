# Setup Instructions - Application Not Running

## Issues Fixed ✅
1. ✅ Installed missing dependencies: dotenv, React, Wouter, TanStack Query, type definitions
2. ✅ Fixed TypeScript errors in server/index.ts
3. ✅ Updated tsconfig.json to include all source directories
4. ✅ Modified src/index.ts to correctly import server/index.ts
5. ✅ All CSS @apply directive issues resolved

## Remaining Issue ⚠️

The `.replit` file is missing the workflow configuration. The file should contain:

```toml
modules = ["nodejs-20", "web"]
run = "npm run dev"

[nix]
channel = "stable-25_05"

[workflows]
runButton = "Start application"

[[workflows.workflow]]
name = "Start application"
author = "agent"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "npm run dev"
waitForPort = 5000

[[ports]]
localPort = 5000
externalPort = 80
```

## How to Fix

### Option 1: Restore from backup
```bash
cp .sfs-backups/20251011T180313Z/.replit .replit
```

### Option 2: Add run command to .replit manually
Open `.replit` and add:
```
run = "npm run dev"
```

### Option 3: Use Workflows UI
1. Open the Workflows tool from the sidebar (Command + K → search "Workflows")
2. Create a new workflow named "Start application"
3. Add task: Execute Shell Command → `npm run dev`
4. Set to wait for port 5000
5. Assign to Run button

## Manual Start (Temporary)
If you need to start the server immediately for testing:
```bash
npm run dev
```

This will start the Express server with Vite on port 5000.
