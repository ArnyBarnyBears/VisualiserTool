import "./styles/App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PathfindingVisualizer from "./PathfindingVisualizer/PathfindingVisualizer";
import SortingVisualizer from "./SortingVisualizer/SortingVisualizer";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/VisualiserTool" exact component={Home} />
          <Route path="/pathfinding" exact component={PathfindingVisualizer} />
          <Route path="/sorting" exact component={SortingVisualizer} /> 
        </Switch>
      </Router>
    </div>
  );
}

export default App;