import { Check, ChevronDown, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useStore } from "zustand";
import { Board, projectStore } from "@/stores/project-store";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function BoardCombobox({
  setIsAddBoardDialogOpen,
}: {
  setIsAddBoardDialogOpen: (open: boolean) => void;
}) {
  const projectSelected = useStore(projectStore, (s) => s.projectSelected);
  const selectBoard = useStore(projectStore, (s) => s.selectBoard);
  const boardSelected = useStore(projectStore, (s) => s.boardSelected);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleSelectBoard = (board: Board) => {
    if (board.id.toString() === value) return setOpen(false);
    setValue(board.id.toString());
    selectBoard(board);
    setOpen(false);
  };

  useEffect(() => {
    if (boardSelected) {
      setValue(boardSelected.id.toString());
    } else {
      setValue("");
    }
  }, [boardSelected]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between cursor-pointer"
        >
          {value
            ? projectSelected?.boards.find(
                (board) => board.id.toString() === value
              )?.name
            : "เลือกบอร์ด"}
          <ChevronDown
            className={`opacity-50 transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem
                className="justify-center cursor-pointer"
                onSelect={() => setIsAddBoardDialogOpen(true)}
              >
                <Plus className="w-4 h-4" />
                เพิ่มบอร์ด
              </CommandItem>
              {projectSelected?.boards.map((board) => (
                <CommandItem
                  className="cursor-pointer"
                  key={board.id}
                  value={board.id.toString()}
                  onSelect={() => handleSelectBoard(board)}
                >
                  {board.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === board.id.toString()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
