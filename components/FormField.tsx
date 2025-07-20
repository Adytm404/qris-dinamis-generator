
import React from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({ label, htmlFor, children }) => {
  return (
    <div className="w-full">
      <label htmlFor={htmlFor} className="block text-md font-semibold text-zinc-800 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
};
