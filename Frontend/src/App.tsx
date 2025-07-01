import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import UserRouter from './Routes/UserRoutes'
import { Toaster } from 'react-hot-toast'

function App() {
 
return(
  <>

  <Toaster/>
  <Router>
    <Routes>
      <Route path='/' element={<UserRouter/>}/>
    </Routes>
  </Router>
  </>
)
  
}

export default App
