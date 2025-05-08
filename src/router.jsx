import { createBrowserRouter, Navigate } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout.jsx'
import GuestLayout from './layouts/GuestLayout.jsx'
import Home from './views/Home.jsx'
import Login from './views/Login.jsx'
import Signup from './views/Signup.jsx'
import Survey from './views/Survey.jsx'
import SurveyView from './views/SurveyView.jsx'
import MortgageCalculator from './components/MortgageCalculator.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Navigate to="/" />,
      },
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/surveys',
        element: <Survey />,
      },
      {
        path: '/surveys/create',
        element: <SurveyView />,
      },
      {
        path: '/mortgage-calculator',
        element: <MortgageCalculator />,
      },
    ],
  },

  {
    path: '/',
    element: <GuestLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
    ],
  },
])

export default router
