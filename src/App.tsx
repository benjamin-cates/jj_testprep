import './App.css'
import './style/quiz.css'
import './style/page.css'
import { LessonViewer } from './pages/lesson_viewer'
import { Route, Routes } from "react-router";
import { Dashboard } from './pages/dashboard';
import { UserPage } from './pages/user';
import { AuthWrapper } from './auth';

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
  return <AuthWrapper><Routes>
    <Route index element={<Dashboard />} />
    <Route path="user/:user_id">
      <Route index element={<UserPage />}></Route>
      <Route path="material/:material_name">
        <Route path="lesson/:lesson_name" element={<LessonViewer />}></Route>
      </Route>
    </Route>
  </Routes ></AuthWrapper>;
}

export default App
