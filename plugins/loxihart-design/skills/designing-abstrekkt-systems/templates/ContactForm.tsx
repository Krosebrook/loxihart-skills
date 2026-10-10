// Abstrekkt Design System — ContactForm.tsx
// Full integration example: Input + Button + Toast + validation state machine
'use client';

import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import { useToast } from './Toast';

interface FormData {
  name: string;
  email: string;
  subject: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const errorMessages = {
  required: (field: string) => `${field} is required.`,
  email: 'Email format invalid. Use name@domain.com.',
} as const;

interface ContactFormProps {
  onSubmit?: (data: FormData) => Promise<void>;
}

export default function ContactForm({ onSubmit }: ContactFormProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!formData.name.trim()) next.name = errorMessages.required('Name');
    if (!formData.email.trim()) {
      next.email = errorMessages.required('Email');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = errorMessages.email;
    }
    if (!formData.subject.trim()) next.subject = errorMessages.required('Subject');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit?.(formData);
      success('Submitted. Confirmation sent.');
      setFormData({ name: '', email: '', subject: '' });
      setErrors({});
    } catch {
      error('Submission failed. Check connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
      <div className="flex flex-col gap-4">
        <Input
          id="name"
          name="name"
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          autoComplete="name"
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          autoComplete="email"
        />
        <Input
          id="subject"
          name="subject"
          label="Subject"
          value={formData.subject}
          onChange={handleChange}
          error={errors.subject}
          required
        />
        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </div>
    </form>
  );
}
