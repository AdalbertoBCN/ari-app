"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, ExternalLink, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { getLoginToken } from "@/actions/cookiesActions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { AlertDelete } from "./alert-delete"
import { SheetPrescription } from "./sheet-create-prescription"
import { useDepends } from "@/hooks/useDenpends"
import { useMemo } from "react"

export interface Prescription {
  id: number;
  name: string;
  note: string | null;
  frequency: number;
  startDate: Date;
  endDate: Date;
  patient: {
    id: number;
    name: string;
  };
  medicine: {
    id: number;
    name: string;
    useCase: string;
    dosage: string;
  };
}

interface PrescriptionTableProps {
  prescriptions: Prescription[]
}

export function PrescriptionTable({ prescriptions }: PrescriptionTableProps) {
  const { toast } = useToast();
  const { refresh } = useRouter();
  const { filteredDependents } = useDepends();

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric'
    })
  }

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(pres => {
      return filteredDependents.map(dep => dep.id).includes(pres.patient.id);
    });
  }, [filteredDependents, prescriptions]);

  const formatPeriod = (startDate: Date, endDate: Date, frequency: number) => {
    const start = formatDate(startDate)
    const end = endDate ? formatDate(endDate) : 'Contínuo'
    return `A cada ${frequency} horas\n${start} - ${end}`
  }

  const deletePrescription = async (id: number) => {
    try {
      const token = await getLoginToken();

      const response = await fetch(`http://localhost:3333/prescriptions/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir medicação');
      }

      toast({
        title: "Sucesso",
        description: "Medicação excluída com sucesso",
        variant: "success",
      });
      
      refresh();
    } catch {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir a medicação",
        variant: "destructive"
      });
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Prescrições</CardTitle>
        <SheetPrescription>
          <Button size="sm">Adicionar Prescrição</Button>
        </SheetPrescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">Paciente</TableHead>
              <TableHead className="w-[30%]">Medicamento</TableHead>
              <TableHead className="hidden md:table-cell w-[25%]">Período</TableHead>
              <TableHead className="w-[15%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrescriptions.map(pres => (
              <TableRow key={pres.id}>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{pres.patient.name}</span>
                    <span className="text-xs text-muted-foreground">ID: {pres.patient.id}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{pres.medicine.name}</span>
                    <span className="text-xs text-muted-foreground">{pres.medicine.dosage}</span>
                    <span className="text-xs text-muted-foreground md:hidden">
                      {formatPeriod(pres.startDate, pres.endDate, pres.frequency)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3">
                  <div className="whitespace-pre-line text-sm">
                    {formatPeriod(pres.startDate, pres.endDate, pres.frequency)}
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 justify-end">
                  <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                  <AlertDelete 
                    onDelete={() => deletePrescription(pres.id)} 
                    description="Você tem certeza que deseja excluir esta prescrição?"
                    title="Excluir Prescrição"
                  >
                      <Button size="sm" variant="outline"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDelete>
                  <Link href={`/prescriptions/${pres.id}`} className="w-full md:w-auto">
                    <Button size="sm" variant="outline" className="w-full"><ExternalLink className="h-4 w-4" /></Button>
                  </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}