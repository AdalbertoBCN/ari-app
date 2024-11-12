import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator
} from "@/components/ui/sidebar"
import { ClipboardPlus, Pill, Users, Watch } from "lucide-react"
import Link from "next/link"
import { Calendar } from "./calendar"
import { Calendars } from "./my-calendars"
import { NavUser } from "./nav-user"

export function AppSidebar() {
  const links = [
    {
      name: "Medicamentos",
      href: "/medicines",
      Icon: Pill,
    },
    {
      name: "Prescrições",
      href: "/prescriptions",
      Icon: ClipboardPlus,
    },
    {
      name: "Dependentes",
      href: "/dependents",
      Icon: Users,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
      <div className="flex items-center space-x-3">
        <Link href="/">
          <div className="flex h-10 w-10 aspect-square items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Watch className="h-6 w-6" />
          </div>
        </Link>
          <div>
            <h1 className="text-lg font-semibold leading-none tracking-tight">
              ARI
            </h1>
            <p className="text-sm text-muted-foreground">
              Agendamento de Remédios para Idosos
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <Calendar />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupContent>
            <Calendars />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((link) => {
                const { Icon, href, name } = link;

                return (
                  <SidebarMenuItem key={name}>
                    <SidebarMenuButton asChild>
                      <Link href={href}>
                        <Icon />
                        <span>{name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}


