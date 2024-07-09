import { Route, Routes } from 'react-router-dom';
import { publicRoutes,  } from './routes';
import adminRoutes from './routes/adminRoutes';
import { UserRoutes } from './routes/UserRoute';
import ErrorPage from './pages/ErrorPage/ErrorPage';
// import { TestRoutes } from './routes/TestRoutes';

function App() {
  return (
    <>
      <Routes>
        {adminRoutes.map((route, index) => (
          <Route key={`admin_${index}`} path={route.path} element={route.element} />
        ))}

        {UserRoutes.map((route, index) => (
          <Route key={`user_${index}`} path={route.path} element={route.element} />
        ))}

        {publicRoutes.map((route, index) => (
          <Route key={`public_${index}`} path={route.path} element={route.element} />
        ))}

        {/* {TestRoutes.map((route, index) => (
          <Route key={`public_${index}`} path={route.path} element={route.element} />
        ))} */}
        <Route path="*" element={<ErrorPage/>} />
      </Routes>
    </>
  )
}

export default App;