import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./Pages/Home/home";
import List from "./Pages/List/list";
import Login from "./Pages/Login/login";
import New from "./Pages/New/new";
import Single from "./Pages/Single/single";

function App() {
  
 
  return (     
<div className={"app"}>
<BrowserRouter>
    <Routes>
      <Route path= "/">
      <Route index element={<Home />} />
      <Route path="Login" element={<Login />} />
      <Route path="user" >
        <Route index element={<List/>} />
        <Route path=":userId" element={<Single/>} />
        <Route 
          path="new "
          element={<New title="Add New User" />} 
          />
          </Route>
          <Route path="products">
          <Route index elemnet={<List />} />
          
          <Route path="productID" element={<Single/>} />

          <Route
          path="new" element={<New title="Add New Product "/>}
          />
          </Route>
      </Route>
    </Routes>
  </BrowserRouter>
  </div>
  );
}

export default App;
