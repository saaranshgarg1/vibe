import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import ItemEditor from "./ItemEditor";

export default function SectionEditor({ module, updateModule }: any) {
    const handleAddSection = () => {
        const newSection = {
            name: "",
            description: "",
            items: []
        };
        updateModule({
            ...module,
            sections: [...module.sections, newSection],
        });
    };

    const updateSection = (sectionIndex: number, newSection: any) => {
        const updatedSections = [...module.sections];
        updatedSections[sectionIndex] = newSection;
        updateModule({ ...module, sections: updatedSections });
    };

    return (
    <div className="space-y-4">
      {module.sections.map((section: any, index: number) => (
        <div key={index} className="space-y-2 border p-3 rounded-md bg-accent/10">
          <Input
            placeholder="Section name"
            value={section.name}
            onChange={(e) =>
              updateSection(index, { ...section, name: e.target.value })
            }
          />
          <ItemEditor
            section={section}
            updateSection={(newSec: any) => updateSection(index, newSec)}
          />
        </div>
      ))}

      <Button size="sm" variant="ghost" onClick={handleAddSection}>
        <Plus className="h-4 w-4 mr-1" />
        Add Section
      </Button>
    </div>
  );
}
