import { type RequestHandler, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    console.log('Dummy Login Detected');
    throw redirect(302,'/app/dashboard');
};

export const POST: RequestHandler = async ({request}) => {
    const body = await request.formData();
    if(body.get('email') != 'emilien.kopp@gmail.com' || body.get('password') != '1l0v3r3@d1ng') {
        console.log('Wrong Credentials');
        throw redirect(302,'/');
    }
    throw redirect(302,'/app/generator');
};