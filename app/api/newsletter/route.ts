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

export async function POST(request: Request) {

    const { email, name, last_name } = await request.json();

    const mailingListId = process.env.MAILJET_GROUP_ID;
    
    const newsletterData = {
        Name : `${name} ${last_name}`,
        Email: email,
        Properties: [
            {
                Name: name,
                Surname: last_name
            }
        ],
        Action: "addnoforce"
    };

    const response = await axios.post(`contactslist/${mailingListId}/managecontact`, newsletterData);
    const data = response.data;

    return new Response(JSON.stringify(data)); 
}

// Lista contatti
export async function GET() {
    const session = await getServerSession();
    
    const user = await prisma.user.findUnique({
      where: { email: session?.user?.email || "" },
    });

    if (!session || !user?.is_admin) {
        return new Response('Unauthorized', { status: 401 });
    }
    const mailingListId = process.env.MAILJET_GROUP_ID;

    const response = await axios.get(`contact?ContactsList=${mailingListId}`);
    const data = response.data;

    return new Response(JSON.stringify(data));
}

