import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './global.css'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromChildren } from 'react-router-dom'
import { HomePage } from './components/index.ts'
import SensorsPage from './components/Pages/sensors.tsx'
import StatisticsPage from './components/Pages/statistics.tsx'
import AboutPage from './components/Pages/about.tsx'
import PrivacyPage from './components/Pages/privacy.tsx'
import ContactPage from './components/Pages/contact.tsx'
import NotFoundPage from './components/Pages/not-found.tsx'
import InstituteRegisterPage from './components/Pages/institutionRegister.tsx'
import UserRegisterPage from './components/Pages/userRegister.tsx'

const router = createBrowserRouter(
  createRoutesFromChildren(
    <Route path="/" element={<App />} >
      <Route path="home" element={<HomePage />} />
      <Route path="device/:deviceId" element={<SensorsPage />} />
      <Route path='statistics/:deviceId/:sensorId' element={<StatisticsPage/>} />
      <Route path="about" element={<AboutPage/>} />
      <Route path="privacy" element={<PrivacyPage/>} />
      <Route path="contact" element={<ContactPage/>} />
      <Route path="institutions/register" element={<InstituteRegisterPage/>} />
      <Route path='users/register' element={<UserRegisterPage/>} />
      <Route path="*" element={<NotFoundPage/>} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
