import * as yup from 'yup';
import { Button, Form } from 'antd';
import { Formik, FormikProps } from 'formik';
import React from 'react';
import { FormikHelpers } from 'formik/dist/types';
import TextInput from './TextInput';
import { AvailableTimeslot } from '../../../models/api/availableTimesApiModels';

export interface BookingFormValues {
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
  submitForm,
  handleReset,
}: FormikProps<BookingFormValues>): JSX.Element {
  return (
    <Form onFinish={submitForm} layout={'vertical'} onReset={handleReset}>
      {/*First Name*/}
      <TextInput
        inputLabel="First Name"
        name="firstName"
        type="text"
        placeholder="Jane"
      />

      {/*Last Name*/}
      <TextInput
        inputLabel="Last Name"
        name="lastName"
        type="text"
        placeholder="Doe"
      />

      {/*Email*/}
      <TextInput
        inputLabel="Email"
        name="email"
        type="email"
        placeholder="JaneDoe@Email.com"
      />

      {/*Phone Number*/}
      <TextInput
        inputLabel="Phone Number"
        name="phoneNumber"
        type="tel"
        placeholder="(778) 555-5555"
      />

      {/*Visit Reason*/}
      <TextInput
        inputLabel="Visit Reason"
        name="visitReason"
        type="text"
        placeholder="Tell us why you're booking."
        multiline
      />

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

interface BookingFormProps {
  availableSlots: Array<AvailableTimeslot>;
  onSubmit: (values: BookingFormValues) => Promise<void>;
}

export default function BookingForm({
  availableSlots,
  onSubmit,
}: BookingFormProps): JSX.Element {
  const initialFormValues = createInitialFormValues();
  const onSubmitHandler = (
    values: BookingFormValues,
    { setSubmitting }: FormikHelpers<BookingFormValues>
  ): void => {
    onSubmit(values)
      .then(() => setSubmitting(false))
      .catch((err) => {
        console.error('Error submitting form', err);
        // TODO: Show err
        setSubmitting(false);
      });
  };
  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}
    >
      {(formik: FormikProps<BookingFormValues>) => createFormFromFormik(formik)}
    </Formik>
  );
}
