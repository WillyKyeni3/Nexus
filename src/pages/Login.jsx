

import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";


const LoginSchema = Yup.object().shape({
   email: Yup.string().email("Invalid email").required("Email is required"),
   password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});


function Login() {
   const { login } = useContext(AuthContext);
   const [error, setError] = useState(null);
   const navigate = useNavigate();


   const handleSubmit = async (values, { setSubmitting }) => {
       setError(null);
       const res = await login(values.email, values.password);
       if (res.success) {
           navigate("/");
       } else {
           setError(res.error);
       }
       setSubmitting(false);
   };


   return (
       <div className="auth-form-container">
           <h2>Login</h2>
           <Formik
               initialValues={{ email: "", password: "" }}
               validationSchema={LoginSchema}
               onSubmit={handleSubmit}
           >
               {({ isSubmitting }) => (
                   <Form className="auth-form">
                       <div>
                           <label htmlFor="email">Email</label>
                           <Field name="email" type="email" />
                           <ErrorMessage name="email" component="div" className="error" />
                       </div>
                       <div>
                           <label htmlFor="password">Password</label>
                           <Field name="password" type="password" />
                           <ErrorMessage name="password" component="div" className="error" />
                       </div>
                       <button type="submit" disabled={isSubmitting}>Login</button>
                       {error && <div className="error">{error}</div>}
                   </Form>
               )}
           </Formik>
       </div>
   );
}


export default Login;
