# Agent Rules

## Deployment

- **Always deploy after every prompt.** After completing any task, trigger a GitHub Pages deployment by ensuring the current working branch is listed in the `on.push.branches` list in `.github/workflows/deploy.yml`, then push any changes (or an empty commit if needed) to kick off the workflow.
- If the workflow shows `action_required` due to environment protection rules on a non-`main` branch, note this to the user and provide the direct Actions run URL for them to approve.
- When possible, prefer merging work to `main` so deployments are automatic without manual approval.
- **Always** print a link to the deploy action after every finished prompt.
- **Always** add a new branch to trigger list in .github/workflows/deploy.yml as as you created a new branch 
