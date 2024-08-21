import { CSSProperties, SetStateAction } from "react";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item";
import type { Item as ItemType } from "./Item";
import Tom from "../assets/static/tom2.webp";

interface Props {
  columId: string;
  column: {
    title: string;
    items: ItemType[];
  };
  error: boolean;
  indexState: null | string;
  selectedTasks: ItemType[];
  onSetSelectedTasks: React.Dispatch<SetStateAction<ItemType[]>>;
  draggingTaskId: string;
}

export default function ItemList({
  columId,
  column,
  error,
  indexState,
  selectedTasks,
  onSetSelectedTasks,
  draggingTaskId,
}: Props) {
  return (
    <Droppable key={columId} droppableId={columId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver, error)}
        >
          {columId === "3" && (
            <img style={{ position: "relative", zIndex: 0 }} src={Tom} />
          )}
          {column.items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              index={index}
              indexState={indexState}
              selectedTasks={selectedTasks}
              onSetSelectedTasks={onSetSelectedTasks}
              draggingTaskId={draggingTaskId}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const GRID = 8;

const getListStyle = (
  isDraggingOver: boolean,
  error: boolean
): CSSProperties => ({
  background: isDraggingOver ? (error ? "red" : "#ffeadb") : "#ebecf0",

  padding: GRID,
  width: 250,
  minHeight: 500,
  borderRadius: 10,
  position: "relative",
  zIndex: 1,
});
