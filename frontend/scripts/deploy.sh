#!/bin/bash

set -e

# Save current branch name
prev_branch=$(git symbolic-ref --short HEAD)

# Stash uncommitted changes
git stash push -u -m "pre-deploy-stash"

# Switch to deploy branch
git checkout deploy

# Remove all tracked files from index
git rm -r --cached .

# Restore files from previous branch
git checkout "$prev_branch" -- .

# Apply stashed changes
git stash apply

# Stage all changes
git add -A

# Show staged files
git diff --cached --name-only

# Confirm commit and push
read -p "❓ Do you want to continue with commit and push? [y/N] " confirm
case "$confirm" in
    [yY][eE][sS]|[yY])
        echo "✅ Committing..."
        ;;
    *)
        echo "❌ Aborted."
        exit 1
        ;;
esac

# Function to revert changes on error
cleanup_on_error() {
    echo "⚠️  Error occurred. Reverting changes..."
    git reset --hard HEAD
    git checkout "$prev_branch"
    git stash pop || true
    exit 1
}

# Trap errors and run cleanup
trap 'cleanup_on_error' ERR

# Build and deploy
pnpm vite build
firebase deploy

# Commit changes
git commit -m "Deploy: auto-commit on $(date '+%Y-%m-%d %H:%M:%S')" || echo "Nothing to commit"

# Push to deploy branch
git push origin deploy

# Switch back to previous branch
git checkout "$prev_branch"

# Pop the stash
git stash pop

# Remove error trap after successful execution
trap - ERR