import { useState } from 'react'
import useTheme from '../hooks/useTheme'
import {IOAxios} from '../config/axios'
import {useNavigate} from 'react-router-dom' // Fixed: useNavigation -> useNavigate
import Toast from 'react-hot-toast';
import useUser from '../hooks/useUser';
import Nav from '../components/Nav';

const Auth = () => {
  
  const navigate = useNavigate() // Fixed: useNavigation -> useNavigate, and lowercase variable name
  
  const { Theme } = useTheme()
  const [isLogin, setIsLogin] = useState(true)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const {User,setUser} = useUser()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const {email, password} = loginData
      const res = await IOAxios.post('/user/login', {email, password},{headers: { Authorization: `Bearer ${localStorage.getItem('auth/v1')}` },}) // Added: Login API call
      const {Token,User} = res.data
      localStorage.setItem('auth/v1', Token)
      setUser(User)
      Toast.success("Login Successful")
      navigate('/') // Fixed: Navigate -> navigate
    } catch (error) {
      Toast.error("Invalid Credentials")
      
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    try {
      const {email, name, password} = signupData
      const res = await IOAxios.post('/user/register', {name, email, password},{headers: { Authorization: `Bearer ${localStorage.getItem('auth/v1')}` },})
      const {Token,User} = res.data // Fixed: Removed unused User variable
      setUser(User)
      localStorage.setItem('auth/v1', Token)
      Toast.success("User Registered")
      navigate('/') // Fixed: Navigate -> navigate
    } catch (error) {
      Toast.error("Something Went Wrong")
      
    }
  }

  return (
    <>
    <Nav />
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${Theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className={`transition-colors duration-300 ${Theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-8 rounded-lg shadow-md w-96`}>
        <h2 className={`text-2xl font-bold mb-6 text-center transition-colors duration-300 ${Theme === 'dark' ? 'text-white' : 'text-black'}`}>
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        
        <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
          {!isLogin && (
            <div>
              <label className={`block text-sm font-medium transition-colors duration-300 ${Theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Name</label>
              <input
                type="text"
                value={signupData.name}
                onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                className={`mt-1 block w-full rounded-md px-3 py-2 transition-colors duration-300 ${
                  Theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                    : 'border-gray-300 focus:border-black bg-gray-100'
                } focus:outline-none`}
                placeholder="Enter your name"
              />
            </div>
          )}
          
          <div>
            <label className={`block text-sm font-medium transition-colors duration-300 ${Theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
            <input
              type="email"
              value={isLogin ? loginData.email : signupData.email}
              onChange={(e) => isLogin 
                ? setLoginData({...loginData, email: e.target.value})
                : setSignupData({...signupData, email: e.target.value})
              }
              className={`mt-1 block w-full rounded-md px-3 py-2 transition-colors duration-300 ${
                Theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                  : 'border-gray-300 focus:border-black bg-gray-100'
              } focus:outline-none`}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium transition-colors duration-300 ${Theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              value={isLogin ? loginData.password : signupData.password}
              onChange={(e) => isLogin
                ? setLoginData({...loginData, password: e.target.value})
                : setSignupData({...signupData, password: e.target.value})
              }
              className={`mt-1 block w-full rounded-md px-3 py-2 transition-colors duration-300 ${
                Theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-gray-500' 
                  : 'border-gray-300 focus:border-black bg-gray-100'
              } focus:outline-none`}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md transition-all duration-300 ${
              Theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className={`mt-4 text-center text-sm transition-colors duration-300 ${Theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={`font-medium hover:underline transition-colors duration-300 ${Theme === 'dark' ? 'text-white' : 'text-black'}`}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
    </>
  )
}

export default Auth