 import { BrowserRouter,Route,Routes } from "react-router-dom"
import Login from "./login"
import AppComponent from "./AppComponent"
import Register from "./registration";
 
 function App(){
   return (
    <div>
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Login/>}> </Route>
            <Route path='/register' element={<Register/>}></Route>
            <Route path='/main' element={<AppComponent/>}></Route>
        </Routes>
        </BrowserRouter>
    </div>
   )
 }

 export default App;