import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SectionForm from "./SectionForm";
import { PlusCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  moduleIndex: number;
}

export default function ModuleForm({ moduleIndex }: Props) {
  const [sections, setSections] = React.useState<number[]>([0]);

  const addSection = () => {
    setSections((prev) => [...prev, prev.length]);
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Module {moduleIndex + 1}</h2>
        <Input placeholder="Module Name" className="w-full" />

        {sections.map((id) => (
          <SectionForm key={id} sectionIndex={id} />
        ))}

        <Button onClick={addSection} variant="ghost">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Section
        </Button>
      </CardContent>
    </Card>
  );
}
