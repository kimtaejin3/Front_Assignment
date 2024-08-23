import { CSSProperties, SetStateAction, useState } from "react";
import {
  BeforeCapture,
  DragDropContext,
  DragStart,
  DragUpdate,
  DropResult,
} from "react-beautiful-dnd";
import ItemList from "./components/ItemList";
import {
  mutliDragAwareReorder,
  reconcilateColumnItems,
} from "./utils/dragUtil";
import type { Item } from "./components/Item";
import "./App.css";

export const data = [
  {
    id: "1",
    Task: "스키장 가기",
    isEven: true,
    column: 1,
    order: 1,
  },
  {
    id: "2",
    Task: "밤에 손 꼬옥 잡고 산책하기",
    isEven: false,
    column: 2,
    order: 2,
  },
  {
    id: "3",
    Task: "생일 축하해주기",
    isEven: true,
    column: 3,
    order: 3,
  },
  {
    id: "4",
    Task: "안아주기",
    isEven: false,
    column: 4,
    order: 4,
  },
  {
    id: "5",
    Task: "기분좋게 간지럽히는 법 연구해보기",
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
  //TODO: flag 변수명 변경
  const [flag, setFlag] = useState(false);

  const onDragEnd = (
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

  const onBeforeCapture = (start: BeforeCapture) => {
    const draggableId = start.draggableId;
    const selected = selectedTasks.find((task) => task.id === draggableId);

    if (!selected) {
      setSelectedTasks([]);
    }

    setDraggingTaskId(draggableId);
  };

  const onDragUpdate = (result: DragUpdate) => {
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
        // !flag
      ) {
        // if (destItem.id === targetItem.id) {
        //   setFlag(true);
        //   return;
        // }
        console.log("1");
        setIndexState(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn === destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem?.isEven &&
        selectedTasks[selectedTasks.length - 1].order > destItem.order
      ) {
        console.log("2");
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
        console.log("3");
        setIndexState(sourceDraggedItem.id);
        return;
      }

      if (
        sourceColumn !== destColumn &&
        selectedTasks.filter((task) => task.isEven).length > 0 &&
        destItem?.isEven
      ) {
        console.log("4");
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
      result.source?.droppableId === "1" &&
      !sourceDraggedItem?.isEven
    ) {
      setIndexState(sourceDraggedItem.id);
      setError(true);
    } else {
      setIndexState(null);
      setError(false);
    }
  };

  const onDragStart = (start: DragStart) => {
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

  return (
    <div>
      <h1 className="title">Tom & Jerry's drag playground</h1>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        onBeforeCapture={(start) => onBeforeCapture(start)}
        onDragUpdate={(result) => onDragUpdate(result)}
        onDragStart={(start) => onDragStart(start)}
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
