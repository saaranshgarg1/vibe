// ✅ Final merged version (259 lines): Preserves teammate's original structure, fixes rendering issue, uses teacherCoursesData properly with CourseCard

"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Edit3, Save, X, FileText, Plus, Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Pagination } from "@/components/ui/Pagination";
import { useNavigate } from "@tanstack/react-router";
import {
  useUpdateCourse,
  useDeleteCourse,
  useCreateCourseVersion,
  useDeleteCourseVersion,
  useCourseById,
  useCourseVersionById,
  useTeacherCourses,
} from "@/hooks/hooks";
import { useAuthStore } from "@/store/auth-store";
import { bufferToHex } from "@/utils/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CourseType } from "@/types/course.types";

export default function TeacherCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.userId;

  console.log("User ID:", userId);
  if (!userId) return <div>Loading user info...</div>;

  const {
    data: teacherCoursesData,
    isLoading,
    error,
    refetch,
  } = useTeacherCourses(userId, currentPage, limit);

  const enrollments = teacherCoursesData?.enrollments || [];

  const totalPages = teacherCoursesData?.totalPages || 1;
  const totalDocuments = teacherCoursesData?.totalDocuments || 0;
  const currentPageFromAPI = teacherCoursesData?.currentPage || 1;

  useEffect(() => {
    if (currentPageFromAPI !== currentPage) {
      setCurrentPage(currentPageFromAPI);
    }
  }, [currentPageFromAPI]);

  const invalidateAllQueries = () => {
    queryClient.invalidateQueries();
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    console.error("Error fetching teacher courses:", error);
    return <div>Error loading courses.</div>;
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
            <p className="text-muted-foreground mt-1">Manage your courses and versions</p>
          </div>
          <Button onClick={() => (window.location.href = "/courses/add")}>Create Course</Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="ml-auto">
            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Courses per page" />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20].map((value) => (
                  <SelectItem key={value} value={value.toString()}>
                    {value} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
{enrollments.map((enrollment) => (
  <CourseCard
    key={enrollment._id}
    courseId={bufferToHex(enrollment.courseId)}
    onInvalidate={invalidateAllQueries}
    searchQuery={searchQuery}
  />
))}
</div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalDocuments={totalDocuments}
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>
    </div>
  );
}

function CourseCard({ courseId, onInvalidate,searchQuery }: { courseId: string; onInvalidate: () => void;searchQuery: string }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValues, setEditValues] = useState({ name: "", description: "" });
  const [newVersion, setNewVersion] = useState({ version: "", description: "" });
  const [showForm, setShowForm] = useState(false);

  const { data: course, isLoading, error } = useCourseById(courseId);
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();
  const createVersion = useCreateCourseVersion();
  const deleteVersion = useDeleteCourseVersion();

  const toggleEdit = () => {
    setEditing(true);
    setEditValues({ name: course.name, description: course.description });
  };

  const handleSave = async () => {
    await updateCourse.mutateAsync({
      params: { path: { id: courseId } },
      body: editValues,
    });
    queryClient.invalidateQueries();
    setEditing(false);
    onInvalidate();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this course?")) return;
    await deleteCourse.mutateAsync({ params: { path: { id: courseId } } });
    onInvalidate();
  };

  const handleCreateVersion = async () => {
    if (!newVersion.version || !newVersion.description) return;
    await createVersion.mutateAsync({
      params: { path: { id: courseId } },
      body: newVersion,
    });
    setShowForm(false);
    onInvalidate();
  };

  if (isLoading) return <p>Loading...</p>;
  if (error || !course) return <p>Error loading course</p>;

  if (
    searchQuery &&
    !course.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !course.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) {
    return null;
  }

  return (
    <Card>
      <CardHeader onClick={() => !editing && setExpanded(!expanded)} className="cursor-pointer">
        <div className="flex justify-between items-center">
          <CardTitle>{course.name}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); toggleEdit(); }}>
              <Edit3 className="h-3 w-3 mr-1" /> Edit
            </Button>
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(); }} className="text-destructive">
              <Trash2 className="h-3 w-3 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      {expanded && (
        <CardContent className="space-y-4">
          {editing ? (
            <div className="space-y-2">
              <Input value={editValues.name} onChange={(e) => setEditValues({ ...editValues, name: e.target.value })} />
              <Textarea value={editValues.description} onChange={(e) => setEditValues({ ...editValues, description: e.target.value })} />
              <div className="flex gap-2">
                <Button onClick={handleSave}><Save className="h-3 w-3 mr-1" /> Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)}><X className="h-3 w-3 mr-1" /> Cancel</Button>
              </div>
            </div>
          ) : (
            <p>{course.description}</p>
          )}

          <div>
            <div className="flex justify-between items-center">
              <h4>Versions</h4>
              <Button variant="outline" size="sm" onClick={() => setShowForm(true)}>
                <Plus className="h-3 w-3 mr-1" /> New
              </Button>
            </div>
            {showForm && (
              <div className="space-y-2 mt-2">
                <Input placeholder="Version" value={newVersion.version} onChange={(e) => setNewVersion({ ...newVersion, version: e.target.value })} />
                <Textarea placeholder="Description" value={newVersion.description} onChange={(e) => setNewVersion({ ...newVersion, description: e.target.value })} />
                <Button onClick={handleCreateVersion}><Save className="h-3 w-3 mr-1" /> Save Version</Button>
              </div>
            )}

            <div className="mt-3 space-y-2">
              {course.versions?.map((vId: string) => (
                <VersionCard key={vId} versionId={vId} courseId={courseId} onInvalidate={onInvalidate} deleteVersion={deleteVersion} />
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function VersionCard({ versionId, courseId, onInvalidate, deleteVersion }: any) {
  const { data: version, isLoading, error } = useCourseVersionById(versionId);
  const handleDelete = async () => {
    if (!confirm("Delete version?")) return;
    await deleteVersion.mutateAsync({ params: { path: { courseId, versionId } } });
    onInvalidate();
  };
  if (isLoading) return <p>Loading version...</p>;
  if (error || !version) return <p>Error loading version</p>;
  return (
    <div className="p-2 border rounded flex justify-between items-center">
      <div>
        <p className="font-semibold">{version.version}</p>
        <p className="text-sm text-muted-foreground">{version.description}</p>
      </div>
      <Button size="sm" variant="outline" onClick={handleDelete} className="text-destructive">
        <Trash2 className="h-3 w-3 mr-1" /> Delete
      </Button>
    </div>
  );
}
