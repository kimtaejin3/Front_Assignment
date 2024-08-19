import { CSSProperties } from "react";
import {
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import Item from "./Item";

interface Props {
  columId: string;
  column: {
    title: string;
    items: {
      id: string;
      Task: string;
      Due_Date: string;
    }[];
  };
  error: boolean;
  indexState: null | number;
}

export default function ItemList({
  columId,
  column,
  error,
  indexState,
}: Props) {
  return (
    <Droppable key={columId} droppableId={columId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver, error)}
        >
          {column.items.map((item, index) => (
            <Item item={item} index={index} indexState={indexState} />
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
  background: isDraggingOver ? (error ? "red" : "lightblue") : "lightgrey",

  padding: GRID,
  width: 250,
  minHeight: 500,
});
