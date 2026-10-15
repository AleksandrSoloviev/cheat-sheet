import { defineConfig } from 'astro/config';

const owner = process.env.GITHUB_REPOSITORY_OWNER?.toLowerCase();
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const onGitHub = process.env.GITHUB_ACTIONS === 'true' && Boolean(owner && repo);
const projectPage = onGitHub && repo !== `${owner}.github.io`;

export default defineConfig({
  site: onGitHub ? `https://${owner}.github.io` : 'http://localhost:4321',
  base: projectPage ? `/${repo}` : '/',
});
