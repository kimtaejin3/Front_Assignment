import { useContext } from "react";
import { dragDataContext } from "../context/DragDataContext";
import { DragUpdate } from "react-beautiful-dnd";
import { ItemType } from "../types";

export default function useHandleDragUpdate() {
  const {
    onSetError: setError,
    onSetDraggingTaskIdWithError: setDraggingTaskIdWithError,
    columns,
    selectedTasks,
  } = useContext(dragDataContext);

  const preventMoveColOneToColThree = (
    result: DragUpdate,
    sourceDraggedItem: ItemType
  ) => {
    console.log("asdf");
    if (
      result.destination?.droppableId === "3" &&
      result.source?.droppableId === "1"
    ) {
      setDraggingTaskIdWithError(sourceDraggedItem.id);
      if (!sourceDraggedItem?.isEven) {
        setError(true);
      }
      return true;
    } else {
      setDraggingTaskIdWithError(null);
      if (!sourceDraggedItem?.isEven) {
        setError(false);
      }
      return false;
    }
  };

  const handleDragUpdate = (result: DragUpdate) => {
    setDraggingTaskIdWithError(null);

    const sourceColumn = columns[result.source?.droppableId];
    const sourceDraggedItem = sourceColumn?.items[result.source?.index];

    const destColumn = columns[result.destination?.droppableId];
    const destItem = destColumn?.items[result.destination?.index];

    const isMultiDragging = selectedTasks.length > 0;

    if (preventMoveColOneToColThree(result, sourceDraggedItem)) return;

    if (sourceDraggedItem === destItem) {
      return;
    }

    if (!sourceDraggedItem || !destItem) {
      return;
    }

    if (isMultiDragging) {
      if (
        sourceColumn === destColumn &&
        !selectedTasks.includes(destItem) &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem.isEven &&
        sourceDraggedItem.order > destItem.order
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn === destColumn &&
        !selectedTasks.includes(destItem) &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem.dibsOrder !== null &&
        sourceDraggedItem.order < destItem.dibsOrder
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn !== destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem.isEven
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }
    } else {
      if (
        sourceColumn === destColumn &&
        sourceDraggedItem.isEven &&
        destItem.dibsOrder !== null &&
        sourceDraggedItem.order < destItem.dibsOrder
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn === destColumn &&
        sourceDraggedItem.isEven &&
        destItem.isEven &&
        sourceDraggedItem.order > destItem.order
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn !== destColumn &&
        sourceDraggedItem.isEven &&
        destItem.isEven
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }
    }
  };

  return {
    handleDragUpdate,
  };
}
