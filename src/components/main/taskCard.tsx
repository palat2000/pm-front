import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

export default function TaskCard() {
  let name = "Pond";
  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-all duration-200`}
    >
      <CardContent className="px-4">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium">title</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              description
            </p>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{name}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString("th-TH", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
