import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";


export default function CourseForm({ courseName, setCourseName }: any) {
    return (
        <div className="space-y-4">
            <div>
                <Label className="text-lg font-semibold">Course Details</Label>
                <Input
                    placeholder="Enter course name"
                    value={courseName.name}
                    onChange={(e) => setCourseName({ ...courseName, name: e.target.value })}

                />
            </div>
            <div>
                <Label className="text-lg font-semibold">Course Description</Label>
                <Textarea
                    placeholder="Enter course description"
                    value={courseName.description}
                    onChange={(e) => setCourseName({ ...courseName, description: e.target.value })}

                />
            </div>
        </div>
    );
}
   