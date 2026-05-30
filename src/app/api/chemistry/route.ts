import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    
    // Use more robust compound IDs (common compounds often have titles)
    // Common CID ranges: 1-10000 usually contains well-known molecules
    const compoundIds = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10000) + 1);
    
    const res = await fetch(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${compoundIds.join(',')}/property/Title,MolecularFormula,MolecularWeight,IUPACName,Complexity,Charge/JSON`, { 
      next: { revalidate: 3600 } 
    });
    
    if (!res.ok) throw new Error('PubChem API failed');
    
    const data = await res.json();
    
    interface PubChemProperty {
      CID: number;
      Title?: string;
      MolecularFormula?: string;
      MolecularWeight?: number;
      IUPACName?: string;
      Complexity?: number;
      Charge?: number;
    }

    const compounds = data.PropertyTable.Properties.map((p: PubChemProperty) => {
      const cid = p.CID;
      return {
        id: `${cid}-${page}-${Date.now()}`,
        title: p.Title || p.IUPACName || `CID ${cid}`,
        formula: p.MolecularFormula || 'Unknown',
        weight: p.MolecularWeight || 0,
        iupacName: p.IUPACName || 'N/A',
        complexity: p.Complexity || 0,
        charge: p.Charge || 0,
        description: `Explore detailed structural and chemical properties for compound CID ${cid} on PubChem.`,
        url: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
        imageUrl: `https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=${cid}&t=l`
      };
    });

    return NextResponse.json({ compounds });
  } catch (err) {
    console.error('Chemistry API Error:', err);
    return NextResponse.json({ compounds: [], error: 'Failed to fetch chemistry data' }, { status: 500 });
  }
}
