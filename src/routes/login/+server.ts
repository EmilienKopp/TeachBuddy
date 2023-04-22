import { type RequestHandler, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    console.log('Dummy Login Detected');
    throw redirect(302,'/app/dashboard');
};

export const POST: RequestHandler = async (request) => {
    console.log('Dummy POST Login Detected', request);
    throw redirect(302,'/app/dashboard');
};