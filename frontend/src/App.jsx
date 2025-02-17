import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import Auth from './Pages/Auth'
import {Toaster} from 'react-hot-toast';
import Nav from './components/Nav';
import UserAuthProtector from './components/Protection/User.Auth';
import Logout from './Pages/Logout';
import ProjectHome from './Pages/ProjectHome';
import {Helmet} from 'react-helmet-async'

function App() {

  return (
    <main className='h-screen relative'> 
    {/* <Helmet>
        <link rel="preload" href="https://w-corp-staticblitz.com/fetch.worker.1b4252dd.js" as="worker" />
      </Helmet>  */}
      <Toaster />
      <Routes>
        <Route path='/' element={<UserAuthProtector><Home /></UserAuthProtector>} />
        <Route path='/logout' element={<UserAuthProtector><Logout /></UserAuthProtector>} />
        <Route path='/auth' element={<UserAuthProtector><Auth /></UserAuthProtector>} />
        <Route path='/project/:id' element={<UserAuthProtector><ProjectHome/></UserAuthProtector>} />
      </Routes>
    </main>
  )
}

export default App
