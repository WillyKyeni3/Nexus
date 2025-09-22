import App from "../App.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx"; 
import Projectdetail from "../pages/Projectdetail.jsx";
import Profile from "../pages/Profile.jsx";
import Projectform from "../pages/Projectform.jsx";
import Signup from "../pages/Signup.jsx";


const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/projectdetail",
        element: <Projectdetail />,
      },
      {
        path: "/projectform",
        element: <Projectform />,
      },
      {
        path: "/signup",
        element: <Signup />,
      }
    ]
  }
];

export default routes;