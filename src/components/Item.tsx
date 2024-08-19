import { CSSProperties } from "react";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";

interface Props {
  item: {
    id: string;
    Task: string;
    Due_Date: string;
  };
  index: number;
  indexState: number;
}

//TODO: indexState 변수명 바꾸기
export default function Item({ item, index, indexState }: Props) {
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
            indexState === index
          )}
          // onClick={onClick}
        >
          {item.Task}
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
  a: boolean
): CSSProperties => ({
  userSelect: "none",
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? "lightgreen" : "grey",
  fontSize: a ? "40px" : "15px",
  ...draggableStyle,
});
