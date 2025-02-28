import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ReceiptDetail from "../pages/ReceiptDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "receipts/:receiptId",
                element: <ReceiptDetail />,
            },
        ],
    },
]);

export default router;