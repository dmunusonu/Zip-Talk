import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import Message from "../components/Message";
import Home from "../pages/Home";
import App from "../App";
import EmailPage from "../pages/EmailPage";
import PasswordPage from "../pages/PasswordPage";

import AuthLayouts from "../layout/AuthLayouts";
import Forgotpassword from "../pages/Forgotpassword";
const router =createBrowserRouter([
{
    path : "/",
    element : <App />,
    children :[
       { path : 'register',
        element : <AuthLayouts><Register /></AuthLayouts>
       },
       {
        path : 'email',
        element :  <AuthLayouts><EmailPage /></AuthLayouts>
       },
       {
        path : 'password',
        element : <AuthLayouts><PasswordPage /></AuthLayouts>
       },
       {path : 'forgot-password',
       element : <AuthLayouts><Forgotpassword /></AuthLayouts>
      },
       {
        path : "",
        element : <Home />,
        children: [
            {
                path : ":userid",
                element: <Message />
            }
        ]
       }
    ]
}
])
export default router