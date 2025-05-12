import './App.css'
import './style/quiz.css'
import './style/page.css'
import { LessonViewer } from './pages/lesson_viewer'
import { createBrowserRouter, RouterProvider } from "react-router";
import { Dashboard } from './pages/dashboard';
import { UserPage } from './pages/user';
import { AuthWrapper } from './auth';
import { FourOhFourPage } from './pages/404';

const firebaseConfig = {
  apiKey: "AIzaSyAYfJSxsFfGi1OX7lZZdhRxTF3WdfZv6S8",
  authDomain: "jjprep-c42d0.firebaseapp.com",
  projectId: "jjprep-c42d0",
  storageBucket: "jjprep-c42d0.firebasestorage.app",
  messagingSenderId: "665792273306",
  appId: "1:665792273306:web:dce37024c2de359aa8f823"
};

export { firebaseConfig };



function App() {
  const router = createBrowserRouter([
    { index: true, Component: Dashboard },
    {
      path: "user/:user_id", children: [
        { index: true, Component: UserPage },
        { path: "material/:material_name/lesson/:lesson_name", Component: LessonViewer }
      ]
    },
    { path: "*", Component: FourOhFourPage }
  ])
  return <AuthWrapper><RouterProvider router={router}></RouterProvider></AuthWrapper>
}

export default App
