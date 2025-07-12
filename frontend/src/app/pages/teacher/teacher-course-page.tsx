
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem,
  SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  SidebarInset, SidebarProvider, SidebarTrigger, SidebarFooter
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { useCourseVersionById, useItemsBySectionId, useItemById } from "@/hooks/hooks";
import { useAuthStore } from "@/store/auth-store";
import { useCourseStore } from "@/store/course-store";
import { Link, Navigate, useRouter } from "@tanstack/react-router";
import type { Item } from "@/types/item-container.types";
import { Skeleton } from "@/components/ui/skeleton";
import { AuroraText } from "@/components/magicui/aurora-text";
import {
  ChevronRight,
  BookOpen,
  Play,
  FileText,
  HelpCircle,
  Target,
  Home,
  GraduationCap,
  AlertCircle,
  ArrowLeft,
  CheckCircle
} from "lucide-react";

// Helper function to get icon for item type
const getItemIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'video':
      return <Play className="h-3 w-3" />;
    case 'blog':
    case 'article':
      return <FileText className="h-3 w-3" />;
    case 'quiz':
      return <HelpCircle className="h-3 w-3" />;
    default:
      return <FileText className="h-3 w-3" />;
  }
};

// Helper function to sort items by order property
const sortItemsByOrder = (items: any[]) => {
  return [...items].sort((a, b) => {
    const orderA = a.order || '';
    const orderB = b.order || '';
    return orderA.localeCompare(orderB);
  });
};

