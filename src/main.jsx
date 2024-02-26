import React from 'react'
import ReactDOM from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { createBrowserRouter, RouterProvider, useParams } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx'
import ErrorPage from './error-page.jsx'
import './index.css'
import Classes, { loader as studentLoader } from './components/Classes.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/students/:studentId', element: <Classes />, loader: studentLoader },
      { path: '/', element: <Login />}
    ]
  },
  {
    path: '/students/:studentId',
    element: <Classes />,
    errorElement: <ErrorPage />,
    loader: studentLoader,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme='auto'>
      <RouterProvider router={router} />
    </MantineProvider>
  </React.StrictMode>,
)
