import { userIsLoged } from "@/actions/userActions";
import { MedicineTable } from "@/components/medicine-table";

export default async function Medicines(){
    const { token } = await userIsLoged();

    const { medicines } = await fetch("http://localhost:3333/medicines",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
    }).then((res) => res.json());
    
    return (
        <div className="flex-1">
            <div className="max-w-screen-lg mx-auto space-y-2">
                <MedicineTable medicines={medicines}/>
            </div>
        </div>
    );
}