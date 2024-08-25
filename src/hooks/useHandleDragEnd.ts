import { useContext } from "react";
import { DropResult } from "react-beautiful-dnd";
import { dragDataContext } from "../context/DragDataContext";
import { mutliDragAwareReorder } from "../utils/dragReorderUtil";

export default function useHandleDragEnd() {
  const {
    error,
    onSetError: setError,
    onSetIndexState: setIndexState,
    onSetSelectedTasks: setSelectedTasks,
    onSetDraggingTaskId: setDraggingTaskId,
    columns,
    onSetColumns: setColumns,
    indexState,
    selectedTasks,
  } = useContext(dragDataContext);

  const handleDragEnd = (result: DropResult) => {
    const destination = result.destination;
    const source = result.source;

    if (
      source?.droppableId === "1" &&
      destination?.droppableId === "3" &&
      error
    ) {
      setError(false);
      setIndexState(null);
      setSelectedTasks([]);
      setDraggingTaskId(null);
      return;
    }

    if (indexState) {
      setIndexState(null);
      setSelectedTasks([]);
      setDraggingTaskId(null);
      return;
    }

    const processed = mutliDragAwareReorder({
      columns,
      selectedTasks,
      source,
      destination,
    });

    setColumns(processed);
    setDraggingTaskId(null);
    setSelectedTasks([]);
  };

  return {
    handleDragEnd,
  };
}
