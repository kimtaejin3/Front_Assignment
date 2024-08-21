import { CSSProperties, SetStateAction } from "react";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import JerryImg from "../assets/static/image.png";
import TomImg from "../assets/static/image2.png";

export type Item = {
  id: string;
  Task: string;
  isEven: boolean;
  order: number;
  dibs?: string | null;
  dibsOrder?: number | null;
};

interface Props {
  item: Item;
  index: number;
  indexState: string;
  selectedTasks: Item[];
  onSetSelectedTasks: React.Dispatch<SetStateAction<Item[]>>;
  draggingTaskId: string;
}

//TODO: indexState 변수명 바꾸기
export default function Item({
  item,
  index,
  indexState,
  selectedTasks,
  onSetSelectedTasks,
  draggingTaskId,
}: Props) {
  const toggleSelectionInGroup = (task: Item) => {
    const index = selectedTasks.map((task) => task.id).indexOf(task.id);

    // if not selected - add it to the selected items
    if (index === -1) {
      onSetSelectedTasks([...selectedTasks, task]);

      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...selectedTasks];
    shallow.splice(index, 1);

    onSetSelectedTasks(shallow);
  };

  const wasToggleInSelectionGroupKeyUsed = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
    return isUsingWindows ? e.ctrlKey : e.metaKey;
  };

  const toggleSelection = (task: Item) => {
    const wasSelected = selectedTasks.map((task) => task.id).includes(task.id);

    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [task];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTasks.length > 1) {
        return [task];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    onSetSelectedTasks(newTaskIds);
  };

  const performAction = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: Item
  ) => {
    if (wasToggleInSelectionGroupKeyUsed(e)) {
      toggleSelectionInGroup(item);
      return;
    }

    toggleSelection(item);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();
    performAction(e, item);
  };

  const isSelected = selectedTasks.some(
    (selectedTask) => selectedTask.id === item.id
  );

  const isGhosting =
    isSelected && Boolean(draggingTaskId) && draggingTaskId !== item.id;

  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style,
            indexState === item.id,
            isSelected,
            isGhosting
          )}
          onClick={onClick}
        >
          {selectedTasks.length > 0 && (
            <span style={getTagStyle(snapshot.isDragging)}>
              {selectedTasks.length}
            </span>
          )}
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 25,
                height: 25,
                backgroundColor: "red",
                borderRadius: "50%",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img style={{ width: "100%", height: "100%" }} src={TomImg} />
            </div>
            <div>
              {item.Task}
              <div style={{ marginTop: 10 }}>
                <span style={getNamePlate}>Tom</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

//TODO: 파일 분리후 상수화
const GRID = 8;

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle,
  a: boolean,
  isSelected: boolean,
  isGhosting: boolean
): CSSProperties => ({
  userSelect: "none",
  padding: GRID * 1.8,
  margin: `0 0 ${GRID}px 0`,
  background: isSelected ? "#bf7236" : "#fffcfc",
  color: isSelected ? "#fff" : "#000",
  border: isDragging ? "3px solid #49494a" : "",
  opacity: a ? "0.5" : "1",
  display: isGhosting ? "none" : "block",
  position: "relative",
  borderRadius: 10,
  height: "auto",
  fontSize: 15,
  ...draggableStyle,
});

const getTagStyle = (isDragging: boolean): CSSProperties => ({
  display: isDragging ? "flex" : "none",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  right: "-5px",
  top: "-5px",
  backgroundColor: "dodgerblue",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  fontSize: "13px",
});

const getNamePlate: CSSProperties = {
  backgroundColor: "#fffae6",
  padding: "5px 8px",
  fontWeight: 400,
  borderRadius: 10,
  fontSize: 13,
  color: "#000",
};
