import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Authentication from "./pages/Authentication";
import EditProfile from "./pages/EditProfile";
import Home from "./pages/Home";
import ManageNews from "./pages/ManageNews";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "news/:id", element: <NewsDetail /> },
      { path: "users/:id", element: <Profile /> },
      {
        // Rotas que exigem login
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <Profile /> },
          { path: "profile/edit", element: <EditProfile /> },
          { path: "news/new", element: <ManageNews /> },
          { path: "news/:id/edit", element: <ManageNews /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  { path: "/auth", element: <Authentication /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
