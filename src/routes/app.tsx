import AppLayout from "../layouts/AppLayout";
import { Navigate } from "react-router-dom";

import { HomePage } from "../pages/Home";
import { Users } from "../modules/user/pages/Users";
import { NewUser } from "../modules/user/pages/NewUser";
import ProtectedRoute from "../storage/ProtectedRoute";
import { Clients } from "../modules/client/pages/Clients";
import { NewClient } from "../modules/client/pages/NewClient";
import Products from "../modules/product/pages/Products";
import NewProduct from "../modules/product/pages/NewProduct";

const appRouter = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      // JUGADORES 1 Y 2
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/new-user",
        element: <NewUser />,
      },
      {
        path: "/clients",
        element: <Clients />,
      },
      {
        path: "/new-client",
        element: <NewClient />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/new-product",
        element: <NewProduct />,
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
    ],
  },
];

export default appRouter;
