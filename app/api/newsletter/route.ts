import axios from '../../lib/axios';

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
