import { useContext } from "react";
import { dragDataContext } from "../context/DragDataContext";
import { DragUpdate } from "react-beautiful-dnd";

export default function useHandleDragUpdate() {
  const {
    onSetError: setError,
    onSetDraggingTaskIdWithError: setDraggingTaskIdWithError,
    columns,
    selectedTasks,
  } = useContext(dragDataContext);

  const handleDragUpdate = (result: DragUpdate) => {
    setDraggingTaskIdWithError(null);

    const sourceColumn = columns[result.source?.droppableId];
    const sourceDraggedItem = sourceColumn?.items[result.source?.index];

    const destColumn = columns[result.destination?.droppableId];
    const destItem = destColumn?.items[result.destination?.index];

    if (sourceDraggedItem === destItem) {
      return;
    }

    if(!sourceDraggedItem || !destItem) {
      return;
    }

    if (selectedTasks.length > 0) {
      const maxOrder = Math.max(...selectedTasks.map((value) => value.order));

      const [targetItem] = sourceColumn.items.filter(
        (item) => item.order === maxOrder + 1
      );

      if (
        sourceColumn === destColumn &&
        targetItem.isEven &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        targetItem.order > destItem.order
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn === destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem.isEven &&
        sourceDraggedItem.order > destItem.order
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn === destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem.dibsOrder !== null &&
        !selectedTasks.includes(destItem) &&
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

      if (
        result.destination?.droppableId === "3" &&
        result.source?.droppableId === "1"
      ) {
        setDraggingTaskIdWithError(sourceDraggedItem.id);
        setError(true);
      } else {
        setDraggingTaskIdWithError(null);
        setError(false);
      }

      return;
    }

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

    if (
      result.destination?.droppableId === "3" &&
      result.source?.droppableId === "1"
    ) {
      setDraggingTaskIdWithError(sourceDraggedItem.id);
      if (!sourceDraggedItem?.isEven) {
        setError(true);
      }
    } else {
      setDraggingTaskIdWithError(null);
      if (!sourceDraggedItem?.isEven) {
        setError(false);
      }
    }
  };

  return {
    handleDragUpdate,
  };
}
