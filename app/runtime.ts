export const localMode=import.meta.env.MODE==='standalone';
const repository=import.meta.env.VITE_GITHUB_REPOSITORY||'';
export const workflowUrl=/^[\w.-]+\/[\w.-]+$/.test(repository)?`https://github.com/${repository}/actions/workflows/scan-and-publish.yml`:'https://github.com';
