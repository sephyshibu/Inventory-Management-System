import { Route, Routes,Navigate } from "react-router-dom";
import Login from "../components/User/Login";
import { Toaster } from "react-hot-toast";


const UserRouter=()=>{
    return(
        <>
        <Toaster/>
        <Routes>
            <Route path="/" element={<Login/>}/>
        </Routes>
        </>
    )
}
export default UserRouter