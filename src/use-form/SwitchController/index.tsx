'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import React from 'react';

interface CheckboxControllerProps {
  name: string;
  label: string;
  rules?: any;
  control: any;
  disabled?: boolean;
}

const CheckboxController: React.FC<CheckboxControllerProps> = ({
  name,
  label,
  rules,
  control,
  disabled = false,
}) => {
  console.log('CheckboxController disabled:', disabled,label);
  return (
    <FormField
      control={control}
      name={name}
      // disabled={disabled}
      rules={rules}
      render={({ field }) => {
        return (
          <FormItem className='flex flex-row space-x-3 space-y-2 items-center justify-start'>
            <FormLabel className='text-sm font-normal'>{label}</FormLabel>
            <FormControl>
              <Switch
                checked={field?.value || false}
                onCheckedChange={(checked) => field.onChange(checked)}
                disabled={disabled}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
};

export default CheckboxController;
