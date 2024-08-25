import {
  BeforeCapture,
  DragStart,
  DragUpdate,
  DropResult,
} from "react-beautiful-dnd";
import { ColumnsType } from "../App";
import { SetStateAction } from "react";

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
    setIndexState(sourceDraggedItem.id);
    return;
  }

  let flag = false;

  for (let i = 0; i < selectedTasks.length - 1; i++) {
    if (selectedTasks[i]?.isEven && selectedTasks[i + 1]?.isEven) {
      flag = true;
    }
  }

  if (flag) {
    setIndexState(sourceDraggedItem.id);
    return;
  }
};

const handleDragUpdate = (result: DragUpdate) => {
  setIndexState(null);

  const sourceColumn = columns[result.source?.droppableId];
  //dragged
  const sourceDraggedItem = sourceColumn?.items[result.source?.index];

  const destColumn = columns[result.destination?.droppableId];
  const destItem = destColumn?.items[result.destination?.index];
  if (selectedTasks.length > 0) {
    const maxOrder = Math.max(...selectedTasks.map((value) => value.order));

    const [targetItem] = sourceColumn.items.filter(
      (item) => item.order === maxOrder + 1
    );

    if (
      targetItem?.isEven &&
      selectedTasks.filter((task) => task.isEven).length > 0
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

const handleDragEnd = (
  result: DropResult,
  columns: ColumnsType,
  setColumns: React.Dispatch<SetStateAction<ColumnsType>>
) => {
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

const handleBeforeCapture = (start: BeforeCapture) => {
  const draggableId = start.draggableId;
  const selected = selectedTasks.find((task) => task.id === draggableId);

  if (!selected) {
    setSelectedTasks([]);
  }

  setDraggingTaskId(draggableId);
};

export {
  handleDragEnd,
  handleDragStart,
  handleDragUpdate,
  handleBeforeCapture,
};
