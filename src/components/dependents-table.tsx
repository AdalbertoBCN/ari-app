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

interface DependentsTableProps {
  dependents: Dependents[]
}

export function DependentsTable({ dependents }: DependentsTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold">Dependentes</CardTitle>
        <Button size="sm">Adicionar dependente</Button>
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
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
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