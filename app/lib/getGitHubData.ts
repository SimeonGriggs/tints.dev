export async function getGitHubData() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/simeonGriggs/tints.dev`,
    );
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}
