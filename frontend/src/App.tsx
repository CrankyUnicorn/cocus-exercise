import './App.css';

import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import FlagsList from "./components/FlagsList";
import FlagDetail from "./components/FlagDetail";
import CreateFlag from "./components/CreateFlag";
import EvaluatePlayground from "./components/EvaluatePlayground";

const FlagDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Flag ID missing</div>;
  }

  return <FlagDetail id={id} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlagsList />} />
        <Route path="/flags/new" element={<CreateFlag />} />
        <Route path="/flags/:id" element={<FlagDetailWrapper />} />
        <Route path="/evaluate" element={<EvaluatePlayground />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;