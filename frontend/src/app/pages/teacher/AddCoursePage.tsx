import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import ModuleForm from "./components/ModuleForm";



export default function AddCoursePage() {
  const [modules, setModules] = React.useState<number[]>([0]);

  const addModule = () => {
    setModules((prev) => [...prev, prev.length]);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Add New Course</h1>

      <Card>
        <CardContent className="p-4 space-y-4">
          <Input placeholder="Course Name" className="w-full" />
          <Textarea placeholder="Course Description" className="w-full" />
        </CardContent>
      </Card>

      <div className="space-y-4">
        {modules.map((id) => (
          <ModuleForm key={id} moduleIndex={id} />
        ))}

        <Button onClick={addModule} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Module
        </Button>
      </div>
    </div>
  );
}
