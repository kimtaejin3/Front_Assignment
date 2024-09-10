import { useContext } from "react";
import { DropResult } from "react-beautiful-dnd";
import { dragDataContext } from "../DragDataContext";
import { mutliDragAwareReorder } from "../../utils/dragReorderUtil";

export default function useHandleDragEnd() {
  const {
    columns,
    selectedTasks,
    draggingTaskIdWithError,
    errorForColumnRestriction,
    onSetColumns: setColumns,
    onSetSelectedTasks: setSelectedTasks,
    onSetDraggingTaskId: setDraggingTaskId,
    onSetDraggingTaskIdWithError: setDraggingTaskIdWithError,
    onSetErrorForColumnRestriction: setErrorForColumnRestriction,
  } = useContext(dragDataContext);

  const handleAfterError = () => {
    setDraggingTaskIdWithError(null);
    setSelectedTasks([]);
    setDraggingTaskId(null);
  };

  const handleDragEnd = (result: DropResult) => {
    const destination = result.destination;
    const source = result.source;

    if (
      source?.droppableId === "1" &&
      destination?.droppableId === "3" &&
      errorForColumnRestriction
    ) {
      setErrorForColumnRestriction(false);
      handleAfterError();
      return;
    }

    if (draggingTaskIdWithError) {
      handleAfterError();
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
