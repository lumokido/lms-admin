'use client';

import React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { TagsInput } from '@/components/ui/inputags';

interface TagsInputControllerProps {
  name: string;
  disabled?: boolean;
  label: string;
  control: any;
  rules?: any;
}

const TagsInputController: React.FC<TagsInputControllerProps> = ({
  name,
  label,
  control,
  rules,
  disabled = false,
}) => {
  return (
    <FormField
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => {
        const isRequired = rules?.required;
        return (
          <FormItem>
            <FormLabel htmlFor={name}>
              {label}
              {isRequired && <span> *</span>}
            </FormLabel>
            <FormControl>
              <TagsInput
                disabled={disabled}
                value={field.value || []}
                onValueChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TagsInputController;
