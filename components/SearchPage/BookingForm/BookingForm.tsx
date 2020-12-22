import * as yup from 'yup';
import { Button, Form } from 'antd';
import { Formik, FormikProps } from 'formik';
import React from 'react';
import { FormikHelpers } from 'formik/dist/types';
import TextInput from './TextInput';
import { AvailableTimeslot } from '../../../models/api/availableTimesApiModels';
import SelectInput, { SelectInputOption } from './SelectInput';
import { isoToFormattedString } from '../../../utils/dateUtils';
import { Gender } from '../../../models/patient';

export interface BookingFormValues {
  selectedTimeslotIndex: number;
  firstName: string;
  lastName: string;
  gender: Gender;
  email: string;
  phoneNumber: string;
  visitReason: string;
}

const validationSchema: yup.SchemaOf<BookingFormValues> = yup
  .object({
    selectedTimeslotIndex: yup.number().required('Please select a timeslot'),
    firstName: yup.string().trim().required('Please enter your first name'),
    lastName: yup.string().trim().required('Please enter your last name'),
    gender: yup.mixed<Gender>().oneOf(['Male', 'Female']).required(),
    email: yup.string().trim().email().required('Please enter a valid email'),
    phoneNumber: yup
      .string()
      .trim()
      .required('Please enter a valid phone number'),
    visitReason: yup.string().trim().required('Please enter a visit reason'),
  })
  .defined();

const createInitialFormValues = (): BookingFormValues => {
  return {
    selectedTimeslotIndex: 0,
    firstName: '',
    lastName: '',
    gender: 'Male',
    email: '',
    phoneNumber: '',
    visitReason: '',
  };
};

function createFormFromFormik(
  availableTimeslotOptions: Array<SelectInputOption>,
  {
    isSubmitting,
    submitForm,
    handleReset,
    initialValues,
  }: FormikProps<BookingFormValues>
): JSX.Element {
  const genderOptions: Array<SelectInputOption> = [
    {
      value: 'Male',
      label: 'Male',
    },
    {
      value: 'Female',
      label: 'Female',
    },
  ];
  return (
    <Form
      onFinish={submitForm}
      layout={'vertical'}
      onReset={handleReset}
      initialValues={initialValues}
    >
      {/*Timeslot*/}
      <SelectInput
        inputLabel="Timeslot"
        name="selectedTimeslotIndex"
        values={availableTimeslotOptions}
      />

      {/*First Name*/}
      <TextInput
        inputLabel="First Name"
        name="firstName"
        type="text"
        placeholder="First Name"
      />

      {/*Last Name*/}
      <TextInput
        inputLabel="Last Name"
        name="lastName"
        type="text"
        placeholder="Last Name"
      />

      {/*Gender*/}
      <SelectInput inputLabel="Gender" name="gender" values={genderOptions} />

      {/*Email*/}
      <TextInput
        inputLabel="Email"
        name="email"
        type="email"
        placeholder="youremail@email.com"
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
  // Key the select input by index
  const availableTimeslotOptions: Array<SelectInputOption> = availableSlots.map(
    (slot, index) => {
      return {
        value: index,
        label: `${isoToFormattedString(slot.isoStartTime, 'time')} (${
          slot.duration
        } min)`,
      };
    }
  );
  const onSubmitHandler = (
    values: BookingFormValues,
    { setSubmitting }: FormikHelpers<BookingFormValues>
  ): void => {
    onSubmit(values).then(
      // Success case
      () => setSubmitting(false),
      // Error case
      () => setSubmitting(false)
    );
  };
  return (
    <Formik
      initialValues={initialFormValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}
    >
      {(formik: FormikProps<BookingFormValues>) =>
        createFormFromFormik(availableTimeslotOptions, formik)
      }
    </Formik>
  );
}
