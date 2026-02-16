import { getServerSession } from 'next-auth';
import axios from '@/lib/axios';
import prisma from '@/lib/prisma/client';

/**
 * 
 * Scommentare nel caso si ritorni su mailerlite

export async function POST(request: Request) {

    const { email, name, last_name } = await request.json();
    
    const newsletterData = {
        email,
        fields: {
            name,
            last_name
        } 
    };

    const response = await axios.post('/subscribers', newsletterData);
    const data = response.data;


    return new Response(JSON.stringify(data)); 


}

*/

// Liste contatti
// export async function GET() {
//     const session = await getServerSession();
    
//     const user = await prisma.user.findUnique({
//       where: { email: session?.user?.email || "" },
//     });

//     if (!session || !user?.is_admin) {
//         return new Response('Unauthorized', { status: 401 });
//     }
//     const mailingListId = process.env.MAILJET_GROUP_ID;

//     const response = await axios.get(`contact?ContactsList=${mailingListId}`);
//     const data = response.data;

//     return new Response(JSON.stringify(data));
// }

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    const { id : userId } = await Promise.resolve(params);
    // Validazione
    if(!userId){
      return new Response("Missing ID parameter", { status: 404 });
    } 

    // Autorizzazione
    const session = await getServerSession();
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }
    const authUser = await prisma.user.findUnique({
        where: { email: session?.user?.email || "" },
    });
    if (!session || !authUser?.is_admin) {
        return new Response('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findFirst({
        where: { 
            id: userId, 
            // is_deleted: false 
        },
        select: {
            id: true,
            name: true,
            surname: true,
            email: true,
            phone: true,
            company: true,
            emailVerified: true,
            occupation: true,
            company_address: true,
            is_admin: true,
            is_deleted: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if (!user) {
        return new Response('Not Found', { status: 404 });
    }

    return new Response(JSON.stringify(user));
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    const { id: userId } = await Promise.resolve(params);
    // Validazione
    if(!userId){
        return new Response("Missing ID parameter", { status: 404 });
    }

    // Autorizzazione
    const session = await getServerSession();
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }
    const authUser = await prisma.user.findUnique({
        where: { email: session?.user?.email || "" },
    });
    if (!session || !authUser?.is_admin) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Campi da aggiornare
    const { name, surname, email, phone, company, occupation, company_address, is_admin, is_deleted } = await req.json();
    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            name,
            surname,
            email,
            phone,
            company,
            occupation,
            company_address,
            is_admin,
            is_deleted,
        }
    });

    return new Response(JSON.stringify(user));
}
    

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    const { id: userId } = await Promise.resolve(params);
    // Validazione
    if(!userId){
      return new Response("Missing ID parameter", { status: 404 });
    } 

    // Autorizzazione
    const session = await getServerSession();
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }
    const authUser = await prisma.user.findUnique({
        where: { email: session?.user?.email || "" },
    });
    if (!session || !authUser?.is_admin) {
        return new Response('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            is_deleted: true
        }
    });

    return new Response(JSON.stringify(user));
}

