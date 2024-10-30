'use client'

import * as React from 'react'
import { Check, ChevronRight, User, Users, UserX } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar"
import { ScrollArea } from "./ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDepends } from "@/hooks/useDenpends"

export function Calendars() {
  const { 
    allDependents, 
    filteredDependents, 
    addDependent, 
    removeDependent, 
    removeAllDependents, 
    addAllDependents, 
    onlyUser 
  } = useDepends()

  return (
    <Collapsible defaultOpen={true} className="group/collapsible">
      <SidebarGroupLabel
        asChild
        className="group/label w-full text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <CollapsibleTrigger className="flex flex-1 items-center">
            <ChevronRight className="mr-1 size-4 shrink-0 transition-transform group-data-[state=open]/collapsible:rotate-90" />
            <span className="truncate">My Calendars</span>
          </CollapsibleTrigger>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onlyUser}
                    className="rounded p-1 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-accent focus:ring-offset-2"
                    aria-label="Only User"
                  >
                    <User className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Only User</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={removeAllDependents}
                    className="rounded p-1 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-accent focus:ring-offset-2"
                    aria-label="Remove All Dependents"
                  >
                    <UserX className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove All Dependents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={addAllDependents}
                    className="rounded p-1 text-sidebar-foreground/50 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-accent focus:ring-offset-2"
                    aria-label="Add All Dependents"
                  >
                    <Users className="size-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add All Dependents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </SidebarGroupLabel>
      <CollapsibleContent>
        <ScrollArea className="h-28">
          <SidebarGroupContent>
            <SidebarMenu>
              {allDependents.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    className="w-full"
                    onClick={() => {
                      if (filteredDependents.some((dep) => dep.id === item.id)) {
                        removeDependent(item.id)
                      } else {
                        addDependent(item)
                      }
                    }}
                  >
                    <div
                      data-active={filteredDependents.some((dep) => dep.id === item.id)}
                      className="group/calendar-item flex aspect-square size-4 shrink-0 items-center justify-center rounded-sm border border-sidebar-border text-sidebar-primary-foreground data-[active=true]:border-sidebar-primary data-[active=true]:bg-sidebar-primary"
                    >
                      <Check className="hidden size-3 group-data-[active=true]/calendar-item:block" />
                    </div>
                    <span className="truncate">{item.name}</span>
                    <span className="text-sm text-muted-foreground">{item.email}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  )
}