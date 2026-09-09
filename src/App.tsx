import { Navigate, Route, Routes } from "react-router-dom";
import { useStore } from "@/lib/store";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Students from "@/pages/Students";
import Sessions from "@/pages/Sessions";
import Subscriptions from "@/pages/Subscriptions";
import Settings from "@/pages/Settings";

function Private({ children }: { children: React.ReactNode }) {
  const { authenticated } = useStore();
  if (!authenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Private>
            <Layout />
          </Private>
        }
      >
        <Route index element={<Home />} />
        <Route path="students" element={<Students />} />
        <Route path="sessions" element={<Sessions />} />
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
