import { CSSProperties, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ItemList from "./components/ItemList";
import { reconcilateColumnItems } from "./utils/dragReorderUtil";
import type { Item } from "./components/Item";
import "./App.css";
import {
  handleBeforeCapture,
  handleDragEnd,
  handleDragStart,
  handleDragUpdate,
} from "./utils/dragControlUtil";

export const data = [
  {
    id: "1",
    Task: "Item1",
    isEven: true,
    column: 1,
    order: 1,
  },
  {
    id: "2",
    Task: "Item2",
    isEven: false,
    column: 2,
    order: 2,
  },
  {
    id: "3",
    Task: "Item3",
    isEven: true,
    column: 3,
    order: 3,
  },
  {
    id: "4",
    Task: "Item4",
    isEven: false,
    column: 4,
    order: 4,
  },
  {
    id: "5",
    Task: "Item5",
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

  return (
    <div>
      <h1 className="title">Tom & Jerry's drag playground</h1>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result, columns, setColumns)}
        onBeforeCapture={(start) => handleBeforeCapture(start)}
        onDragUpdate={(result) => handleDragUpdate(result)}
        onDragStart={(start) => handleDragStart(start)}
      >
        <div style={getListContainerStyle}>
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
    </div>
  );
};

const getListContainerStyle: CSSProperties = {
  display: "flex",
  gap: "20px",
  width: "fit-content",
  margin: "100px auto 0",
};

export default App;
