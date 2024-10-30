import { userIsLoged } from "@/actions/userActions";
import { PrescriptionTable } from "@/components/prescription-table";

export default async function Medicines(){
    const { token, id } = await userIsLoged();

    const { prescriptions } = await fetch(`http://localhost:3333/prescriptions/${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }).then((res) => res.json());
    
    return (
        <div className="flex-1">
            <div className="mx-auto max-w-screen-lg space-y-2">
                <PrescriptionTable prescriptions={prescriptions}/>
            </div>
        </div>
    );
}