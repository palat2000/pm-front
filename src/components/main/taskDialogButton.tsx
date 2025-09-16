import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function TaskDialogButton({
  onOpenChange,
  handelSubmitEditTask,
  submitLoading,
}: {
  onOpenChange: (open: boolean) => void;
  handelSubmitEditTask: () => void;
  submitLoading: boolean;
}) {
  return (
    <div className="flex justify-end gap-2 pt-4">
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        ยกเลิก
      </Button>
      <Button onClick={handelSubmitEditTask} disabled={submitLoading}>
        {submitLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            กำลังบันทึก...
          </>
        ) : (
          "บันทึก"
        )}
      </Button>
    </div>
  );
}
