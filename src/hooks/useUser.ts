"use client"

import { useEffect, useState } from "react";
import { userIsLoged } from "@/actions/userActions";
import { useDepends } from "./useDenpends";

export function useUser() {
    const [user, setUser] = useState<{ id: number, name: string, email: string, birthDate:string }>({
        id: 0,
        name: "",
        email: "",
        birthDate: "",
    });

    const { setDependents } = useDepends();

    useEffect(() => {
        async function fetchUser() {
            const { id, token } = await userIsLoged();

            const response = await fetch(`http://localhost:3333/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            });

            const data = await response.json() as { user: { id: number, name: string, email: string, birthDate:string } };
            
            setDependents(data.user, token);

            setUser(data.user);
        }

        fetchUser();
    }, []);

    return user;
}
