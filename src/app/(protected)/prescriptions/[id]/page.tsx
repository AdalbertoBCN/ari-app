import { userIsLoged } from "@/actions/userActions";
import { HistoryTable } from "@/components/history-table";

interface PrescriptionProps {
    params: {
        id: string
    }
}

export default async function Prescription({ params:{ id } }:PrescriptionProps) {
    const { token } = await userIsLoged();

    const  { history }  = await fetch(`http://localhost:3333/history/${id}`,{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    }).then((res) => res.json());


    console.log(history)
    return (
        <div className="w-full">
            <HistoryTable history={history}/>
        </div>
    )
}