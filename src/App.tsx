import { CSSProperties, SetStateAction, useState } from "react";
import {
  BeforeCapture,
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import ItemList from "./components/ItemList";
import { mutliDragAwareReorder } from "./utils/dragUtil";
import type { Item } from "./components/Item";

export const data = [
  {
    id: "1",
    Task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.",
  },
  {
    id: "2",
    Task: "Fix Styling",
  },
  {
    id: "3",
    Task: "Handle Door Specs",
  },
  {
    id: "4",
    Task: "morbi",
  },
  {
    id: "5",
    Task: "proin",
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
  const [columns, setColumns] = useState(columnsFromBackend);
  const [error, setError] = useState(false);
  const [indexState, setIndexState] = useState<null | number>(null);
  const [selectedTasks, setSelectedTasks] = useState<Item[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const onDragEnd = (
    result: DropResult,
    columns: ColumnsType,
    setColumns: React.Dispatch<SetStateAction<ColumnsType>>
  ) => {
    const destination = result.destination;
    const source = result.source;

    // nothing to do
    if (!destination || result.reason === "CANCEL") {
      setDraggingTaskId(null);
      return;
    }

    const processed = mutliDragAwareReorder({
      columns,
      selectedTasks,
      source,
      destination,
    });

    console.log("onDragEnd", processed);

    setColumns(processed);
    setDraggingTaskId(null);
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
        if (
          result.destination?.droppableId === "3" &&
          result.source?.droppableId === "1"
        ) {
          setIndexState(result.source.index);
          setError(true);
        } else {
          setIndexState(null);
          setError(false);
        }

        console.log(result);
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
