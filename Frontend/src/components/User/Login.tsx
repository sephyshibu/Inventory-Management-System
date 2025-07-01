import React, { useState , useEffect} from "react";
import axiosInstanceUser from "../../Axios/UserAxios";
import { useDispatch } from "react-redux";
import { addtoken } from "../../features/UserToken";
import { loginuser } from "../../features/UserSlice";
import { useNavigate } from "react-router-dom";


interface UserLoginForm{
    email:string,
    password:string
}

const Login:React.FC=()=>{

    const[formdata,setformdata]=useState<UserLoginForm>({
        email:"",
        password:""
    })
    const dispatch=useDispatch()
    const navigate=useNavigate()

    const[loading,setloading]=useState(false)
    const[error,seterror]=useState<string|null>(null)

    useEffect(() => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        navigate("/"); // Redirect to home if user is logged in
      }
    }, [navigate]);


    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
        setformdata((prev)=>({
            ...prev,
            [e.target.name]:e.target.value
        }))
    }
    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault()
        setloading(true)
        seterror(null)

        if(!formdata.email|| !formdata.password){
            seterror("Both email and password is required")
            setloading(false)
            return
        }

        try {
            const {email, password}=formdata
            const res=await axiosInstanceUser.post('/api/login',{email, password})
            dispatch(loginuser(res.data.user))
            dispatch(addtoken({usertoken:res.data.token}))

            
        console.log("login data",res.data)
            const userId=res.data.user._id
            localStorage.setItem("userId",userId)
            seterror('');
            navigate('/');
      


        } catch (error:any) {
            console.error("login errror",error)
            seterror(error.response?.data?.message ||"Something went wrong")   
        }
        finally {
            setloading(false);
          }

    }


    return(
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#8EB69B] relative overflow-hidden px-4">

            <div className="flex items-center justify-center gap-8 mt-32">
                <div className="bg-white rounded-2xl shadow-lg p-20 max-w-full">
                    <h2 className="text-2xl font-bold text-center text-[#0A1D56] mb-6">User Login</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                             type="email"
                             placeholder="Enter the email"
                             name="email"
                             value={formdata.email}
                             onChange={handleChange}
                             className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
                        />   

                           <input
                             type="password"
                             placeholder="Enter the password"
                             name="password"
                             value={formdata.password}
                             onChange={handleChange}
                             className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A9FF]"
                        />   

                        <button 
                                type="submit"
                                className="w-full bg-[#163] hover:bg-[#235347] text-white font-semibold py-3 rounded-md transition duration-300 transform hover:scale-105">
                                    Submit
                                </button>
                      
                    </form>
                    
                
                </div>
            </div>
        </div>

    )
}

export default Login