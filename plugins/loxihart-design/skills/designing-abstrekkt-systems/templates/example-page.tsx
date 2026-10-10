// Abstrekkt Design System — example-page.tsx
// Full integration: all components, toast system, modal, form
'use client';

import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Card from './Card';
import Modal from './Modal';
import Navbar from './Navbar';
import Table, { type TableColumn } from './Table';
import { ToastContainer, useToast } from './Toast';

// ── Sample Data ──────────────────────────────────────────────────────────────

interface Engagement {
  id: number;
  client: string;
  status: 'active' | 'complete' | 'pending';
  phase: string;
}

const SAMPLE_DATA: Engagement[] = [
  { id: 1, client: 'Art (Real Estate)', status: 'active', phase: 'Training' },
  { id: 2, client: '[CLIENT]', status: 'active', phase: 'Audit' },
  { id: 3, client: 'College of Lake County', status: 'pending', phase: 'Scoping' },
];

const STATUS_COLORS: Record<Engagement['status'], string> = {
  active: 'bg-success-50 text-success-700 border border-success-400',
  complete: 'bg-neutral-100 text-neutral-600 border border-neutral-300',
  pending: 'bg-warning-50 text-warning-700 border border-warning-400',
};

const COLUMNS: TableColumn<Engagement>[] = [
  { key: 'client', header: 'Client', sortable: true },
  {
    key: 'status',
    header: 'Status',
    render: (val) => (
      <span className={`px-2 py-0.5 rounded-full text-xs font-semi ${STATUS_COLORS[val as Engagement['status']]}`}>
        {String(val)}
      </span>
    ),
  },
  { key: 'phase', header: 'Phase', sortable: true },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ExamplePage() {
  const { toasts, remove, success, error, warning, info } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (val: string) => {
    if (!val) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Email format invalid. Use name@domain.com.';
    return '';
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(validateEmail(e.target.value));
  };

  return (
    <>
      <Navbar
        logo="Abstrekkt"
        items={[
          { label: 'Design System', href: '#design', isActive: true },
          { label: 'Components', href: '#components' },
          { label: 'FlashFusion', href: '#ff' },
        ]}
      />

      <main className="max-w-container mx-auto px-6 py-12 flex flex-col gap-12">

        {/* Hero */}
        <section>
          <h1 className="text-5xl font-display font-bold text-neutral-900 mb-4 tracking-tight">
            Abstrekkt Design System
          </h1>
          <p className="text-lg font-body text-neutral-600 max-w-2xl leading-relaxed">
            Token-driven. Accessibility-first. State-machine-correct.
            Construction, not recovery.
          </p>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Buttons</h2>
          <Card variant="elevated">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button disabled>Disabled</Button>
              <Button isLoading>Loading</Button>
            </div>
          </Card>
        </section>

        {/* Toasts */}
        <section>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Notifications</h2>
          <Card variant="elevated">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => success('Audit complete. 23 gaps identified.')}>
                Success
              </Button>
              <Button variant="secondary" onClick={() => error('Connection failed. Check network and retry.')}>
                Error
              </Button>
              <Button variant="ghost" onClick={() => warning('Session expiring in 5 minutes.')}>
                Warning
              </Button>
              <Button variant="ghost" onClick={() => info('New update available.')}>
                Info
              </Button>
            </div>
          </Card>
        </section>

        {/* Form */}
        <section>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Form States</h2>
          <Card variant="elevated" className="max-w-md">
            <div className="flex flex-col gap-4">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                error={emailError}
                helperText="We never share your email."
                required
              />
              <Input label="Success State" defaultValue="valid@example.com" success />
              <Input label="Disabled State" disabled defaultValue="Cannot edit" />
            </div>
          </Card>
        </section>

        {/* Modal */}
        <section>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Modal</h2>
          <Card variant="elevated">
            <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
              Open Modal
            </Button>
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Confirm Action"
              actions={
                <>
                  <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      success('Action confirmed.');
                      setIsModalOpen(false);
                    }}
                  >
                    Confirm
                  </Button>
                </>
              }
            >
              <p className="text-neutral-600">
                This action cannot be undone. All audit data will be permanently removed.
              </p>
            </Modal>
          </Card>
        </section>

        {/* Table */}
        <section>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-4">Engagements</h2>
          <Table
            columns={COLUMNS}
            data={SAMPLE_DATA}
            caption="Current FlashFusion client engagements"
          />
        </section>

      </main>

      <ToastContainer toasts={toasts} onRemove={remove} />
    </>
  );
}
