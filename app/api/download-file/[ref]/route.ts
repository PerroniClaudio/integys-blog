import { client } from "@/app/lib/sanity";
import { getServerSession } from "next-auth";

type blogData = {
  limited: boolean;
}
export async function GET(req: Request, { params }: { params: { ref: string } }) {
  const { ref } = params;

  if(!ref){
    return new Response("Missing ref parameter", { status: 404 });
  }

  try {

    const query = `
        *[_type == 'blog' && references("${ref}")]{
          limited
        }
      `;
  
    const data : blogData[] = await client.fetch(query);
  
    if (!data.find(post => post.limited == false)){
      // controlla se l'utente è loggato. 
      const session = await getServerSession();
  
      // Se non è loggato restituisci errore.
      if(!session){
        return new Response("Unauthorized", { status: 403 });
      }
    } 
  
    // Qui o l'utente è loggato o il file è pubblico. Quindi si può inviare
    const fileQuery = `
      *[_type == 'sanity.fileAsset' && _id == "${ref}"]{
        url
      }
    `;
  
    const fileData = await client.fetch(fileQuery);
  
    if (!fileData || fileData.length === 0) {
      return new Response("File not found", { status: 404 });
    }
  
    const fileUrl = fileData[0].url;
  
    const fileResponse = await fetch(fileUrl);
  
    if (!fileResponse.ok) {
      return new Response("Error downloading file", { status: 500 });
    }
  
    const fileBlob = await fileResponse.blob();
  
    return new Response(fileBlob, {
      headers: {
        "Content-Type": fileResponse.headers.get("Content-Type") || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${ref}.pdf"`
      }
    });


  } catch (error : any) {
    return new Response (error);
  }

    
}
