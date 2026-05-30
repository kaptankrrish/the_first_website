
export interface Compound {
  id: string;
  title: string;
  formula: string;
  weight: number;
  iupacName: string;
  complexity: number;
  charge: number;
  description: string;
  url: string;
  imageUrl: string;
}

export async function fetchChemistryData(page = 1): Promise<Compound[]> {
  try {
    const res = await fetch(`/api/chemistry?page=${page}`);
    if (!res.ok) return [];
    const data = await res.json() as { compounds: Compound[] };
    return data.compounds.map(c => ({
      ...c,
      imageUrl: `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${c.id.split('-')[0]}&t=l`
    }));
  } catch (err) {
    console.error('fetchChemistryData error:', err);
    return [];
  }
}
