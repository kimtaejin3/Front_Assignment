import { CSSProperties, SetStateAction } from "react";
import {
  Draggable,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";

export type Item = {
  id: string;
  Task: string;
  isEven: boolean;
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
