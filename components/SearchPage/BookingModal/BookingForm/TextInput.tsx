import { useField } from 'formik';
import { Input, Form } from 'antd';
import { FieldHookConfig } from 'formik/dist/Field';
import TextArea from 'antd/lib/input/TextArea';

type TextInputProps = FieldHookConfig<string> & {
  inputLabel: string;
  multiline?: boolean;
};

export default function TextInput({
  inputLabel,
  multiline = false,
  ...props
}: TextInputProps): JSX.Element {
  const [field, meta] = useField(props);
  const inputProps = {
    ...field,
    placeholder: props.placeholder,
  };
  return (
    <Form.Item
      label={inputLabel}
      name={props.name}
      help={meta.touched && meta.error ? meta.error : undefined}
    >
      {multiline ? (
        <TextArea {...inputProps} rows={4} />
      ) : (
        <Input {...inputProps} />
      )}
    </Form.Item>
  );
}
