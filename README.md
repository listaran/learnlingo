# LearnLingo

## GitHub Pages deployment

This repository includes `.github/workflows/deploy.yml`. It installs dependencies, runs `npm run build`, uploads the `dist` directory, and deploys the result to GitHub Pages whenever changes are pushed to `main`.

1. Create an empty GitHub repository and push this project to `main`:

```bash
git init
git add .
git commit -m "Initial LearnLingo app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

2. In GitHub open **Settings → Pages**.
3. Under **Build and deployment → Source**, select **GitHub Actions**.
4. Open **Actions** and wait for **Deploy LearnLingo to GitHub Pages** to finish.
5. The site will be available at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`.

Vite determines the project base path automatically from `GITHUB_REPOSITORY` during Actions builds. The app uses `HashRouter`, so the Teachers and Favorites pages work on GitHub Pages without server-side rewrites.
