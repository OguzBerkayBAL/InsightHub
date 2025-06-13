import AdminLayout from "./AdminLayout";
import MainLayout from "./MainLayout";
import { isAdmin } from "../config/isAdmin";
export const Layout = isAdmin ? AdminLayout : MainLayout;
