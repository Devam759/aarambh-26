# Project Rules & Reference Information

* The live production domain for the web application is `aarambh.jklu.edu.in`. Always use this URL when configuring cron jobs, webhooks, callback targets, or referencing production resources.

## Terminal Command Rules

* **NEVER run commands as background tasks.** Always set `WaitMsBeforeAsync` high enough that the command completes synchronously and its full output is visible inline. For example:
  * Short commands (lint, type-check, build): use `WaitMsBeforeAsync = 120000` (2 minutes)
  * Deploy commands (`firebase deploy`, `vercel deploy`, etc.): use `WaitMsBeforeAsync = 300000` (5 minutes)
  * Dev server startup: use `WaitMsBeforeAsync = 15000` (15 seconds) to capture early output, then inform the user it is running
* The user must always be able to see terminal output directly without needing to check a separate log file or use `manage_task`.
