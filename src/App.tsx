import { CSSProperties, SetStateAction, useState } from "react";
import {
  BeforeCapture,
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import ItemList from "./components/ItemList";
import {
  mutliDragAwareReorder,
  reconcilateColumnItems,
} from "./utils/dragUtil";
import type { Item } from "./components/Item";

export const data = [
  {
    id: "1",
    Task: "Item2",
    isEven: true,
    column: 1,
    order: 1,
  },
  {
    id: "2",
    Task: "Item1",
    isEven: false,
    column: 2,
    order: 2,
  },
  {
    id: "3",
    Task: "Item4",
    isEven: true,
    column: 3,
    order: 3,
  },
  {
    id: "4",
    Task: "Item7",
    isEven: false,
    column: 4,
    order: 4,
  },
  {
    id: "5",
    Task: "Item9",
    isEven: false,
    column: 5,
    order: 5,
  },
];

export type ColumnsType = {
  [x: string]: {
    title: string;
    items: Item[];
  };
};

export const idTitleMap = {
  "1": "To-do",
  "2": "In Progress",
  "3": "Fail",
  "4": "Done",
};

export const columnsFromBackend: ColumnsType = {
  1: {
    title: "To-do",
    items: data,
  },
  2: {
    title: "In Progress",
    items: [],
  },
  3: {
    title: "Fail",
    items: [],
  },
  4: {
    title: "Done",
    items: [],
  },
};

const App: React.FC = () => {
  const [columns, setColumns] = useState(
    reconcilateColumnItems(columnsFromBackend)
  );
  const [error, setError] = useState(false);
  //TODO: indexState 변수이름 변경
  const [indexState, setIndexState] = useState<null | string>(null);
  const [selectedTasks, setSelectedTasks] = useState<Item[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  console.log("columns:", columns);

  const onDragEnd = (
    result: DropResult,
    columns: ColumnsType,
    setColumns: React.Dispatch<SetStateAction<ColumnsType>>
  ) => {
    const destination = result.destination;
    const source = result.source;

    if (source?.droppableId === "1" && destination?.droppableId === "3") {
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

  const onBeforeCapture = (start: BeforeCapture) => {
    const draggableId = start.draggableId;
    const selected = selectedTasks.find((task) => task.id === draggableId);

    if (!selected) {
      setSelectedTasks([]);
    }

    setDraggingTaskId(draggableId);
  };

  return (
    <DragDropContext
      onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      onBeforeCapture={(start) => onBeforeCapture(start)}
      onDragUpdate={(result) => {
        const sourceColumn = columns[result.source?.droppableId];
        //dragged
        const sourceDraggedItem = sourceColumn?.items[result.source?.index];

        const destColumn = columns[result.destination?.droppableId];
        const destItem = destColumn?.items[result.destination?.index];

        if (selectedTasks.length > 0) {
          console.log("zooya:", selectedTasks[selectedTasks.length - 1]);
          if (
            sourceColumn === destColumn &&
            selectedTasks[selectedTasks.length - 1]?.isEven &&
            destItem?.dibsOrder !== null &&
            selectedTasks[selectedTasks.length - 1]?.order < destItem?.dibsOrder
          ) {
            setIndexState(sourceDraggedItem.id);
            return;
          }

          if (
            sourceColumn === destColumn &&
            selectedTasks[selectedTasks.length - 1]?.id !== destItem?.id &&
            selectedTasks[selectedTasks.length - 1]?.isEven &&
            destItem?.isEven &&
            selectedTasks[selectedTasks.length - 1].order > destItem.order
          ) {
            setIndexState(sourceDraggedItem.id);
            return;
          }

          if (
            sourceColumn !== destColumn &&
            selectedTasks[selectedTasks.length - 1]?.id !== destItem?.id &&
            selectedTasks[selectedTasks.length - 1]?.isEven &&
            destItem?.isEven
          ) {
            setIndexState(sourceDraggedItem.id);
            return;
          }
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
          setError(true);
        } else {
          setIndexState(null);
          setError(false);
        }
      }}
    >
      <div style={getContainerStyle}>
        {Object.entries(columns).map(([columId, column]) => {
          return (
            <ItemList
              key={columId}
              columId={columId}
              column={column}
              error={error}
              indexState={indexState}
              selectedTasks={selectedTasks}
              onSetSelectedTasks={setSelectedTasks}
              draggingTaskId={draggingTaskId}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

const getContainerStyle: CSSProperties = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
};

export default App;
