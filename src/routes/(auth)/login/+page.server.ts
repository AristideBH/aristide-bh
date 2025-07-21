import type { Actions, PageServerLoad } from './$types';

import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { formSchema } from "$lib/types/forms/login";
import { client, constructCookieOpts, directusError } from '$logic/directus';


export const load: PageServerLoad = async ({ locals, url }) => {
    const redirectedFrom = url.searchParams.get('redirectedFrom')
    if (locals.token) redirect(302, redirectedFrom ? redirectedFrom : `/profile`)

    return {
        form: await superValidate(zod4(formSchema))
    };
};


export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, zod4(formSchema));
        const { cookies, fetch, locals } = event;

        const token = locals.token ?? null;
        const directus = client(fetch, token);
        const email = form.data.email as string;
        const password = form.data.password as string;

        if (!form.valid) return fail(400, { form });

        try {
            const login = await directus.login(email, password);
            cookies.set('access_token', (login.access_token as string),
                constructCookieOpts(Math.floor(login.expires! / 1000))
            );
        } catch (e) {
            directusError(e)
        }

        return { form };
    }
};