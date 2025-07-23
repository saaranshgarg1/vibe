import { useState, useEffect, useMemo } from "react";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserEnrollments } from "@/hooks/hooks";
import { useAuthStore } from "@/store/auth-store";

// Import new components
import { CourseCard } from "@/components/course/CourseCard";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";

export default function StudentCourses() {
  const [activeTab, setActiveTab] = useState("enrolled");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get the current user from auth store
  const { isAuthenticated } = useAuthStore();
  
  const { data: enrollmentsData, isLoading, error, refetch } = useUserEnrollments(
    currentPage,
  );

  const enrollments = enrollmentsData?.enrollments || [];
  const totalPages = enrollmentsData?.totalPages || 1;
  const currentPageFromAPI = enrollmentsData?.currentPage || 1;
  const totalDocuments = enrollmentsData?.totalDocuments || 0;

  // Filter enrollments based on completion status
  const activeEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => !enrollment.completed);
  }, [enrollments]);

  const completedEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => enrollment.completed);
  }, [enrollments]);

  // Update current page when API response changes
  useEffect(() => {
    if (currentPageFromAPI !== currentPage) {
      setCurrentPage(currentPageFromAPI);
    }
  }, [currentPageFromAPI, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const renderEnrollmentCard = (enrollment: Record<string, unknown>, index: number) => {
    return <CourseCard enrollment={enrollment} index={index} variant="dashboard" />;
  };

  // Add authentication check at the beginning of the render
  if (!isAuthenticated) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <EmptyState
          title="Authentication Required"
          description="Please log in to view your courses"
          actionText="Go to Login"
          onAction={() => window.location.href = '/auth'}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <EmptyState
          title="Error loading courses"
          description={typeof error === 'string' ? error : "Failed to load your courses"}
          actionText="Try Again"
          onAction={() => refetch()}
          variant="error"
        />
      </div>
    );
  }

  // Check if progress data is still loading
  const isProgressLoading = false;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="flex flex-col space-y-6">
        <section className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">Manage your learning journey</p>
        </section>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="enrolled">
              Enrolled ({isLoading ? "..." : activeEnrollments.length})
            </TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({isLoading ? "..." : completedEnrollments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enrolled" className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3 mb-4" />
                      <div className="h-2 bg-muted rounded animate-pulse mb-4" />
                      <div className="h-10 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activeEnrollments.length > 0 ? (
              <>
                <div className="space-y-2">
                  {activeEnrollments.map((enrollment, index) => 
                    renderEnrollmentCard(enrollment, index)
                  )}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalDocuments={totalDocuments}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState
                icon={<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />}
                title="No enrolled courses"
                description="Start your learning journey by enrolling in a course"
                actionText="Browse Available Courses"
                onAction={() => setActiveTab("available")}
              />
            )}
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <EmptyState
              icon={<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />}
              title="Available courses coming soon"
              description="Browse and enroll in new courses"
              actionText="Coming Soon"
            />
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded animate-pulse mb-2" />
                      <div className="h-3 bg-muted rounded animate-pulse w-2/3 mb-4" />
                      <div className="h-2 bg-muted rounded animate-pulse mb-4" />
                      <div className="h-10 bg-muted rounded animate-pulse" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : completedEnrollments.length > 0 ? (
              <div className="space-y-2">
                {completedEnrollments.map((enrollment, index) => 
                  renderEnrollmentCard(enrollment, index)
                )}
              </div>
            ) : (
              <EmptyState
                icon={<BookOpen className="h-12 w-12 text-muted-foreground mb-4" />}
                title="No completed courses yet"
                description="Complete your first course to see it here"
                actionText="View Enrolled Courses"
                onAction={() => setActiveTab("enrolled")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}