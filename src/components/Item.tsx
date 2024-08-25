import { CSSProperties, useContext } from "react";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import JerryImg from "../assets/static/jerry-img.png";
import TomImg from "../assets/static/tom-img.png";
import { dragDataContext } from "../context/DragDataContext";
import type { Item } from "../types";

interface Props {
  item: Item;
  index: number;
}

//TODO: indexState 변수명 바꾸기
export default function Item({ item, index }: Props) {
  const { selectedTasks, onSetSelectedTasks, draggingTaskId, indexState } =
    useContext(dragDataContext);

  const toggleSelectionInGroup = (task: Item) => {
    const index = selectedTasks.map((task) => task.id).indexOf(task.id);

    if (index === -1) {
      onSetSelectedTasks([...selectedTasks, task]);

      return;
    }

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
      if (!wasSelected) {
        return [task];
      }

      if (selectedTasks.length > 1) {
        return [task];
      }

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
            isGhosting,
            item.isEven
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
                backgroundColor: "#eee",
                borderRadius: "50%",
                flexShrink: 0,
                overflow: "hidden",
              }}
            >
              <img
                style={{ width: "100%", height: "100%" }}
                src={item.isEven ? TomImg : JerryImg}
              />
            </div>
            <div>
              {item.Task}
              <div style={{ marginTop: 10 }}>
                <span style={getNamePlate(item.isEven)}>
                  {item.isEven ? "Tom" : "Jerry"}
                </span>
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
  error: boolean,
  isSelected: boolean,
  isGhosting: boolean,
  isEven: boolean
): CSSProperties => ({
  userSelect: "none",
  padding: GRID * 1.8,
  margin: `0 0 ${GRID}px 0`,
  background: isSelected ? (isEven ? "#44516d" : "#bf7236") : "#fffcfc",
  color: isSelected ? "#fff" : "#000",
  border: isDragging ? (error ? "3px solid #e03d3d" : "3px solid #49494a") : "",
  opacity: isGhosting ? "0.5" : "1",
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

const getNamePlate = (isEven: boolean): CSSProperties => ({
  backgroundColor: isEven ? "#ddebff" : "#fffae6",
  padding: "5px 8px",
  fontWeight: 400,
  borderRadius: 10,
  fontSize: 13,
  color: "#000",
});
