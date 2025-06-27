"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut, PlusSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { users } from '@/lib/data';

function ProjectPortalLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="flex -space-x-2 rtl:space-x-reverse">
        <div className="size-8 rounded-full bg-primary border-2 border-primary-foreground" />
        <div className="size-8 rounded-full bg-accent border-2 border-primary-foreground" />
      </div>
      <span className="text-lg font-headline font-semibold">Project Portal</span>
    </Link>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentUser = users[0];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <ProjectPortalLogo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/'}
                tooltip={{ children: 'Dashboard' }}
              >
                <Link href="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/projects/new'}
                tooltip={{ children: 'New Project' }}
              >
                <Link href="/projects/new">
                  <PlusSquare />
                  <span>New Project</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex-col !items-start gap-4">
          <Separator />
          <div className="flex items-center gap-3 px-2">
             <Avatar>
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{currentUser.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{currentUser.name}</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-muted-foreground justify-start">
                    <LogOut className="mr-2 size-3.5"/>
                    Log out
                </Button>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

function Separator() {
    return <div className="h-px w-full bg-border" />
}
