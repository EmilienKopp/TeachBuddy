import { type RequestHandler, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    throw redirect(302,'/app/dashboard');
};