import axios from '../../lib/axios'


export async function POST(request: Request) {

    const { token } = await request.json();
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

    const res = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token}`
    )
    if (res.data.success) {
      return new Response("success!", { status: 200 })
    } else {
      return new Response("Failed Captcha", { status: 400 })
    }
}