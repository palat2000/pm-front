import DroppableColumn from "@/components/main/droppableColumn";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus, Users } from "lucide-react";

export default function Page() {
  return (
    <main className="flex-1 p-6 flex flex-col overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1>แดชบอร์ด</h1>
        </div>
      </div>

      <div className="space-y-6 flex flex-col flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-2">Name</h2>
            <p className="text-muted-foreground">Description</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="cursor-pointer">
              <Users className="w-4 h-4 mr-2" />
              สมาชิก ()
            </Button>
            <Button className="cursor-pointer">
              <Plus className="w-6 h-6" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="flex gap-6 h-full">
            <DroppableColumn />
            <DroppableColumn />
            <DroppableColumn />
          </div>
        </div>
      </div>
    </main>
  );
}
