import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import SectionEditor from "./SectionEditor";

export default function ModuleEditor({ courseName, setCourseName }: any) {
    const handleAddModule = () => {
        const newModule = {
            title: "",
            description: "",
            sections: []
        };
        setCourseName({
            ...courseName,
            modules: [...courseName.modules, newModule]
        });
    };

    const updateModule = (index: number, newModule: any) => {
        const updatedModules = [...courseName.modules];
        updatedModules[index] = newModule;
        setCourseName({ ...courseName, modules: updatedModules });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Modules</Label>
                <Button variant="outline" size="sm" onClick={handleAddModule}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Module
                </Button>
            </div>

            <div className="space-y-4">
                {courseName.modules.map((module: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center space-y-4 border p-3 rounded-md bg-accent/10">
                        <Input
                            placeholder="Module Name"
                            value={module.name}
                            onChange={(e) => updateModule(index, { ...module, name: e.target.value })}
                        />
                        <SectionEditor
                            module={module}
                            updateModule={(newModule: any) => updateModule(index, newModule)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}