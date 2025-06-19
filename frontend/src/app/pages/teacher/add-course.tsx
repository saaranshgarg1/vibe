import { useState } from "react";
import { BookOpen, Save } from "lucide-react";
import { SidebarInset } from "@/components/ui/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CourseForm from "@/components/teacher/CourseForm";
import ModuleEditor from "@/components/teacher/ModuleEditor";


export default function AddCourse() {
    const [courseName, setCourseName] = useState({
        name: "",
        description: "",
        modules: []
    });
    
    const handleSaveCourse = () => {
        // Logic to save the course
        console.log("Course saved:", courseName);
    };


    return (
        <SidebarInset className="p-6 bg-background min-h-screen ">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <h1 className="text-2xl font-bold">Add New Course</h1>
                    </div>
                    <Button onClick={handleSaveCourse} className="flex gap-2">
                        <Save className="h-4 w-4" />
                        Save Course
                    </Button>
                </div>

                <Separator />

                <Card>
                    <CardContent className="p-6 space-y-6">
                        <CourseForm
                            courseName={courseName}
                            setCourseName={setCourseName}
                        />
                        <ModuleEditor
                            courseName={courseName}
                            setCourseName={setCourseName}
                        />
                    </CardContent>
                </Card>
            </div>                   
        </SidebarInset>
    );

}