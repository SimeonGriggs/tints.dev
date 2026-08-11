export const config = {
  projectId: `az8av6xl`,
  apiVersion: `v2021-03-25`,
  dataset: `production`,
};

export async function getSanityData() {
  // Some **lazy** Sanity fetchin'
  const { projectId, apiVersion, dataset } = config;

  const query = `*[_id == "tailwind"][0].content`;
  try {
    const res = await fetch(
      `https://${projectId}.apicdn.sanity.io/${apiVersion}/data/query/${dataset}?query=${query}`,
    );
    if (!res.ok) {
      return null;
    }
    const about = await res.json();
    return about?.result;
  } catch {
    return null;
  }
}
