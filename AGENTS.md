# Export rules
- Use a shared render-progress broadcast for foreground downloads and existing background screenshot jobs so waiting downloads receive the same page and retry updates.
- Keep screenshot retry execution in the tested renderRetry helper so displayed counts match actual client retry attempts; these counts do not describe internal Browserless retries.