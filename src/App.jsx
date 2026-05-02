import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Layout
import Layout from './components/Layout'

// Customer pages
import Home from './pages/Home'
import ItemDetail from './pages/ItemDetail'
import NotFound from './pages/NotFound'

// Admin pages
import AdminLogin from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ManageMenu from './pages/admin/ManageMenu'
import ManageCategories from './pages/admin/ManageCategories'

// Context
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Customer routes */}
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          }/>
          <Route path="/item/:id" element={
            <Layout>
              <ItemDetail />
            </Layout>
          }/>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />}/>
          <Route path="/admin" element={<Dashboard />}/>
          <Route path="/admin/menu" element={<ManageMenu />}/>
          <Route path="/admin/categories" element={<ManageCategories />}/>

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <NotFound />
            </Layout>
          }/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App