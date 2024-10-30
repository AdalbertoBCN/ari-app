"use server"

import { getLoginToken } from "./cookiesActions";

export async function userIsLoged() {
    const token = await getLoginToken();

    const response = await fetch("http://localhost:3333/loged", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    const { id }:{id:number} = await response.json();

    return {
        sucess: response.ok,
        id: id,
        token
    }
}