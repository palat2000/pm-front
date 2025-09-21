import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/shadcn-io/color-picker";
import Color from "color";

export default function AddProjectDialog({
  open,
  onChangeOpen,
  onAddProject,
}: {
  open: boolean;
  onChangeOpen: (open: boolean) => void;
  onAddProject: (addProjectForm: {
    name: string;
    description: string;
    color: string;
  }) => Promise<void>;
}) {
  const [addProjectForm, setAddProjectForm] = useState<{
    name: string;
    description: string;
    color: string;
  }>({
    name: "",
    description: "",
    color: "#000000",
  });
  const [isLoading, setIsLoading] = useState(false);
  const onChangeColor = (value: Parameters<typeof Color.rgb>[0]) => {
    setAddProjectForm({ ...addProjectForm, color: Color(value).hexa() });
  };

  const onClickAddProject = async () => {
    if (!addProjectForm.name || isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      await onAddProject(addProjectForm);
      onChangeOpen(false);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setAddProjectForm({
        name: "",
        description: "",
        color: "#000000",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onChangeOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto min-h-[40vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Project</DialogTitle>
              <DialogDescription>เพิ่ม Project ใหม่</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">ชื่อ</Label>
            <Input
              id="name"
              type="text"
              value={addProjectForm.name}
              onChange={(e) =>
                setAddProjectForm({ ...addProjectForm, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">รายละเอียด</Label>
            <Input
              id="description"
              type="text"
              value={addProjectForm.description}
              onChange={(e) =>
                setAddProjectForm({
                  ...addProjectForm,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2 h-[400px]">
            <Label htmlFor="color">สี Project</Label>
            <ColorPicker
              className="max-w-sm rounded-md border bg-background p-4 shadow-sm"
              value={addProjectForm.color}
              onChange={onChangeColor}
            >
              <ColorPickerSelection />
              <div className="flex items-center gap-4">
                <div className="grid w-full gap-1">
                  <ColorPickerHue />
                  <ColorPickerAlpha />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ColorPickerOutput />
                <ColorPickerFormat />
              </div>
            </ColorPicker>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => onChangeOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button className="cursor-pointer" onClick={onClickAddProject}>
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "เพิ่ม Project"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
