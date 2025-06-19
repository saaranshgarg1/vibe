import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectItem , SelectContent , SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

export default function ItemEditor({ section , updateSection }: any) {
    const handleAddItem = () => {
        const newItem = {
            title: "",
            type: "video", 
            content: ""
        };
        updateSection({
            ...section,
            items: [...section.items, newItem]
        });
    };

    const updateItem = (index: number, newItem: any) => {
        const updatedItems = [...section.items];
        updatedItems[index] = newItem;
        updateSection({ ...section, items: updatedItems });
    };


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Items</Label>
                {section.items.map((item: any, index: number) => (
                    <div key={index} className="flex gap-2 items-center ">
                        <Input
                            placeholder="Item Name"
                            value={item.name}
                            onChange={(e) => updateItem(index, { ...item, name: e.target.value })}
                        />
                        <Select
                            value={item.type}
                            onValueChange={(value) => updateItem(index, { ...item, type: value })}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Select item type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="blog">Blog</SelectItem>
                                <SelectItem value="quiz">Quiz</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                ))}

                <Button variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                </Button>
            </div>
        </div>
    );
}