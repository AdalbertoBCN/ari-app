"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Medicine } from "@/lib/types"
import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SheetMedicine } from "./sheet-create-medicine"
import { AlertDelete } from "./alert-delete"
import { getLoginToken } from "@/actions/cookiesActions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { SheetPutMedicine } from "./sheet-put-medicine"

interface MedicineTableProps {
  medicines: Medicine[]
}

export function MedicineTable({ medicines }: MedicineTableProps) {
  const { toast } = useToast();
  const { refresh } = useRouter();

  const deleteMedicine = async (id: number) => {
    try {
      const token = await getLoginToken();

      const response = await fetch(`http://localhost:3333/medicines/${id}`, {
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
        <CardTitle className="text-xl font-bold">Medicações</CardTitle>
        <SheetMedicine>
          <Button size="sm">Adicionar</Button>
        </SheetMedicine>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Nome</TableHead>
              <TableHead className="hidden md:table-cell w-[30%]">Uso</TableHead>
              <TableHead className="w-[40%] md:w-[30%]">Dosagem</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {medicines.map(med => (
              <TableRow key={med.id}>
                <TableCell className="py-3">
                  <div className="font-medium">{med.name}</div>
                  <div className="text-xs text-muted-foreground md:hidden">{med.useCase}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3">{med.useCase}</TableCell>
                <TableCell className="py-3">{med.dosage}</TableCell>
                <TableCell className="py-3">
                  <div className="flex space-x-2 justify-end">
                    <SheetPutMedicine medicine={med}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </SheetPutMedicine>
                    <AlertDelete
                      description="Você tem certeza que deseja excluir esta medicação?"
                      onDelete={() => deleteMedicine(med.id)}
                      title="Excluir Medicação"
                    >
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDelete>
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