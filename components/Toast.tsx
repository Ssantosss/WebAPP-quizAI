'use client';
import { useState } from 'react';
import Button from './Button';

export default function Toast({ message }: { message: string }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="toast">
      {message}
      <Button variant="ghost" onClick={() => setOpen(false)}>
        OK
      </Button>
    </div>
  );
}
