import axios from '../../lib/axios'


export async function POST(request: Request) {

    const { token } = await request.json();
    const hcaptchaSecretKey = process.env.HCAPTCHA_SECRET_KEY;

    if (!hcaptchaSecretKey || !token) {
      return new Response("Missing hCaptcha credentials", { status: 400 })
    }

    const payload = new URLSearchParams({
      secret: hcaptchaSecretKey,
      response: token,
    });

    const res = await axios.post(
      "https://hcaptcha.com/siteverify",
      payload.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    if (res.data.success) {
      return new Response("success!", { status: 200 })
    } else {
      return new Response("Failed Captcha", { status: 400 })
    }
}
