import { CSSProperties } from "react";
import ItemList from "./components/ItemList";

const App: React.FC = () => {
  return (
    <div style={getContainerStyle()}>
      <ItemList />
      <ItemList />
      <ItemList />
      <ItemList />
    </div>
  );
};

const getContainerStyle = (): CSSProperties => ({
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
});

export default App;
