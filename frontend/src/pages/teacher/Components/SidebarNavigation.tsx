import React, { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Video,
  BookOpenCheck,
  BookMarked,
} from "lucide-react";

interface ContentItem {
  id: string;
  type: string;
  title?: string;
}

interface Section {
  id: string;
  title: string;
  contentItems: ContentItem[];
}

interface Module {
  id: string;
  name: string;
  sections: Section[];
}

interface Props {
  modules: Module[];
  selected: {
    moduleId: string | null;
    sectionId: string | null;
    contentItemId: string | null;
  };
  onSelect: (selected: Props["selected"]) => void;
}

export function SidebarNavigation({ modules, selected, onSelect }: Props) {
  const [expandedModules, setExpandedModules] = React.useState<string[]>([]);
  const [expandedSections, setExpandedSections] = React.useState<string[]>([]);

  const selectedRef = useRef<HTMLButtonElement | null>(null);
  const prevSelected = useRef<Props["selected"]>({
    moduleId: null,
    sectionId: null,
    contentItemId: null,
  });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (
      selected.moduleId &&
      selected.moduleId !== prevSelected.current.moduleId &&
      !expandedModules.includes(selected.moduleId)
    ) {
      setExpandedModules((prev) => [...prev, selected.moduleId!]);
    }

    if (
      selected.sectionId &&
      selected.sectionId !== prevSelected.current.sectionId &&
      !expandedSections.includes(selected.sectionId)
    ) {
      setExpandedSections((prev) => [...prev, selected.sectionId!]);
    }

    prevSelected.current = selected;
  }, [selected]);

  useEffect(() => {
    if (selectedRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    }
  }, [selected]);

  return (
    <ScrollArea className="w-64 h-full border-r bg-muted/40">
      <div className="p-4 space-y-3">
        {modules.map((mod) => (
          <div key={mod.id} className="space-y-2">
            <button
              className={cn(
                "text-left w-full font-medium flex items-center gap-2 px-2 py-1 rounded-md hover:bg-muted transition",
                selected.moduleId === mod.id && "text-primary"
              )}
              onClick={() => {
                toggleModule(mod.id);
                onSelect({
                  moduleId: mod.id,
                  sectionId: null,
                  contentItemId: null,
                });
              }}
            >
              {expandedModules.includes(mod.id) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <BookMarked className="h-4 w-4" />
              {mod.name || "Untitled Module"}
            </button>

            {expandedModules.includes(mod.id) &&
              mod.sections.map((section) => (
                <div key={section.id} className="ml-4 space-y-1">
                  <button
                    ref={
                      selected.sectionId === section.id &&
                      selected.moduleId === mod.id &&
                      !selected.contentItemId
                        ? selectedRef
                        : null
                    }
                    className={cn(
                      "text-left w-full text-sm flex items-center gap-2 px-2 py-1 rounded hover:bg-muted",
                      selected.sectionId === section.id &&
                        selected.moduleId === mod.id &&
                        "text-primary"
                    )}
                    onClick={() => {
                      toggleSection(section.id);
                      onSelect({
                        moduleId: mod.id,
                        sectionId: section.id,
                        contentItemId: null,
                      });
                    }}
                  >
                    {expandedSections.includes(section.id) ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronRight className="h-3 w-3" />
                    )}
                    <Folder className="h-3 w-3" />
                    {section.title || "Untitled Section"}
                  </button>

                  {expandedSections.includes(section.id) &&
                    section.contentItems.map((item, itemIndex) => {
                      const isSelected =
                        selected.contentItemId === item.id &&
                        selected.sectionId === section.id &&
                        selected.moduleId === mod.id;

                      return (
                        <button
                          key={item.id}
                          ref={isSelected ? selectedRef : null}
                          className={cn(
                            "ml-4 text-left text-sm flex items-center gap-2 text-muted-foreground px-2 py-1 rounded hover:bg-muted",
                            isSelected && "text-primary"
                          )}
                          onClick={() =>
                            onSelect({
                              moduleId: mod.id,
                              sectionId: section.id,
                              contentItemId: item.id,
                            })
                          }
                        >
                          {item.type === "video" ? (
                            <Video className="h-3 w-3" />
                          ) : item.type === "blog" ? (
                            <FileText className="h-3 w-3" />
                          ) : item.type === "quiz" ? (
                            <BookOpenCheck className="h-3 w-3" />
                          ) : (
                            <FileText className="h-3 w-3" />
                          )}
                          {item.title?.trim() ||
                            `${item.type?.toUpperCase()} `}
                        </button>
                      );
                    })}
                </div>
              ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
