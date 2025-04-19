import type { PageServerLoad, Actions } from './$types';

import { redirect, fail } from '@sveltejs/kit';
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import { formSchema } from "$lib/types/forms/login";
import { loginUser, constructCookieOpts, directusError, client } from '$logic/directus';
import { login } from '@directus/sdk';

// Set in days - sync this with the Setting from Directus.
const REFRESH_TOKEN_TTL = 7;

// This makes sure that the login page is only available if the user is not logged in yet
export const load = (async ({ locals, url }) => {
    const redirectedFrom = url.searchParams.get('redirectedFrom')
    if (locals.token) redirect(302, redirectedFrom ? redirectedFrom : `/profile`)

    return {
        form: await superValidate(zod(formSchema)),
    };
}) satisfies PageServerLoad;


export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod(formSchema));
        const { cookies, request, fetch, locals } = event;

        const token = locals.token ?? null;
        const directus = client(fetch, token);

        const email = form.data.email;
        const password = form.data.password;

        if (!form.valid) return fail(400, { form });

        try {
            const login = await directus.login(email, password);
            console.log('🩺: login', login)
            // save cookies
            cookies.set('access_token', (login.access_token as string),
                constructCookieOpts(Math.floor(login.expires! / 1000))
            );

        } catch (e) {
            directusError(e)
        }

        return { form };
    }
};