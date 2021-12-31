export const config = {
  projectId: `az8av6xl`,
  apiVersion: `v2021-03-25`,
  dataset: `production`,
}

export async function getSanityData() {
  // Some **lazy** Sanity fetchin'
  const {projectId, apiVersion, dataset} = config

  const query = `*[_id == "tailwind"][0].content`
  const about = await fetch(
    `https://${projectId}.apicdn.sanity.io/${apiVersion}/data/query/${dataset}?query=${query}`
  )
    .then((res) => res.json())
    .catch(() => null)

  return about?.result
}
