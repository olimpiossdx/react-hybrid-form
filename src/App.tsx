import React from "react";
import Paginas from "./paginas";
import { initThemeService } from "./service/theme";

function App() {
  
  React.useEffect(() => {
    initThemeService();
  }, []);

  return ( <>
      <Paginas />
    </>);
};

export default App;
