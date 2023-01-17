import './App.css';
import Login from './Components/Login';
import Signup from './Components/Signup';
import {BrowserRouter,Route,Routes} from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Profile from './Components/Profile';
import EditProfile from './Components/EditProfile';
import Addtask from './Components/Addtask';
import UpdatePassword from './Components/UpdatePassword'
function App() {
  return (
    < >
    <BrowserRouter>
    <Toaster/>
    <Routes>
        <Route path="/" element={<Signup/>} /> 
        <Route path="/Login" element={<Login/>} /> 
        <Route path="/Profile" element={<Profile />} />
       
      <Route path='/EditProfile' element={<EditProfile />}/>
      <Route path='/Addtask' element={<Addtask />}/>
      <Route path='/ResetPassword' element={<UpdatePassword />}/>
     </ Routes>
     </ BrowserRouter>

    </>
  );
}

export default App;
