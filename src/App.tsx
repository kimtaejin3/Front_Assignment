import { CSSProperties, SetStateAction, useState } from "react";
import {
  BeforeCapture,
  DragDropContext,
  DropResult,
} from "react-beautiful-dnd";
import ItemList from "./components/ItemList";

export const data = [
  {
    id: "1",
    Task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent.",
    Due_Date: "25-May-2020",
  },
  {
    id: "2",
    Task: "Fix Styling",
    Due_Date: "26-May-2020",
  },
  {
    id: "3",
    Task: "Handle Door Specs",
    Due_Date: "27-May-2020",
  },
  {
    id: "4",
    Task: "morbi",
    Due_Date: "23-Aug-2020",
  },
  {
    id: "5",
    Task: "proin",
    Due_Date: "05-Jan-2021",
  },
];

type ColumnsType = {
  [x: string]: {
    title: string;
    items: { id: string; Task: string; Due_Date: string }[];
  };
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
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState(null);

  const onDragEnd = (
    result: DropResult,
    columns: ColumnsType,
    setColumns: React.Dispatch<SetStateAction<ColumnsType>>
  ) => {
    const { source, destination } = result;
    console.log("source", source);
    if (source?.droppableId === "1" && destination?.droppableId === "3") {
      setIndexState(null);
      setError(false);
      return;
    }
    if (source?.droppableId !== destination?.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const onBeforeCapture = (start: BeforeCapture) => {
    const draggableId = start.draggableId;
    const selected = selectedTaskIds.find((taskId) => taskId === draggableId);

    // if dragging an item that is not selected - unselect all items
    if (!selected) {
      setSelectedTaskIds([]);
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
              columId={columId}
              column={column}
              error={error}
              indexState={indexState}
              selectedTasksId={selectedTaskIds}
              onSetSelectedTasksId={setSelectedTaskIds}
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
