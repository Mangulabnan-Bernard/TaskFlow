"use client";

import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/icons";
import { useTaskModal } from "@/components/board/TaskModal";

export function NewTaskButton() {
  const { openCreate } = useTaskModal();
  return (
    <Button leftIcon={<PlusIcon />} onClick={() => openCreate()}>
      New Task
    </Button>
  );
}
