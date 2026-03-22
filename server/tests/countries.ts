export async function getCountriesStartingWith(srch: string): Promise<string[]> {
  const response = await fetch('https://api.first.org/data/v1/countries?limit=1000');
  const json = await response.json();
  return Object.values(json.data)
    .map((c: any) => c.country as string)
    .filter(name => name.toLowerCase().startsWith(srch.toLowerCase()));
}
