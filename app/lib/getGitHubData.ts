type GitHubRepoResponse = {
  stargazers_count?: number;
};

export async function getGitHubData(): Promise<GitHubRepoResponse | null> {
  const github = await fetch(
    `https://api.github.com/repos/simeonGriggs/tints.dev`,
  )
    .then((res) => res.json() as Promise<GitHubRepoResponse>)
    .catch(() => null);

  return github;
}
