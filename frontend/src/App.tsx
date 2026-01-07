import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { GatewaysPage } from './pages/GatewaysPage';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { AuthProvider } from './auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/gateways"
            element={
              <ProtectedRoute>
                <GatewaysPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
