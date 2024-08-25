import { useContext } from "react";
import { dragDataContext } from "../context/DragDataContext";
import { DragUpdate } from "react-beautiful-dnd";

export default function useHandleDragUpdate() {
  const {
    onSetError: setError,
    onSetIndexState: setIndexState,
    columns,
    selectedTasks,
  } = useContext(dragDataContext);

  const handleDragUpdate = (result: DragUpdate) => {
    setIndexState(null);

    const sourceColumn = columns[result.source?.droppableId];
    const sourceDraggedItem = sourceColumn?.items[result.source?.index];

    const destColumn = columns[result.destination?.droppableId];
    const destItem = destColumn?.items[result.destination?.index];
    if (selectedTasks.length > 0) {
      const maxOrder = Math.max(...selectedTasks.map((value) => value.order));

      const [targetItem] = sourceColumn.items.filter(
        (item) => item.order === maxOrder + 1
      );

      if (
        sourceColumn === destColumn &&
        targetItem?.isEven &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        targetItem.order > destItem.order
      ) {
        setIndexState(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn === destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem?.isEven &&
        selectedTasks[selectedTasks.length - 1].order > destItem.order
      ) {
        setIndexState(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn === destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem?.dibsOrder !== null &&
        !selectedTasks.includes(destItem) &&
        selectedTasks[selectedTasks.length - 1]?.order < destItem?.dibsOrder
      ) {
        setIndexState(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn !== destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem?.isEven
      ) {
        setIndexState(sourceDraggedItem.id);
        return;
      }

      if (
        result.destination?.droppableId === "3" &&
        result.source?.droppableId === "1"
      ) {
        setIndexState(sourceDraggedItem.id);
        setError(true);
      } else {
        setIndexState(null);
        setError(false);
      }

      return;
    }

    if (
      sourceColumn === destColumn &&
      sourceDraggedItem?.isEven &&
      destItem?.dibsOrder !== null &&
      sourceDraggedItem?.order < destItem?.dibsOrder
    ) {
      setIndexState(sourceDraggedItem.id);
      return;
    }

    if (
      sourceColumn === destColumn &&
      sourceDraggedItem?.id !== destItem?.id &&
      sourceDraggedItem?.isEven &&
      destItem?.isEven &&
      sourceDraggedItem.order > destItem.order
    ) {
      setIndexState(sourceDraggedItem.id);
      return;
    }

    if (
      sourceColumn !== destColumn &&
      sourceDraggedItem?.id !== destItem?.id &&
      sourceDraggedItem?.isEven &&
      destItem?.isEven
    ) {
      setIndexState(sourceDraggedItem.id);
      return;
    }

    if (
      result.destination?.droppableId === "3" &&
      result.source?.droppableId === "1"
    ) {
      setIndexState(sourceDraggedItem.id);
      if (!sourceDraggedItem?.isEven) {
        setError(true);
      }
    } else {
      setIndexState(null);
      if (!sourceDraggedItem?.isEven) {
        setError(false);
      }
    }
  };

  return {
    handleDragUpdate,
  };
}
