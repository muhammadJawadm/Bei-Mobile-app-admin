
import { Route, Routes } from 'react-router-dom'
import './App.css'
import RootLayout from './layouts/RootLayout'
import './App.css'
import Login from './pages/Auth/Login'

import Notifications from './pages/Notifications/Notifications'
import UserManagement from './pages/UserManagement/UserManagement'
import UserProfile from './pages/UserManagement/UserProfile'
import Questionnaires from './pages/Questionnaires/Questionnaires'
import QuestionnaireDetail from './pages/Questionnaires/QuestionnaireDetail'
import ContentManagement from './pages/ContentManagement/ContentManagement'
import Analytics from './pages/Analytics/Analytics'
import AccessControl from './pages/Admin/AccessControl'
import AdminLogs from './pages/Admin/AdminLogs'
import Settings from './pages/Settings/Settings'

function App() {

  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Analytics />} />
        <Route path={"/notifications"} element={<Notifications />} />
        <Route path={"/user-management"} element={<UserManagement />} />
        <Route path={"/user-management/:id"} element={<UserProfile />} />
        <Route path={"/questionnaires"} element={<Questionnaires />} />
        <Route path={"/questionnaires/:id"} element={<QuestionnaireDetail />} />
        <Route path={"/content-management"} element={<ContentManagement />} />
        <Route path={"/access-control"} element={<AccessControl />} />
        <Route path={"/admin-logs"} element={<AdminLogs />} />
        <Route path={"/settings"} element={<Settings />} />
      </Route>
      <Route path={"/login"} element={<Login />} />
    </Routes>
  )
}

export default App
