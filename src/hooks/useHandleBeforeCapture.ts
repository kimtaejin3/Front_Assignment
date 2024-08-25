import { useContext } from "react";
import { BeforeCapture } from "react-beautiful-dnd";
import { dragDataContext } from "../context/DragDataContext";

export default function useHandleBeforeCapture() {
  const {
    selectedTasks,
    onSetSelectedTasks: setSelectedTasks,
    onSetDraggingTaskId: setDraggingTaskId,
  } = useContext(dragDataContext);

  const handleBeforeCapture = (start: BeforeCapture) => {
    const draggableId = start.draggableId;
    const selected = selectedTasks.find((task) => task.id === draggableId);

    if (!selected) {
      setSelectedTasks([]);
    }

    setDraggingTaskId(draggableId);
  };

  return { handleBeforeCapture };
}
