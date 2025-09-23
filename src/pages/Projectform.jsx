import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const ProjectSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .required("Title is required"),
  description: Yup.string()
    .min(50, "Description must be at least 50 characters")
    .max(150, "Description cannot be more than 150 characters")
    .required("Description is required"),
  author_name: Yup.string().required("Author name is required"),
});


import Api from "../Services/Api";
import { useState } from "react";

const ProjectForm = () => {
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setError(null);
    Api.post("/projects", values)
      .then(() => {
        setSuccess("Project created successfully!");
        resetForm();
      })
      .catch(() => {
        setError("Failed to create project.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Formik
  initialValues={{ title: "", description: "", author_name: "" }}
      validationSchema={ProjectSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="project-form">
          <div>
            <label htmlFor="title">Title</label>
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" component="div" className="error" />
          </div>
          <div>
            <label htmlFor="author_name">Author Name</label>
            <Field name="author_name" type="text" />
            <ErrorMessage name="author_name" component="div" className="error" />
          </div>
          <button type="submit" disabled={isSubmitting}>
            Create Project
          </button>
          {success && <div className="success">{success}</div>}
          {error && <div className="error">{error}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default ProjectForm;
