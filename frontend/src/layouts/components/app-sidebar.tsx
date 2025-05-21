"use client"

import * as React from "react"
import { Link, useMatches } from "@tanstack/react-router"
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  PlusCircle,
  GraduationCap,
  Users,
  BookOpenCheck,
  Clock,
  ListTodo,
  ChevronRight
} from "lucide-react"

import { NavUser } from "./nav-user"
import { User } from "@/lib/store/auth-store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "@/components/ui/sidebar"

export function AppSidebar({ user }: { user: User | null }) {
  const matches = useMatches();
  const currentPath = matches.length ? matches[matches.length - 1].pathname : "";
  
  // Navigation items for teachers
  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/teacher",
      isActive: currentPath === "/teacher",
    },
    {
      title: "Courses",
      icon: BookOpen,
      url: "#",
      isActive: currentPath.includes("/teacher/courses"),
      items: [
        {
          title: "All Courses",
          url: "/teacher/courses",
        },
        {
          title: "Create Course",
          url: "/teacher/courses/create",
        },
        {
          title: "Create Article",
          url: "/teacher/courses/articles/create",
        },
      ],
    },
    {
      title: "Content",
      icon: FileText,
      url: "#",
      isActive: currentPath.includes("/teacher/content"),
      items: [
        {
          title: "Articles",
          url: "/teacher/content/articles",
        },
        {
          title: "Assignments",
          url: "/teacher/content/assignments",
        },
        {
          title: "Quizzes",
          url: "/teacher/content/quizzes",
        },
      ],
    },
    {
      title: "Students",
      icon: Users,
      url: "/teacher/students",
      isActive: currentPath.includes("/teacher/students"),
    },
    {
      title: "Assessments",
      icon: BookOpenCheck,
      url: "/teacher/assessments",
      isActive: currentPath.includes("/teacher/assessments"),
    },
    {
      title: "Schedule",
      icon: Clock,
      url: "/teacher/schedule",
      isActive: currentPath.includes("/teacher/schedule"),
    },
    {
      title: "Testing",
      icon: ListTodo,
      url: "/teacher/testing",
      isActive: currentPath.includes("/teacher/testing"),
    },
  ];

  // Format user data for NavUser component
  const userData = {
    name: user?.name || "Teacher",
    email: user?.email || "teacher@example.com",
    avatar: user?.avatar || "",
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center h-14 px-4">
          <Link to="/teacher" className="flex items-center font-semibold text-lg">
            <GraduationCap className="h-6 w-6 mr-2" />
            <span className="font-bold">Vibe LMS</span>
          </Link>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              {item.items ? (
                <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
                  <div className="w-full"> {/* Use div instead of SidebarMenuItem to avoid nested <li> */}
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subIndex}>
                            <SidebarMenuSubButton 
                              asChild 
                              isActive={currentPath === subItem.url}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ) : (
                <SidebarMenuButton 
                  asChild 
                  isActive={item.isActive}
                  className="w-full"
                >
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="mt-6">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild
                variant="outline"
                className="w-full"
              >
                <Link to="/teacher/courses/create">
                  <PlusCircle className="size-4" />
                  <span>Create New Course</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>
  )
}
