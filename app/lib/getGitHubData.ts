export async function getGitHubData() {
  const github = await fetch(`https://api.github.com/repos/simeonGriggs/tints.dev`)
    .then((res) => res.json())
    .catch(() => null)

  return github
}
