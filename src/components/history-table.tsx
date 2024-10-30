"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History } from "@/lib/types"

interface HistoryTableProps {
  history: History
}

export function HistoryTable({ history }: HistoryTableProps) {

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

const TOLERANCE_MS = 5 * 60 * 1000; // 5 minutos de tolerância

const getLogStatus = (log: { id: number; dateIngestion: string }) => {
    const logDate = new Date(log.dateIngestion);
    const startDate = new Date(history.startDate);
    const frequencyMs = history.frequencyHours * 60 * 60 * 1000;

    // Ordenar os logs por data de ingestão
    const orderedLogs = history.logs.sort(
        (a, b) => new Date(a.dateIngestion).getTime() - new Date(b.dateIngestion).getTime()
    );

    const currentDoseIndex = orderedLogs.findIndex(
        (l) => new Date(l.dateIngestion).getTime() === logDate.getTime()
    );

    if (currentDoseIndex === 0) {
        // Primeira dose: comparar com a data de início
        const expectedTime = new Date(startDate.getTime());
        const diffMs = logDate.getTime() - expectedTime.getTime();

        if (Math.abs(diffMs) <= TOLERANCE_MS) return "on-time";
        return diffMs < 0 ? "early" : "late";
    }

    // Para doses subsequentes: comparar com a dose anterior
    const previousLogDate = new Date(orderedLogs[currentDoseIndex - 1].dateIngestion);
    const expectedTime = new Date(previousLogDate.getTime() + frequencyMs);
    const diffMs = logDate.getTime() - expectedTime.getTime();

    if (Math.abs(diffMs) <= TOLERANCE_MS) return "on-time";
    return diffMs < 0 ? "early" : "late";
};


  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Histórico de Medicação</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Nome</TableCell>
                  <TableCell>{history.medicineName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Dosagem</TableCell>
                  <TableCell>{history.dosage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Uso</TableCell>
                  <TableCell>{history.useCase}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Notas</TableCell>
                  <TableCell>{history.notes}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Frequência</TableCell>
                  <TableCell>A cada {history.frequencyHours} horas</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Data de Início</TableCell>
                  <TableCell>{formatDate(history.startDate)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div className="w-full md:w-1/2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data de Ingestão</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell>{formatDate(log.dateIngestion)}</TableCell>
                    <TableCell className="flex gap-x-2">
                      {getLogStatus(log) === "on-time" && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {getLogStatus(log) === "late" && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                      {getLogStatus(log) === "early" && (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span>
                        {getLogStatus(log) === "on-time" && "No horário"}
                        {getLogStatus(log) === "late" && "Atrasado"}
                        {getLogStatus(log) === "early" && "Adiantado"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}