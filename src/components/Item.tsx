import { CSSProperties, SetStateAction } from "react";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";

export type Item = {
  id: string;
  Task: string;
};

interface Props {
  item: Item;
  index: number;
  indexState: number;
  selectedTasksId: string[];
  onSetSelectedTasksId: React.Dispatch<SetStateAction<string[]>>;
  draggingTaskId: string;
}

//TODO: indexState 변수명 바꾸기
export default function Item({
  item,
  index,
  indexState,
  selectedTasksId,
  onSetSelectedTasksId,
  draggingTaskId,
}: Props) {
  const toggleSelectionInGroup = (taskId: string) => {
    const index = selectedTasksId.indexOf(taskId);

    // if not selected - add it to the selected items
    if (index === -1) {
      onSetSelectedTasksId([...selectedTasksId, taskId]);

      return;
    }

    // it was previously selected and now needs to be removed from the group
    const shallow = [...selectedTasksId];
    shallow.splice(index, 1);

    onSetSelectedTasksId(shallow);
  };

  const wasToggleInSelectionGroupKeyUsed = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
    return isUsingWindows ? e.ctrlKey : e.metaKey;
  };

  const toggleSelection = (taskId: string) => {
    const wasSelected = selectedTasksId.includes(taskId);

    const newTaskIds = (() => {
      // Task was not previously selected
      // now will be the only selected item
      if (!wasSelected) {
        return [taskId];
      }

      // Task was part of a selected group
      // will now become the only selected item
      if (selectedTasksId.length > 1) {
        return [taskId];
      }

      // task was previously selected but not in a group
      // we will now clear the selection
      return [];
    })();

    onSetSelectedTasksId(newTaskIds);
  };

  const performAction = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: Item
  ) => {
    if (wasToggleInSelectionGroupKeyUsed(e)) {
      toggleSelectionInGroup(item.id);
      return;
    }

    toggleSelection(item.id);
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.defaultPrevented) {
      return;
    }

    e.preventDefault();
    performAction(e, item);
  };

  const isSelected = selectedTasksId.some(
    (selectedTaskId) => selectedTaskId === item.id
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
            indexState === index,
            isSelected,
            isGhosting
          )}
          onClick={onClick}
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
  a: boolean,
  isSelected: boolean,
  isGhosting: boolean
): CSSProperties => ({
  userSelect: "none",
  padding: GRID * 2,
  margin: `0 0 ${GRID}px 0`,
  background: isDragging ? "lightgreen" : isSelected ? "blue" : "grey",
  fontSize: a ? "40px" : "15px",
  opacity: isGhosting ? "0.5" : "1",

  ...draggableStyle,
});
