import { DraggableLocation } from "react-beautiful-dnd";
import { ColumnsType } from "../App";
import type { Item } from "../components/Item";

type Args = {
  columns: ColumnsType;
  selectedTaskIds: string[];
  source: DraggableLocation;
  destination: DraggableLocation;
};

const reorder = (list: Item[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const reorderSingleDrag = ({ columns, source, destination }: Args) => {
  // moving in the same list
  if (source.droppableId === destination.droppableId) {
    const column = columns[source.droppableId];

    const reordered = reorder(column.items, source.index, destination.index);

    const updated = {
      ...columns,
      [source.droppableId]: { ...column, items: reordered },
    };

    return updated as ColumnsType;
  }

  // moving to a new list
  const sourceColumn = columns[source.droppableId];
  const destColumns = columns[destination.droppableId];

  // the id of the task to be moved
  const sourceItem = sourceColumn.items[source.index];

  // remove from home column
  const newSourceColumnItems = [...sourceColumn.items];
  newSourceColumnItems.splice(source.index, 1);

  // add to foreign column
  const newDestColumnItems = [...destColumns.items];
  newDestColumnItems.splice(destination.index, 0, sourceItem);

  const updated = {
    ...columns,
    [source.droppableId]: { ...columns, items: newSourceColumnItems },
    [destination.droppableId]: { ...columns, items: newDestColumnItems },
  };

  return updated as ColumnsType;
};

export const getHomeColumn = (columns: ColumnsType, currentId: string) => {
  const columnId = Object.keys(columns).find((id) => {
    const column = columns[id];
    return column.items.map((item) => item.id).includes(currentId);
  });

  return columns[columnId];
};

const reorderMultiDrag = ({
  columns,
  selectedTaskIds,
  source,
  destination,
}: Args) => {
  //start
  const sourceColumn = columns[source.droppableId];
  //dragged
  const sourceDraggedItem = sourceColumn.items[source.index];

  const insertAtIndex = (() => {
    const destinationIndexOffset = selectedTaskIds.reduce(
      (previous, current) => {
        if (current === sourceDraggedItem.id) {
          return previous;
        }

        //final
        const DestColumn = columns[destination.droppableId];
        const column = getHomeColumn(columns, current);

        if (column !== DestColumn) {
          return previous;
        }

        const index = column.items.map((item) => item.id).indexOf(current);

        if (index >= destination.index) {
          return previous;
        }

        // the selected item is before the destination index
        // we need to account for this when inserting into the new location
        return previous + 1;
      },
      0
    );

    const result = destination.index - destinationIndexOffset;
    return result;
  })();

  // doing the ordering now as we are required to look up columns
  // and know original ordering
  const orderedSelectedTaskIds = [...selectedTaskIds];

  orderedSelectedTaskIds.sort((a, b) => {
    // moving the dragged item to the top of the list
    if (a === sourceDraggedItem.id) {
      return -1;
    }

    if (b === sourceDraggedItem.id) {
      return 1;
    }

    // sorting by their natural indexes
    const columnForA = getHomeColumn(columns, a);
    const indexOfA = columnForA.items.map((item) => item.id).indexOf(a);
    const columnForB = getHomeColumn(columns, b);
    const indexOfB = columnForB.items.map((item) => item.id).indexOf(b);

    if (indexOfA !== indexOfB) {
      return indexOfA - indexOfB;
    }

    // sorting by their order in the selectedTaskIds list
    return -1;
  });

  // we need to remove all of the selected tasks from their columns
  const withRemovedTasks = Object.keys(columns).reduce((previous, columnId) => {
    const column = columns[columnId];

    // remove the id's of the items that are selected
    const remainingTasks = column.items.filter(
      (item) => !selectedTaskIds.includes(item.id)
    );

    // previous[columnId] = withNewTaskIds(column, remainingTaskIds);
    previous[columnId] = { ...column, items: remainingTasks };

    return previous;
  }, columns);

  const final = withRemovedTasks[destination.droppableId];

  // const withInserted = (() => {
  //   const base = [...final.items];
  //   base.splice(insertAtIndex, 0, ...orderedSelectedTaskIds);
  //   return base;
  // })();
  console.log("check:", orderedSelectedTaskIds);

  // insert all selected tasks into final column
  const withAddedTasks: ColumnsType = {
    ...withRemovedTasks,
    // [final.id]: withNewTaskIds(final, withInserted),
    // [destination.droppableId]: ,
  };

  //   const updated = {
  //     ...columns,
  //     columns: { withAddedTasks },
  //   };

  return withAddedTasks;
};

export const mutliDragAwareReorder = (args: Args) => {
  if (args.selectedTaskIds.length > 1) {
    return reorderMultiDrag(args);
  }

  return reorderSingleDrag(args);
};
