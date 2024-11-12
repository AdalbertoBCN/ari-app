"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dependents } from "@/lib/types"
import { Trash2 } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { SheetDependent } from "./sheet-create-dependents"
import { userIsLoged } from "@/actions/userActions"
import { useRouter } from "next/navigation"
import { AlertDelete } from "./alert-delete"

interface DependentsTableProps {
  dependents: Dependents[]
}

export function DependentsTable({ dependents }: DependentsTableProps) {
  const { refresh } = useRouter();
  async function deleteDependent(id: number) {
    const { token } = await userIsLoged();
    await fetch(`http://localhost:3333/responsible/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    refresh();
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Dependentes</CardTitle>
        <SheetDependent>
          <Button size="sm">Adicionar dependente</Button>
        </SheetDependent>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Nome</TableHead>
              <TableHead className="hidden md:table-cell w-[40%]">Email</TableHead>
              <TableHead className="w-[20%]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dependents.map(dep => (
              <TableRow key={dep.id}>
                <TableCell className="py-3">
                  <div className="font-medium">{dep.name}</div>
                  <div className="text-xs text-muted-foreground md:hidden">{dep.email}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell py-3">{dep.email}</TableCell>
                <TableCell className="py-3">
                  <div className="flex justify-end">
                  <AlertDelete
                      description="Você tem certeza que deseja excluir este dependente?"
                      onDelete={() => deleteDependent(dep.id)}
                      title="Excluir Dependente"
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