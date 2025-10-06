import type { Cookies, Handle } from '@sveltejs/kit';
import type { JwtPayload } from 'jsonwebtoken';

import jwt from "jsonwebtoken";
import { redirect } from '@sveltejs/kit';
import { PUBLIC_DIRECTUS_URL, PUBLIC_UMAMI_SRC } from '$env/static/public';
import { client, constructCookieOpts } from '$logic/directus';

const TOKEN_EXPIRATION_BUFFER = 300;

// exchange the refresh token for an access token
async function refreshAccessToken(cookies: Cookies) {
    const res = await fetch(PUBLIC_DIRECTUS_URL + "/auth/refresh", {
        method: "POST",
        mode: "cors",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",

        },
        body: JSON.stringify({ refresh_token: cookies.get('refresh_token') }),
    });

    if (res.status >= 300) {
        cookies.delete('refresh_token', { path: '/' });
        cookies.delete('access_token', { path: '/' });
        throw new Error("Refresh Token Status != 200");
    }
    const data = (await res.json()).data;

    cookies.set("refresh_token", data.refresh_token, constructCookieOpts(60 * 60 * 24 * 30));
    cookies.set("access_token", data.access_token, constructCookieOpts(Math.floor(data.expires / 1000)));
}

function isTokenExpired(jwtPayload: JwtPayload | null) {
    return jwtPayload?.exp ? jwtPayload.exp < Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_BUFFER : true;

}

function shouldProtectRoute(url: string) {
    return url.split("/").includes("(protected)")
}

function buildCSP(url: URL) {
    // Les directives de base. Elles seront modifiées ensuite.
    const directives = {
        'default-src': ["'self'"],
        'script-src': ["'self'"],
        'style-src': ["'self'"],
        'connect-src': ["'self'", PUBLIC_DIRECTUS_URL],
        'child-src': ["'self'", 'blob:', PUBLIC_DIRECTUS_URL],
        'frame-ancestors': ["'self'", PUBLIC_DIRECTUS_URL],
        'img-src': ["'self'", 'data:', PUBLIC_DIRECTUS_URL],
    };

    // 1. GESTION DU MODE DE DÉVELOPPEMENT SVELTEKIT (VITE)
    // En dev, SvelteKit (Vite) utilise des scripts et styles inline, 
    // et WebSocket pour le Hot Module Replacement (HMR).
    if (process.env.NODE_ENV === 'development') {
        // 'unsafe-inline' est requis pour la majorité des styles et scripts Sveltekit/Vite en dev
        directives['script-src'].push("'unsafe-inline'", "'unsafe-eval'");
        directives['style-src'].push("'unsafe-inline'");

        // HMR (Hot Module Replacement) utilise les WebSockets.
        directives['connect-src'].push(`ws://${url.hostname}:5173`, `wss://${url.hostname}:5173`);
    } else {
        // 2. GESTION DU MODE DE PRODUCTION SVELTEKIT
        // En prod, SvelteKit utilise des scripts et styles avec hachage (nonce/sha).
        // Cependant, le mode auto-hébergé nécessite souvent un assouplissement minimal.
        // Puisque vous voyez des erreurs `style-src-attr` (styles d'attributs), 
        // nous ajoutons 'unsafe-inline' UNIQUEMENT pour les styles, ou 'unsafe-hashes'.
        // Utiliser 'unsafe-inline' pour 'style-src' est souvent un compromis acceptable.
        directives['style-src'].push("'unsafe-inline'");
        // Si vous utilisez des gestionnaires d'événements inline (ex: onclick="..."), 
        // vous aurez besoin de 'unsafe-inline' ou 'unsafe-hashes' pour 'script-src'.
        // L'erreur mentionne "Source: this.__e=event", c'est Sveltekit qui génère du code inline, 
        // donc on ajoute temporairement 'unsafe-inline' pour les scripts.
        directives['script-src'].push("'unsafe-inline'");
    }


    if (PUBLIC_UMAMI_SRC) {
        try {
            // Utilisation de l'URL du script Umami pour extraire le domaine
            const umamiUrl = new URL(PUBLIC_UMAMI_SRC);

            // Autoriser le script Umami
            directives['script-src'].push(umamiUrl.origin);

            // Umami doit pouvoir se connecter à son serveur pour envoyer les données
            directives['connect-src'].push(umamiUrl.origin);

        } catch (e) {
            console.error("PUBLIC_UMAMI_URL n'est pas une URL valide. La CSP est peut-être incomplète.", e);
        }
    }

    // ----------------------------------------------------
    // --- CONVERSION EN CHAÎNE DE CARACTÈRES ---
    // ----------------------------------------------------

    return Object.entries(directives)
        .map(([key, values]) => `${key} ${values.join(' ')}`)
        .join('; ');
}

export const handle: Handle = async ({ event, resolve }) => {
    const { cookies, url, fetch, locals } = event

    const token = locals.token ?? null;
    // const directus = client(fetch, token);

    if (cookies.get('access_token') || cookies.get('refresh_token')) {
        let jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token') || '') as jwt.JwtPayload | null : null;

        if (isTokenExpired(jwtPayload) || !cookies.get('access_token')) {
            try {
                await refreshAccessToken(cookies);
                jwtPayload = cookies.get('access_token') ? jwt.decode(cookies.get('access_token') || '') as jwt.JwtPayload | null : null;
            } catch {
                cookies.delete('refresh_token', { path: '/' });
                cookies.delete('access_token', { path: '/' });
            }
        }

        event.locals.user = (jwtPayload as jwt.JwtPayload)?.id;
        event.locals.token = cookies.get('access_token');
    }

    if (event.route.id && shouldProtectRoute(event.route.id) && !event.locals.user) {
        throw redirect(302, `/login?redirectedFrom=${encodeURIComponent(url.pathname)}`);
    }

    // this is needed so that the response headers from SvelteKit do include the correct header to allow the browser to parse json requests
    // Résoudre l'événement pour obtenir la réponse
    const response = await resolve(event, {
        filterSerializedResponseHeaders: (key, value) => {
            return key.toLowerCase() === 'content-type';
        },
    });

    // --- LOGIQUE CSP MISE À JOUR ---
    const newCSP = buildCSP(url);
    response.headers.set('Content-Security-Policy', newCSP);

    return response;
};