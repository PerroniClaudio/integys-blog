import axios from '../../../lib/axios'

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