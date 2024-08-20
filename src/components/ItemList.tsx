import { CSSProperties, Dispatch, SetStateAction } from "react";
import {
  Draggable,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import Item from "./Item";
import type { Item as ItemType } from "./Item";

interface Props {
  columId: string;
  column: {
    title: string;
    items: ItemType[];
  };
  error: boolean;
  indexState: null | number;
  selectedTasksId: string[];
  onSetSelectedTasksId: React.Dispatch<SetStateAction<string[]>>;
  draggingTaskId: string;
}

export default function ItemList({
  columId,
  column,
  error,
  indexState,
  selectedTasksId,
  onSetSelectedTasksId,
  draggingTaskId,
}: Props) {
  console.log(`${columId}:${column}`);
  return (
    <Droppable key={columId} droppableId={columId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver, error)}
        >
          {column.items.map((item, index) => (
            <Item
              key={item.id}
              item={item}
              index={index}
              indexState={indexState}
              selectedTasksId={selectedTasksId}
              onSetSelectedTasksId={onSetSelectedTasksId}
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
  background: isDraggingOver ? (error ? "red" : "lightblue") : "lightgrey",

  padding: GRID,
  width: 250,
  minHeight: 500,
});
