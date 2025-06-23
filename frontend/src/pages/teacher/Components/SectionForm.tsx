import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Video from "@/components/video"; 
interface Props {
  sectionIndex: number;
}

interface SectionItem {
  type: string;
  videoUrl?: string;
  blog?: string;
  quiz?: string;
  points?: string;
  range?: [number, number];
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function extractYouTubeId(url: string): string | null {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default function SectionForm({ sectionIndex }: Props) {
  const [sectionTitle, setSectionTitle] = useState("");
  const [items, setItems] = useState<SectionItem[]>([]);

  const addItem = () => {
    setItems([
      ...items,
      {
        type: "",
        videoUrl: "",
        blog: "",
        quiz: "",
        points: "",
        range: [0, 300], // default clip range
      },
    ]);
  };

  const updateItem = (
    index: number,
    field: keyof SectionItem,
    value: any
  ) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  return (
    <Card className="bg-muted/20">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-medium text-lg">Section {sectionIndex + 1}</h3>

        <Input
          placeholder="Section Title"
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          className="w-full"
        />

        {items.map((item, idx) => {
          const videoId = extractYouTubeId(item.videoUrl || "");
          const start = Math.floor(item.range?.[0] ?? 0);
          const end = Math.floor(item.range?.[1] ?? 0);

          return (
            <div
              key={idx}
              className="border p-4 rounded-md space-y-3 bg-muted/10"
            >
              <Select
                value={item.type}
                onValueChange={(val) => updateItem(idx, "type", val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="blog">Blog</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>

              {item.type === "video" && (
                <>
                  <Input
                    placeholder="YouTube Video URL"
                    value={item.videoUrl}
                    onChange={(e) =>
                      updateItem(idx, "videoUrl", e.target.value)
                    }
                    className="w-full"
                  />

                  {videoId && (
                    <>
                      {/* ✅ Using your custom dashboard player */}
                      <Video
                        URL={item.videoUrl || ""}
                        startTime={formatTime(start)}
                        endTime={formatTime(end)}
                        points={item.points}
                        doGesture={false}
                      />

                      <div className="mt-4">
                        <label className="text-sm font-medium text-muted-foreground mb-1 block">
                          Select Clip Range (Start to End)
                        </label>
                        <Slider
                          value={item.range || [0, 300]}
                          onValueChange={(val) =>
                            updateItem(idx, "range", val as [number, number])
                          }
                          max={600} // optional upper limit
                          step={1}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>Start: {formatTime(start)}</span>
                          <span>End: {formatTime(end)}</span>
                        </div>
                      </div>

                      <Input
                        placeholder="Points"
                        type="number"
                        value={item.points}
                        onChange={(e) =>
                          updateItem(idx, "points", e.target.value)
                        }
                        className="w-full"
                      />
                    </>
                  )}
                </>
              )}

              {item.type === "blog" && (
                <Input
                  placeholder="Blog Link / Content"
                  value={item.blog}
                  onChange={(e) => updateItem(idx, "blog", e.target.value)}
                  className="w-full"
                />
              )}

              {item.type === "quiz" && (
                <Input
                  placeholder="Quiz Content / Link"
                  value={item.quiz}
                  onChange={(e) => updateItem(idx, "quiz", e.target.value)}
                  className="w-full"
                />
              )}
            </div>
          );
        })}

        <Button
          type="button"
          variant="ghost"
          onClick={addItem}
          className="w-full"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Content Item
        </Button>
      </CardContent>
    </Card>
  );
}
