# GitHub Profile Finder

A responsive React application built for the **Internlytic Technologies — Front-End Development Internship, Week 3** task. Search a GitHub username and explore the user's public profile and repositories.

## Features

- Search using a GitHub username or press Enter.
- Displays avatar, name, username, bio, location, company and website when available.
- Shows public repository, follower and following counts.
- Lists public repositories with descriptions, programming languages, stars, forks and direct links.
- Loading indicator and friendly messages for empty input, unknown users, network errors and API rate limits.
- Responsive dark dashboard design.
- Uses reusable React rendering patterns and stable repository keys.
- No GitHub token or secret is required.

## Tech stack

- React
- Vite
- JavaScript
- HTML and CSS
- GitHub REST API
- Lucide React icons

## Requirements

Install Node.js LTS from https://nodejs.org/ . npm is included with Node.js.

## Run locally

1. Extract the ZIP file.
2. Open the extracted `github-profile-finder` folder in VS Code.
3. Open **Terminal → New Terminal**.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL Vite prints in the terminal (usually `http://localhost:5173`).

## API endpoints

Profile:

`https://api.github.com/users/USERNAME`

Public repositories, sorted by most recently updated:

`https://api.github.com/users/USERNAME/repos?sort=updated&per_page=100`

Replace `USERNAME` with the searched GitHub username. Public unauthenticated API requests are rate-limited by GitHub, so wait and retry if you reach the limit.

## Production build

```bash
npm run build
npm run preview
```

Vite creates the production build in the `dist` folder.

## Upload to GitHub

1. Sign in at https://github.com/ and create a new public repository named `github-profile-finder`.
2. In the VS Code terminal, from the project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Build GitHub Profile Finder"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/github-profile-finder.git
   git push -u origin main
   ```

3. Replace `YOUR-USERNAME` with your actual GitHub username. If Git asks you to authenticate, follow GitHub's sign-in prompt.

## Optional deployment with Vercel

1. Push the project to GitHub.
2. Sign in at https://vercel.com/ and import the repository.
3. Keep the default Vite settings: build command `npm run build`, output directory `dist`.
4. Deploy and copy the live URL for your internship submission.

## Test checklist

- [ ] Search a valid username such as `octocat`.
- [ ] Search an invalid username.
- [ ] Submit an empty input.
- [ ] Test on a narrow/mobile screen.
- [ ] Check a profile with no bio or location.
- [ ] Test again after a network interruption or API rate limit.

## Internship submission

- GitHub repository: add your repository URL after pushing the code.
- Live deployment: add the Vercel/Netlify URL if deployed.
- LinkedIn post: publish a short project summary and include your repository/live links.

Built as a learning project for the Internlytic Technologies Front-End Development Internship.
