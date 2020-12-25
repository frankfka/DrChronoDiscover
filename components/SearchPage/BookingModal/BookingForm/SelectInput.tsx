import { useField } from 'formik';
import { Form, Select } from 'antd';
import { FieldHookConfig } from 'formik/dist/Field';
import React, { Key } from 'react';

const { Option } = Select;

export interface SelectInputOption {
  value: Key;
  label: string;
}

type SelectInputProps = FieldHookConfig<string> & {
  inputLabel: string;
  values: Array<SelectInputOption>; // Option dateTimeValue to displayed text
};

export default function SelectInput({
  inputLabel,
  values,
  ...props
}: SelectInputProps): JSX.Element {
  const [field, meta, { setValue, setTouched }] = useField(props.name);
  // Custom event handlers
  const onChange: (value: Key) => void = (value) => {
    setValue(value);
  };
  const onBlur: React.FocusEventHandler<HTMLElement> = () => {
    setTouched(true);
  };
  const inputProps = {
    ...field,
    onChange,
    onBlur,
  };
  return (
    <Form.Item
      label={inputLabel}
      name={props.name}
      help={meta.touched && meta.error ? meta.error : undefined}
    >
      <Select {...inputProps}>
        {values.map((option) => {
          return (
            <Option value={option.value} key={option.value}>
              {option.label}
            </Option>
          );
        })}
      </Select>
    </Form.Item>
  );
}
