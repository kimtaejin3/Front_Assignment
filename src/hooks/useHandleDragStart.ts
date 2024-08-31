import { useContext } from "react";
import { dragDataContext } from "../context/DragDataContext";
import { DragStart } from "react-beautiful-dnd";

export default function useHandleDragStart() {
  const {
    onSetDraggingTaskIdWithError: setDraggingTaskIdWithError,
    columns,
    selectedTasks,
  } = useContext(dragDataContext);

  const handleDragStart = (start: DragStart) => {
    if (selectedTasks.length < 2) return;

    const column = columns[start.source?.droppableId];
    //dragged
    const sourceDraggedItem = column.items[start.source.index];

    const maxOrder = Math.max(...selectedTasks.map((value) => value.order));
    const [targetItem] = column.items.filter(
      (item) => item.order === maxOrder + 1
    );

    if (
      targetItem?.isEven &&
      selectedTasks.filter((task) => task.isEven).length > 0
    ) {
      setDraggingTaskIdWithError(sourceDraggedItem.id);
      return;
    }

  };

  return { handleDragStart };
}
