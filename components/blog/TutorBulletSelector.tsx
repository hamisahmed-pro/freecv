'use client';

import { useRef, useState } from 'react';
import { tutorBullets } from '@/lib/tutor-examples';

export function TutorBulletSelector() {
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('');
  const field = useRef<HTMLTextAreaElement>(null);
  const bullet = tutorBullets[index].text;

  async function copy() {
    try {
      await navigator.clipboard.writeText(bullet);
      setStatus('Copied to clipboard.');
    } catch {
      field.current?.focus();
      field.current?.select();
      setStatus('Text selected. Use your device’s Copy command.');
    }
  }

  return (
    <div className="mt-5 border-t-2 border-[#141312] pt-4">
      <label htmlFor="tutor-setting" className="block font-bold">Choose a tutoring setting</label>
      <select id="tutor-setting" className="my-2 border-2 p-2" value={index} onChange={event => { setIndex(Number(event.target.value)); setStatus(''); }}>
        {tutorBullets.map((item, i) => <option key={item.label} value={i}>{item.label}</option>)}
      </select>
      <textarea ref={field} aria-label="Example resume bullet" className="block min-h-24 w-full border-2 p-3 text-sm" readOnly value={bullet} />
      <button type="button" onClick={copy} className="my-2 border-2 bg-[#141312] px-3 py-2 text-sm font-bold text-white">Copy bullet</button>
      <span role="status" className="ml-2 text-sm">{status}</span>
      <p className="text-sm">Choose wording that matches work you actually did. Add a result only if you can explain how you measured it.</p>
    </div>
  );
}
