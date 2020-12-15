import * as yup from 'yup';
import { ErrorMessage, Field, Form, Formik, FormikState } from 'formik';
import React from 'react';
import { FormikHelpers } from 'formik/dist/types';

interface BookingFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  visitReason: string;
}

const validationSchema: yup.SchemaOf<BookingFormValues> = yup
  .object({
    firstName: yup.string().trim().required('Required'),
    lastName: yup.string().trim().required('Required'),
    email: yup.string().trim().email('Invalid email').required('Required'),
    phoneNumber: yup.string().trim().required('Required'),
    visitReason: yup.string().trim().required('Required'),
  })
  .defined();

const createInitialFormValues = (): BookingFormValues => {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    visitReason: '',
  };
};

function createFormFromFormik({
  isSubmitting,
}: FormikState<BookingFormValues> &
  FormikHelpers<BookingFormValues>): JSX.Element {
  return (
    <Form>
      {/*First Name*/}
      <label htmlFor="firstName">First Name</label>
      <Field name="firstName" type="text" />
      <ErrorMessage name="firstName" />

      {/*Last Name*/}
      <label htmlFor="lastName">Last Name</label>
      <Field name="lastName" type="text" />
      <ErrorMessage name="lastName" />

      {/*Email*/}
      <label htmlFor="email">Email</label>
      <Field type="email" name="email" />
      <ErrorMessage name="email" component="div" />

      {/*Phone Number*/}
      <label htmlFor="phoneNumber">Phone Number</label>
      <Field type="phoneNumber" name="phoneNumber" />
      <ErrorMessage name="phoneNumber" component="div" />

      {/*Visit Reason*/}
      <label htmlFor="visitReason">Visit Reason</label>
      <Field type="visitReason" name="visitReason" />
      <ErrorMessage name="visitReason" component="div" />

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </Form>
  );
}

export default function BookingForm(): JSX.Element {
  const initialFormValues = createInitialFormValues();
  const onSubmit = (
    values: BookingFormValues,
    { setSubmitting }: FormikHelpers<BookingFormValues>
  ): void => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));

      setSubmitting(false);
    }, 400);
  };
  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(
        formik: FormikState<BookingFormValues> &
          FormikHelpers<BookingFormValues>
      ) => createFormFromFormik(formik)}
    </Formik>
  );
}
