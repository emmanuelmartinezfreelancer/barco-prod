import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { Profile } from "./components/Profile"
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedRouteAdmin } from "./components/ProtectedRouteAdmin";
import { AuthProvider } from "./context/authContext";
import { HomeJuez } from "./components/HomeJuez";
import { NewUploadArtwork } from "./components/NewUploadArtwork"; 
import { SendMail } from "./components/SendMail";
import { LoginAdmin } from "./components/LoginAdmin";

function App() {
  return (
    <div className="bg-black h-screen text-teal-400 flex">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<LoginAdmin />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
       <Route path="/register" element={<Register />} />
          <Route path="/upload" element={<NewUploadArtwork />} />
          <Route path="/profile" element={
              <ProtectedRoute>
                  <Profile />
              </ProtectedRoute>

          }/>
          <Route path="/home-juez" element={
              <ProtectedRoute>
                  <HomeJuez />
              </ProtectedRoute>

          }/>
          <Route path="/send-mail" element={
              <ProtectedRouteAdmin>
                  <SendMail />
              </ProtectedRouteAdmin>

          }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
