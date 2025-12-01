# Deploy to GitHub Pages

## Setup Instructions

### 1. Update package.json

Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPO_NAME` in the `homepage` field with your actual GitHub username and repository name.

Example:

```json
"homepage": "https://johnsmith.github.io/pdf-editor"
```

### 2. Install gh-pages

```bash
npm install
```

### 3. Initialize Git Repository (if not already done)

```bash
git init
git add .
git commit -m "Initial commit"
```

### 4. Create GitHub Repository

1. Go to GitHub and create a new repository
2. Name it (e.g., "pdf-editor")
3. Don't initialize with README (you already have files)

### 5. Link to GitHub

```bash
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 6. Deploy to GitHub Pages

```bash
npm run deploy
```

This command will:

- Build your React app
- Create a `gh-pages` branch
- Push the build folder to that branch
- GitHub will automatically serve it

### 7. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click Settings
3. Scroll to "Pages" section
4. Source should be set to "gh-pages" branch
5. Your site will be live at the URL shown (same as your homepage in package.json)

## Updating Your Deployed App

Whenever you make changes:

```bash
git add .
git commit -m "Your commit message"
git push
npm run deploy
```

## Troubleshooting

- **404 Error**: Make sure the homepage URL in package.json matches your repository name exactly
- **Blank Page**: Check browser console for errors, often caused by incorrect homepage path
- **Build Fails**: Run `npm run build` locally first to check for build errors
