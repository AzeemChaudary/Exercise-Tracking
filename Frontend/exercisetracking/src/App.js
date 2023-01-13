import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    < >
    <BrowserRouter>
    <Toaster/>
    <Routes>
        <Route path="/" element={<Signup/>} /> 
        <Route path="/Login" element={<Login/>} /> 
        
     
     </ Routes>
     </ BrowserRouter>

    </>
  );
}

export default App;
