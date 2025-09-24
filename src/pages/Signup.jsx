import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Api from "../Services/Api";

const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: Yup.string().oneOf(["student", "mentor"]).required("Role is required"),
  cohort: Yup.string().required("Cohort is required"),
});

function Signup() {
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    try {
      await Api.post("/signup", values);
      // Auto-login after signup
      await login(values.email, values.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
    setSubmitting(false);
  };

  return (
    <div className="auth-form-container">
      <h2>Signup</h2>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          role: "student",
          cohort: "",
        }}
        validationSchema={SignupSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="auth-form">
            <div>
              <label htmlFor="username">Username</label>
              <Field name="username" type="text" />
              <ErrorMessage name="username" component="div" className="error" />
            </div>
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
            <div>
              <label htmlFor="role">Role</label>
              <Field as="select" name="role">
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
              </Field>
              <ErrorMessage name="role" component="div" className="error" />
            </div>
            <div>
              <label htmlFor="cohort">Cohort</label>
              <Field name="cohort" type="text" placeholder="Enter cohort name" />
              <ErrorMessage name="cohort" component="div" className="error" />
            </div>
            <button type="submit" disabled={isSubmitting}>Signup</button>
            {error && <div className="error">{error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;