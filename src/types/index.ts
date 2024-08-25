type ItemType = {
  id: string;
  Task: string;
  isEven: boolean;
  order: number;
  dibs?: string | null;
  dibsOrder?: number | null;
};

type ColumnsType = {
  [x: string]: {
    title: string;
    items: ItemType[];
  };
};

export { ItemType, ColumnsType };
