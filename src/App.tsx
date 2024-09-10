import { CSSProperties, useContext } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import ItemList from "./components/ItemList";
import "./App.css";
import useHandleDragEnd from "./hooks/useHandleDragEnd";
import useHandleDragUpdate from "./hooks/useHandleDragUpdate";
import { dragDataContext } from "./dragContext/DragDataContext";
import useHandleBeforeCapture from "./hooks/useHandleBeforeCapture";

export default function App() {
  const { columns } = useContext(dragDataContext);
  const { handleDragEnd } = useHandleDragEnd();
  const { handleDragUpdate } = useHandleDragUpdate();
  const { handleBeforeCapture } = useHandleBeforeCapture();

  return (
    <div>
      <h1 className="title">Tom & Jerry's drag playground</h1>
      <DragDropContext
        onDragEnd={(result) => handleDragEnd(result)}
        onBeforeCapture={(start) => handleBeforeCapture(start)}
        onDragUpdate={(result) => handleDragUpdate(result)}
      >
        <div style={getListContainerStyle}>
          {Object.entries(columns).map(([columId, column]) => {
            return <ItemList key={columId} columId={columId} column={column} />;
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

const getListContainerStyle: CSSProperties = {
  display: "flex",
  gap: "20px",
  width: "fit-content",
  margin: "100px auto 0",
};
