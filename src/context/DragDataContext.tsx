import { createContext, ReactNode, useState } from "react";
import { reconcilateColumnItems } from "../utils/dragReorderUtil";
import type { ColumnsType, Item } from "../types";

type ContextType = {
  columns: ColumnsType;
  onSetColumns: React.Dispatch<React.SetStateAction<ColumnsType>>;
  error: boolean;
  onSetError: React.Dispatch<React.SetStateAction<boolean>>;
  indexState: null | string;
  onSetIndexState: React.Dispatch<React.SetStateAction<null | string>>;
  selectedTasks: Item[];
  onSetSelectedTasks: React.Dispatch<React.SetStateAction<Item[]>>;
  draggingTaskId: string | null;
  onSetDraggingTaskId: React.Dispatch<React.SetStateAction<null | string>>;
};

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

export const dragDataContext = createContext<ContextType>({} as ContextType);

export default function DragDataContext({ children }: { children: ReactNode }) {
  const [columns, setColumns] = useState<ColumnsType>(
    reconcilateColumnItems(columnsFromBackend)
  );
  const [error, setError] = useState(false);
  //TODO: indexState 변수이름 변경
  const [indexState, setIndexState] = useState<null | string>(null);
  const [selectedTasks, setSelectedTasks] = useState<Item[]>([]);
  const [draggingTaskId, setDraggingTaskId] = useState<null | string>(null);

  return (
    <dragDataContext.Provider
      value={{
        columns,
        onSetColumns: setColumns,
        error,
        onSetError: setError,
        indexState,
        onSetIndexState: setIndexState,
        selectedTasks,
        onSetSelectedTasks: setSelectedTasks,
        draggingTaskId,
        onSetDraggingTaskId: setDraggingTaskId,
      }}
    >
      {children}
    </dragDataContext.Provider>
  );
}
