import { Select } from 'antd';
import React from 'react';
import { SelectProps } from 'antd/lib/select';

interface MockSelectProps extends SelectProps<string> {
  mockOptions: Array<string>;
}

export default function MockSelect({
  mockOptions,
  ...props
}: MockSelectProps): JSX.Element {
  return (
    <Select {...props} defaultValue={mockOptions[0]}>
      {mockOptions.map((item) => {
        return (
          <Select.Option value={item} key={item}>
            {item}
          </Select.Option>
        );
      })}
    </Select>
  );
}