export default function TeacherCoursePage() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [sectionItems, setSectionItems] = useState<Record<string, any[]>>({});
  const [activeSectionInfo, setActiveSectionInfo] = useState<{
    moduleId: string;
    sectionId: string;
  } | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const { user } = useAuthStore();
  const router = useRouter();
  const COURSE_ID = useCourseStore.getState().currentCourse?.courseId || "";
  const VERSION_ID = useCourseStore.getState().currentCourse?.versionId || "";
  const { setCurrentCourse } = useCourseStore();

  // Fetch course version data
  const { data: courseVersionData, isLoading: versionLoading, error: versionError } =
    useCourseVersionById(VERSION_ID);


  // Section items fetching
  const shouldFetchItems = Boolean(activeSectionInfo?.moduleId && activeSectionInfo?.sectionId);
  const sectionModuleId = activeSectionInfo?.moduleId ?? '';
  const sectionId = activeSectionInfo?.sectionId ?? '';
  const {
    data: currentSectionItems,
    isLoading: itemsLoading
  } = useItemsBySectionId(
    shouldFetchItems ? VERSION_ID : '',
    shouldFetchItems ? sectionModuleId : '6831b98e1f79c52d445c5db5',
    shouldFetchItems ? sectionId : '6831b98e1f79c52d445c5db6'
  );

  // Fetch individual item details when an item is selected
  const shouldFetchItem = Boolean(selectedItemId && COURSE_ID && VERSION_ID);
  const {
    data: itemData,
    isLoading: itemLoading,
    error: itemError
  } = useItemById(
    shouldFetchItem ? COURSE_ID : '',
    shouldFetchItem ? VERSION_ID : '',
    shouldFetchItem ? selectedItemId! : ''
  );

  // No progress fetching: initial load state is not set from user progress

  // Update section items when data is loaded
  useEffect(() => {
    if (
      shouldFetchItems &&
      activeSectionInfo?.sectionId &&
      currentSectionItems &&
      !itemsLoading
    ) {
      const itemsArray = (currentSectionItems as any)?.items ||
        (Array.isArray(currentSectionItems) ? currentSectionItems : []);
      const sortedItems = sortItemsByOrder(itemsArray);
      setSectionItems(prev => ({
        ...prev,
        [activeSectionInfo.sectionId]: sortedItems
      }));
    }
  }, [currentSectionItems, itemsLoading, activeSectionInfo, shouldFetchItems]);

  // Effect to set current item when item data is fetched
  useEffect(() => {
    if (itemData && !itemLoading) {
      const item = (itemData as any)?.item || itemData;
      if (item && typeof item === 'object' && item._id) {
        setCurrentItem(item);
      }
    }
  }, [itemData, itemLoading]);

  // Handle item selection
  const handleSelectItem = (moduleId: string, sectionId: string, itemId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedSectionId(sectionId);
    setSelectedItemId(itemId);
    if (!sectionItems[sectionId]) {
      setActiveSectionInfo({ moduleId, sectionId });
    }
    setExpandedModules(prev => ({ ...prev, [moduleId]: true }));
    setExpandedSections(prev => ({ ...prev, [sectionId]: true }));
    setCurrentCourse({
      ...useCourseStore.getState().currentCourse,
      moduleId,
      sectionId,
      itemId
    });
  };

  // Toggle module expansion
  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  // Toggle section expansion
  const toggleSection = (moduleId: string, sectionId: string) => {
    setActiveSectionInfo({ moduleId, sectionId });
    setExpandedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  if (versionLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (versionError) {
    return (
      <Card className="mx-auto max-w-md">
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="text-destructive mb-2">
              <Target className="h-8 w-8 mx-auto"></Target>
            </div>
            <p className="text-destructive font-medium">Error loading course data</p>
            <p className="text-muted-foreground text-sm mt-1">Please try again later</p>
            <Button asChild className="mt-4">
              <Link to="/student">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const modules = (courseVersionData as any)?.modules || [];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        {/* Course Navigation Sidebar */}
        <Sidebar variant="inset" className="border-r border-border/40 bg-sidebar/50 backdrop-blur-sm">
          <SidebarHeader className="border-b border-border/40 bg-gradient-to-b from-sidebar/80 to-sidebar/60">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg overflow-hidden">
                <img
                  src="https://continuousactivelearning.github.io/vibe/img/logo.png"
                  alt="Vibe Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[1.15rem] font-bold leading-none">
                  <AuroraText colors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}><b>ViBe</b></AuroraText>
                </span>
                <p className="text-xs text-muted-foreground">Learning Platform</p>
              </div>
            </div>
            <Separator className="opacity-50" />
          </SidebarHeader>

          <SidebarContent className="bg-card/50 pl-2 shadow-sm border border-border/30">
            <ScrollArea className="flex-1 transition-colors">
              <SidebarMenu className="space-y-1 text-sm pr-0">
                {modules.map((module: any) => {
                  const moduleId = module.moduleId;
                  const isModuleExpanded = expandedModules[moduleId];
                  const isCurrentModule = moduleId === selectedModuleId;

                  return (
                    <SidebarMenuItem key={moduleId}>
                      <SidebarMenuButton
                        onClick={() => toggleModule(moduleId)}
                        isActive={isCurrentModule}
                        className="group relative h-10 px-3 w-full rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/5 hover:shadow-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/15 data-[state=active]:to-primary/5 data-[state=active]:text-primary data-[state=active]:shadow-sm"
                      >
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform duration-200 flex-shrink-0 ${isModuleExpanded ? 'rotate-90' : ''}`}
                        />
                        <div className="flex-1 text-left min-w-0 ml-2">
                          <div className="font-medium text-xs truncate" title={module.name}>
                            {module.name.length > 34 ? `${module.name.substring(0, 31)}...` : module.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            {module.sections?.length || 0} sections
                          </div>
                        </div>
                      </SidebarMenuButton>

                      {isModuleExpanded && module.sections && (
                        <SidebarMenuSub className="ml-0 mt-1 space-y-1">
                          {module.sections.map((section: any) => {
                            const sectionId = section.sectionId;
                            const isSectionExpanded = expandedSections[sectionId];
                            const isCurrentSection = sectionId === selectedSectionId;
                            const isLoadingItems = activeSectionInfo?.sectionId === sectionId && itemsLoading;

                            return (
                              <SidebarMenuSubItem key={sectionId}>
                                <SidebarMenuSubButton
                                  onClick={() => toggleSection(moduleId, sectionId)}
                                  isActive={isCurrentSection}
                                  className="group relative h-8 px-3 w-full rounded-md text-xs transition-all duration-200 hover:bg-accent/10 hover:text-accent-foreground data-[state=active]:bg-accent/15 data-[state=active]:text-accent-foreground"
                                >
                                  <ChevronRight
                                    className={`h-3 w-3 flex-shrink-0 transition-transform duration-200 ${isSectionExpanded ? 'rotate-90' : ''}`}
                                  />
                                  <div className="font-medium truncate flex-1 min-w-0 ml-2" title={section.name}>
                                    {section.name.length > 27 ? `${section.name.substring(0, 24)}...` : section.name}
                                  </div>
                                </SidebarMenuSubButton>

                                {isSectionExpanded && (
                                  <SidebarMenuSub className="ml-0 mt-1 space-y-0.5">
                                    {isLoadingItems ? (
                                      <div className="space-y-1 p-2">
                                        <Skeleton className="h-4 w-full rounded" />
                                        <Skeleton className="h-4 w-4/5 rounded" />
                                      </div>
                                    ) : sectionItems[sectionId] ? (
                                      sortItemsByOrder(sectionItems[sectionId]).map((item: any) => {
                                        const itemId = item._id;
                                        const isCurrentItem = itemId === selectedItemId;
                                        return (
                                          <SidebarMenuSubItem key={itemId}>
                                            <SidebarMenuSubButton
                                              onClick={() => handleSelectItem(moduleId, sectionId, itemId)}
                                              isActive={isCurrentItem}
                                              className="group relative h-8 px-3 w-full rounded-md transition-all duration-200 hover:bg-accent/10 data-[state=active]:bg-primary/10 data-[state=active]:text-primary justify-start"
                                            >
                                              <div className="flex items-center gap-2 w-full min-w-0">
                                                <div className={`p-0.5 rounded transition-colors flex-shrink-0 ${isCurrentItem
                                                  ? "bg-primary/15 text-primary"
                                                  : "bg-accent/15 text-accent-foreground group-hover:bg-accent/25"
                                                  }`}>
                                                  {getItemIcon(item.type)}
                                                </div>
                                                <div className="flex-1 text-left min-w-0">
                                                  <div className="text-xs font-medium truncate w-full" title={currentItem?.name || 'Loading...'}>
                                                    {(() => {
                                                      const itemsInSection = sortItemsByOrder(sectionItems[sectionId] || []);
                                                      const itemIndex = itemsInSection.findIndex((i: any) => i._id === itemId);
                                                      let label = '';
                                                      if (selectedItemId === itemId && itemLoading) {
                                                        label = 'Loading...';
                                                      } else if (selectedItemId === itemId && currentItem?.name) {
                                                        label = currentItem.name.length > 18 ? `${currentItem.name.substring(0, 15)}...` : currentItem.name;
                                                      } else {
                                                        label = ' ';
                                                      }
                                                      const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase();
                                                      return label===' '?`${typeLabel} ${itemIndex + 1}`:`${label}`;
                                                    })()}
                                                  </div>
                                                </div>
                                              </div>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        );
                                      })
                                    ) : (
                                      <div className="p-3 text-center">
                                        <div className="text-xs text-muted-foreground">No items found</div>
                                      </div>
                                    )}
                                  </SidebarMenuSub>
                                )}
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
          <SidebarFooter className="border-t border-border/40 bg-gradient-to-t from-sidebar/80 to-sidebar/60 ">
            <SidebarMenu className="space-y-1 pl-2 py-3">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-9 px-3 w-full rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/5 hover:shadow-sm"
                >
                  <Link to="/student" className="flex items-center gap-3">
                    <div className="p-1 rounded-md bg-accent/15">
                      <Home className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-9 px-3 w-full rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/5 hover:shadow-sm"
                >
                  <Link to="/student/courses" className="flex items-center gap-3">
                    <div className="p-1 rounded-md bg-accent/15">
                      <GraduationCap className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="text-sm font-medium">Courses</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Separator className="my-2 opacity-50" />

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="h-10 px-3 w-full rounded-lg transition-all duration-200 hover:bg-gradient-to-r hover:from-accent/20 hover:to-accent/5 hover:shadow-sm"
                >
                  <Link to="/student/profile" className="flex items-center gap-3">
                    <Avatar className="h-6 w-6 border border-border/20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/15 to-primary/5 text-primary font-bold text-xs">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-medium truncate" title={user?.name || 'Profile'}>{user?.name || 'Profile'}</div>
                      <div className="text-xs text-muted-foreground">View Profile</div>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1  bg-gradient-to-br from-background via-background to-background/95">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 px-4">
            <SidebarTrigger className="-ml-1 h-8 w-8 rounded-md hover:bg-accent/10 transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="text-xl font-medium text-foreground truncate" title={currentItem ? currentItem.name : 'Select content to begin learning'}>
                <b>{currentItem ? currentItem.name : 'Select content to begin learning'}</b>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <ThemeToggle />
            </div>
          </header>

          <div className="flex-1 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.01] via-transparent to-secondary/[0.01] pointer-events-none" />

            {currentItem ? (
              <div className="relative z-10 h-full p-8">
                <Card className="max-w-2xl mx-auto">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">{currentItem.name}</h2>
                    <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentItem.content || '' }} />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center relative z-10">
                <div className="text-center max-w-md">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 rounded-full blur-xl opacity-60" />
                    <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                      <BookOpen className="h-12 w-12 text-primary mx-auto" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Ready to Learn?
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Select an item from the course navigation to begin your learning journey and unlock new knowledge.
                  </p>
                  <Button
                    variant="outline"
                    className="transition-all duration-200 hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Browse Content
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}