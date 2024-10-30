import { userIsLoged } from "@/actions/userActions";
import { HistoryCalendar } from "@/components/history-calendar";

export default async function Home() {
  const { token, id } = await userIsLoged();

  const response = await fetch(`http://localhost:3333/history/all/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
  }});

  const { history } = await response.json();

  return (
    <div className="flex-1">
        <HistoryCalendar history={history} />
    </div>
  );
}
