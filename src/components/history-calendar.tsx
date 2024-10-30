"use client"

import { getLoginToken } from "@/actions/cookiesActions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDate } from "@/hooks/useDate"
import { useDepends } from "@/hooks/useDenpends"
import { addDays, format, isAfter, isBefore, isSameDay, isToday, startOfDay, subDays } from "date-fns"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo } from "react"

interface Log {
  id: number
  dateIngestion: string
}

interface History {
  id: number
  medicineId: number
  userId: number
  userName: string
  medicineName: string
  dosage: string
  useCase: string
  notes: string
  frequencyHours: number
  startDate: string
  endDate: string
  logs: Log[]
}

interface HistoryCalendarProps {
  history: History[]
}

export function HistoryCalendar({ history }: HistoryCalendarProps = { history: [] }) {
    const { selectedDate, setSelectedDate } = useDate();
    const { refresh } = useRouter();
    const { filteredDependents } = useDepends();

    const filteredHistory = useMemo(() => {
        return history.filter((h) => filteredDependents.some((d) => d.id === h.userId))
    },[history, filteredDependents])

    const visibleDates = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => addDays(subDays(selectedDate, 3), i))
    }, [selectedDate])

    const TOLERANCE_MS = 5 * 60 * 1000; // 5 minutos de tolerância

    const getMedicineStatus = (history: History, date: Date) => {
        const today = startOfDay(new Date())
        const log = history.logs.find((log) => isSameDay(new Date(log.dateIngestion), date))

        if (!log) {
            if (isBefore(date, today)) return "nao-tomado"
            if (isSameDay(date, today)) return "pendente-hoje"
            return "pendente-futuro"
        }

        const logDate = new Date(log.dateIngestion)
        const startDate = new Date(history.startDate)
        const frequencyMs = history.frequencyHours * 60 * 60 * 1000

        // Ordenar os logs por data de ingestão
        const orderedLogs = history.logs.sort(
            (a, b) => new Date(a.dateIngestion).getTime() - new Date(b.dateIngestion).getTime()
        )

        const currentDoseIndex = orderedLogs.findIndex(
            (l) => new Date(l.dateIngestion).getTime() === logDate.getTime()
        )

        if (currentDoseIndex === 0) {
            // Primeira dose: comparar com a data de início
            const expectedTime = new Date(startDate.getTime())
            const diffMs = logDate.getTime() - expectedTime.getTime()

            if (Math.abs(diffMs) <= TOLERANCE_MS) return "no-horario"
            return diffMs < 0 ? "cedo" : "atrasado"
        }

        // Para doses subsequentes: comparar com a dose anterior
        const previousLogDate = new Date(orderedLogs[currentDoseIndex - 1].dateIngestion)
        const expectedTime = new Date(previousLogDate.getTime() + frequencyMs)
        const diffMs = logDate.getTime() - expectedTime.getTime()

        if (Math.abs(diffMs) <= TOLERANCE_MS) return "no-horario"
        return diffMs < 0 ? "cedo" : "atrasado"
    }

    const statusColors: Record<string, string> = {
        "no-horario": "bg-green-500",
        atrasado: "bg-yellow-500",
        cedo: "bg-yellow-500",
        "pendente-hoje": "bg-blue-500",
        "pendente-futuro": "bg-gray-500",
        "nao-tomado": "bg-red-500",
    }

    const statusText: Record<string, string> = {
        "no-horario": "Tomado no horário",
        atrasado: "Tomado atrasado",
        cedo: "Tomado cedo",
        "pendente-hoje": "Pendente para hoje",
        "pendente-futuro": "Agendado",
        "nao-tomado": "Não tomado",
    }

    const handlePreviousWeek = () => {
        setSelectedDate(subDays(selectedDate, 7))
    }

    const handleNextWeek = () => {
        setSelectedDate(addDays(selectedDate, 7))
    }

    const handleInjest = async (history: History) => {
            const token = await getLoginToken();

            await fetch(`http://localhost:3333/logs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    historyId: history.id
                })
            })

            refresh();
    }

    return (
        <div className="w-full max-w-6xl mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={handlePreviousWeek} variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Semana anterior</span>
                </Button>
                <h2 className="text-lg md:text-2xl font-bold ">Calendário de Medicamentos</h2>
                <Button onClick={handleNextWeek} variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Próxima semana</span>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8">
                {visibleDates.map((date) => (
                    <Card
                        key={date.toISOString()}
                        className={`${
                            isSameDay(date, selectedDate) ? "border-primary shadow-lg" : "border-border"
                        } transition-all duration-150 ease-in-out ${isSameDay(date, selectedDate) ? "md:scale-105" : ""}`}
                        onClick={() => setSelectedDate(date)}
                    >
                        <CardHeader className="p-2 md:p-4">
                            <CardTitle className="text-center text-sm md:text-base">
                                {format(date, "dd/MM")}
                                <span className="block text-xs text-muted-foreground">{format(date, "EEEE")}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 md:p-4">
                            <div className="flex flex-wrap justify-center gap-1 md:gap-2">
                                {filteredHistory.map((history) => {
                                    const status = getMedicineStatus(history, date)
                                    return (
                                        <>
                                            {isAfter(date, addDays(new Date(history.startDate), -1)) && isBefore(date, addDays(new Date(history.endDate), 1)) &&
                                            (
                                                <Popover key={`${history.medicineId}-${date.toISOString()}`}>
                                                <PopoverTrigger>
                                                    <Badge className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${statusColors[status]}`} />
                                                </PopoverTrigger>
                                                <PopoverContent className="w-60 md:w-72">
                                                    <h3 className="font-semibold">{history.medicineName}</h3>
                                                    <p>Dosagem: {history.dosage}</p>
                                                    <p>Status: {statusText[status]}</p>
                                                    <p>Agendado: {format(new Date(history.startDate), "HH:mm")}</p>
                                                    <p>Uso: {history.useCase}</p>
                                                </PopoverContent>
                                            </Popover>
                                            )}
                                        
                                        </>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="mt-4 p-4">
                <CardHeader>
                    <CardTitle className="text-lg md:text-2xl">Medicamentos para {format(selectedDate, "dd/MM/yyyy")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {filteredHistory.map((history) => {
                            const status = getMedicineStatus(history, selectedDate)
                            const log = history.logs.find((log) => isSameDay(new Date(log.dateIngestion), selectedDate))
                            return (
                                <li key={history.medicineId} className="flex flex-col md:flex-row md:items-center md:justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{history.medicineName}</h4>
                                        <p className="text-sm text-muted-foreground">Dosagem: {history.dosage}</p>
                                        <p className="text-sm text-muted-foreground">Uso: {history.useCase}</p>
                                        {history.notes && <p className="text-sm text-muted-foreground">Notas: {history.notes}</p>}
                                    </div>
                                    <div className="flex gap-x-2 items-center mt-2 md:mt-0">
                                        {isToday(selectedDate) && history.logs.sort((a, b) => new Date(b.dateIngestion).getTime() - new Date(a.dateIngestion).getTime())[0].dateIngestion < format(new Date(), "yyyy-MM-dd'T'HH:mm:ss")
                                        && (
                                            <Button onClick={() => handleInjest(history)} variant="outline" size="sm">
                                                Ingerir
                                            </Button>
                                        )}
                                        <Badge className={`${statusColors[status]} mr-2`}>{statusText[status]}</Badge>
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span className="text-sm">
                                                {log
                                                    ? format(new Date(log.dateIngestion), "HH:mm")
                                                    : format(new Date(history.startDate), "HH:mm")}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}