import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useUserQuery } from "./hooks/useAuth";
import { useAuthStore } from "./store/authStore";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";

import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  const { data: userFromQuery, isLoading } = useUserQuery();
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (isLoading) return null;

  const currentUser = user ?? userFromQuery ?? null;

  const isFeed = location.pathname === "/feed";

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-900">
      <Navbar />

      <main className="flex justify-center px-3 py-6">
        <div className="w-full max-w-5xl rounded-none bg-neutral-50/95 py-8 lg:rounded-xl lg:px-8">
          <div className="mb-6 flex items-center justify-between px-2 text-xs text-neutral-500">
            <span>
              {isFeed
                ? "Your feed"
                : location.pathname === "/register"
                  ? "Create your MiniTweet account"
                  : "Sign in to continue"}
            </span>
          </div>

          <Routes>
            <Route
              path="/login"
              element={!currentUser ? <LoginPage /> : <Navigate to="/feed" />}
            />
            <Route
              path="/register"
              element={!currentUser ? <RegisterPage /> : <Navigate to="/feed" />}
            />
            <Route
              path="/feed"
              element={currentUser ? <FeedPage /> : <Navigate to="/login" />}
            />
            <Route
              path="*"
              element={
                <Navigate to={currentUser ? "/feed" : "/login"} replace />
              }
            />
          </Routes>
        </div>
      </main>

      {/* shadcn toast provider */}
      <Toaster />
    </div>
  );
}
