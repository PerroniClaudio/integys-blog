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

export async function GET(request: Request) {
    // Autorizzazione
    const session = await getServerSession();
    if (!session) {
        return new Response('Unauthorized', { status: 401 });
    }
    const authUser = await prisma.user.findUnique({
        where: { 
            email: session?.user?.email || "",
        },
    });
    
    if (!session || !authUser?.is_admin) {
        return new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(request.url);
    const withDeleted = url.searchParams.get('with_deleted') === 'true';

    const users = await prisma.user.findMany({
        where: {
            ...(withDeleted ? {} : { is_deleted: false })
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
            createdAt: true,
            updatedAt: true,
            is_deleted: true,
            is_new: true
        }
    });

    return new Response(JSON.stringify(users));
}

