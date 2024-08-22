import { DraggableLocation } from "react-beautiful-dnd";
import { ColumnsType, idTitleMap } from "../App";
import type { Item } from "../components/Item";

type Args = {
  columns: ColumnsType;
  selectedTasks: Item[];
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
      [source.droppableId]: {
        title: idTitleMap[destination.droppableId as "1" | "2" | "3" | "4"],
        items: reordered,
      },
    };

    return updated as ColumnsType;
  }

  const sourceColumn = columns[source.droppableId];
  const destColumns = columns[destination.droppableId];

  const sourceItem = sourceColumn.items[source.index];

  const newSourceColumnItems = [...sourceColumn.items];
  newSourceColumnItems.splice(source.index, 1);

  const newDestColumnItems = [...destColumns.items];
  newDestColumnItems.splice(destination.index, 0, sourceItem);

  const updated = {
    ...columns,
    [source.droppableId]: {
      title: idTitleMap[destination.droppableId as "1" | "2" | "3" | "4"],
      items: newSourceColumnItems,
    },
    [destination.droppableId]: {
      title: idTitleMap[destination.droppableId as "1" | "2" | "3" | "4"],
      items: newDestColumnItems,
    },
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
  selectedTasks,
  source,
  destination,
}: Args) => {
  const sourceColumn = columns[source.droppableId];
  const sourceDraggedItem = sourceColumn.items[source.index];

  const insertAtIndex = (() => {
    const destinationIndexOffset = selectedTasks
      .map((task) => task.id)
      .reduce((previous, current) => {
        if (current === sourceDraggedItem.id) {
          return previous;
        }

        const DestColumn = columns[destination.droppableId];
        const column = getHomeColumn(columns, current);

        if (column !== DestColumn) {
          return previous;
        }

        const index = column.items.map((item) => item.id).indexOf(current);

        if (index >= destination.index) {
          return previous;
        }

        return previous + 1;
      }, 0);

    const result = destination.index - destinationIndexOffset;
    return result;
  })();

  const orderedSelectedTasks = [...selectedTasks];

  orderedSelectedTasks
    .map((task) => task.id)
    .sort((a, b) => {
      if (a === sourceDraggedItem.id) {
        return -1;
      }

      if (b === sourceDraggedItem.id) {
        return 1;
      }

      const columnForA = getHomeColumn(columns, a);
      const indexOfA = columnForA.items.map((item) => item.id).indexOf(a);
      const columnForB = getHomeColumn(columns, b);
      const indexOfB = columnForB.items.map((item) => item.id).indexOf(b);

      if (indexOfA !== indexOfB) {
        return indexOfA - indexOfB;
      }

      return -1;
    });

  console.log("ordered selected tasks:", orderedSelectedTasks);

  const withRemovedTasks = Object.keys(columns).reduce((previous, columnId) => {
    const column = columns[columnId];

    const remainingTasks = column.items.filter(
      (item) => !selectedTasks.map((task) => task.id).includes(item.id)
    );

    previous[columnId] = { ...column, items: remainingTasks };

    return previous;
  }, columns);

  const final = withRemovedTasks[destination.droppableId];

  const withInserted = (() => {
    const base = [...final.items];
    base.splice(insertAtIndex, 0, ...orderedSelectedTasks);
    return base;
  })();

  const withAddedTasks: ColumnsType = {
    ...withRemovedTasks,
    [destination.droppableId]: {
      title: idTitleMap[destination.droppableId as "1" | "2" | "3" | "4"],
      items: withInserted,
    },
  };

  return withAddedTasks;
};

export const reconcilateColumnItems = (itemList: ColumnsType) => {
  const temp = { ...itemList };
  Object.entries(temp).forEach(([columnId, value], index) => {
    Object.assign(temp, {
      ...temp,
      [columnId]: {
        ...value,
        items: value.items.map((item, index) => {
          return {
            ...item,
            column: columnId,
            order: index + 1,
            dibs:
              index < value.items.length - 1 && value.items[index + 1].isEven
                ? value.items[index + 1].id
                : null,
          };
        }),
      },
    });
  });
  //TODO: 더 나은 방법 생각해보기 or 함수로 분리
  Object.entries(temp).forEach(([columnId, value], index) => {
    Object.assign(temp, {
      ...temp,
      [columnId]: {
        ...value,
        items: value.items.map((item, index) => {
          return {
            ...item,

            dibsOrder:
              index < value.items.length - 1 && value.items[index + 1].isEven
                ? value.items[index + 1].order
                : null,
          };
        }),
      },
    });
  });
  return temp;
};

export const mutliDragAwareReorder = (args: Args) => {
  if (args.selectedTasks.length > 1) {
    const newColumn = reorderMultiDrag(args);
    const reconcilatedColumn = reconcilateColumnItems(newColumn);

    return reconcilatedColumn;
  }

  const newColumn = reorderSingleDrag(args);
  const reconcilatedColumn = reconcilateColumnItems(newColumn);

  return reconcilatedColumn;
};
