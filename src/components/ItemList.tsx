import { CSSProperties, useContext } from "react";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item";
import type { Item as ItemType } from "../types";
import Tom from "../assets/gif/tom2.webp";
import { dragDataContext } from "../context/DragDataContext";

interface Props {
  columId: string;
  column: {
    title: string;
    items: ItemType[];
  };
}

export default function ItemList({ columId, column }: Props) {
  const { error } = useContext(dragDataContext);

  return (
    <Droppable key={columId} droppableId={columId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver, error)}
        >
          {columId === "3" && (
            <img
              style={{
                position: "absolute",
                zIndex: -1,
                top: error ? -120 : 0,
                transition: "all .5s",
              }}
              src={Tom}
            />
          )}
          {column.items.map((item, index) => (
            <Item key={item.id} item={item} index={index} />
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
  background: isDraggingOver ? "#ffeadb" : "#ebecf0",

  padding: GRID,
  width: 250,
  minHeight: 500,
  borderRadius: 10,
  position: "relative",
});
