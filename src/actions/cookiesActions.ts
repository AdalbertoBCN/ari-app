"use server"

import { cookies } from 'next/headers';

const cookieName = 'ARI_login_token';

export async function getLoginToken() {
    return cookies().get(cookieName)?.value;
}

export async function setLoginToken(token: string) {
    cookies().set(cookieName, token, { httpOnly: true, secure: true, path: '/', maxAge: 3600 });
}

export async function removeLoginToken() {
    cookies().set(cookieName, '', { httpOnly: true, secure: true, path: '/', maxAge: -1 });
}