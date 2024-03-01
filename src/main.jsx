import React, {createContext, useContext} from 'react'
import ReactDOM from 'react-dom/client'
import { Button, MantineProvider } from '@mantine/core'
import { createBrowserRouter, RouterProvider, useParams, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './components/Login.jsx'
import ErrorPage from './error-page.jsx'
import './index.css'
import Classes, { loader as studentLoader } from './components/Classes.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import Admin from './components/Admin.jsx'
import AdminContextProvider from './components/AdminContextProvider.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'

import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const AdminAuthContext = createContext({ user: null, setUser: (item) => {}});

function AdminAuth({ children, redirectTo }) {
  const { user } = useContext(AdminAuthContext);
  if (user) {
    return children;
  } else {
    return <Navigate to={redirectTo} replace={true} />;
  }
}

function GuestOnly({ children, redirectTo }) {
  const { user } = useContext(AdminAuthContext);
  if (!user) {
    return children;
  } else {
    return <Navigate to={redirectTo} replace={true} />;
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/students/:studentId', element: <Classes />, loader: studentLoader },
      { path: '/', element: <Login />},
      // { path: '/admin', element: <Admin />}
    ]
  },
  // {
  //   path: '/students/:studentId',
  //   element: <Classes />,
  //   errorElement: <ErrorPage />,
  //   loader: studentLoader,
  // },
  {
    path: '/admin',
    element: (
      <AdminAuth redirectTo='/admin/login'>
        <Dashboard />
      </AdminAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/login',
    element: (
      <GuestOnly redirectTo='/admin'>
        <AdminLogin />
      </GuestOnly>
    ),
    errorElement: <ErrorPage />,
  }
  // {
  //   path: '/admin',
  //   element: <Admin />,
  //   errorElement: <ErrorPage />,
  // },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS defaultColorScheme='auto'>
      <AdminContextProvider>
        <RouterProvider router={router} />
      </AdminContextProvider>
    </MantineProvider>
  </React.StrictMode>,
)
