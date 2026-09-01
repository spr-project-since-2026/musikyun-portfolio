import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Public from './Public'
import About from './About'
import Login from './Login'
import Writer from './Writer'
import Editor from './Editor'
import ProtectedRoute from './ProtectedRoute'
import ArticleDetail from './ArticleDetail'

export default function App() {
  return (
    <BrowserRouter basename="/musikyun-portfolio">
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/login" element={<Login />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
        <Route
          path="/writer"
          element={
            <ProtectedRoute allowedRole="writer">
              <Writer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <ProtectedRoute allowedRole="editor">
              <Editor />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}