import { useContext } from "react";
import { dragDataContext } from "../DragDataContext";
import { ItemType } from "../../types";

export default function useHandleSelectItems() {
  const { selectedTasks, onSetSelectedTasks } = useContext(dragDataContext);

  const toggleMultiSelect = (task: ItemType) => {
    const index = selectedTasks.map((task) => task.id).indexOf(task.id);

    if (index === -1) {
      onSetSelectedTasks([...selectedTasks, task]);

      return;
    }

    const shallow = [...selectedTasks];
    shallow.splice(index, 1);

    onSetSelectedTasks(shallow);
  };

  const isMultiSelectKeyUsed = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const isUsingWindows = navigator.platform.indexOf("Win") >= 0;
    return isUsingWindows ? e.ctrlKey : e.metaKey;
  };

  const toggleSelect = (task: ItemType) => {
    const isSelected = selectedTasks.map((task) => task.id).includes(task.id);

    const newTaskIds = (() => {
      if (!isSelected) {
        return [task];
      }

      if (selectedTasks.length > 1) {
        return [task];
      }

      return [];
    })();

    onSetSelectedTasks(newTaskIds);
  };

  const handleSelectItems = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: ItemType
  ) => {
    if (isMultiSelectKeyUsed(e)) {
      toggleMultiSelect(item);
      return;
    }

    toggleSelect(item);
  };

  return { handleSelectItems };
}
