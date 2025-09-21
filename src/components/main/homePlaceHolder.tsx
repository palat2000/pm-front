import { SmileIcon } from "lucide-react";

export default function HomePlaceHolder() {
  return (
    <div className="flex flex-col gap-4 flex-1 items-center justify-center">
      <h1 className="text-gray-400">
        <SmileIcon className="w-20 h-20" />
      </h1>
      <div className="text-gray-600 text-center text-sm">
        วางแผน จัดการงานง่าย ๆ
      </div>
    </div>
  );
}
