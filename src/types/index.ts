type Item = {
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
    items: Item[];
  };
};

export { Item, ColumnsType };
