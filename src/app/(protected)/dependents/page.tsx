import { userIsLoged } from "@/actions/userActions";
import { DependentsTable } from "@/components/dependents-table";

export default async function Dependents(){
    const { token, id } = await userIsLoged();

    const { responsibles } = await fetch(`http://localhost:3333/responsible/${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }).then((res) => res.json());
    
    return (
        <div className="flex-1">
            <div className="mx-auto max-w-screen-lg space-y-2">
                <DependentsTable dependents={responsibles}/>
            </div>
        </div>
    );
}