'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';

type ApplyFormState = {
  name: string;
  email: string;
  handle: string;
  focus: string;
  skills: string;
  links: string;
  message: string;
  company: string;
};

type ApplyStatus = 'idle' | 'sending' | 'success' | 'error';

const initialState: ApplyFormState = {
  name: '',
  email: '',
  handle: '',
  focus: '',
  skills: '',
  links: '',
  message: '',
  company: ''
};

export default function ApplyPage() {
  const [form, setForm] = useState<ApplyFormState>(initialState);
  const [status, setStatus] = useState<ApplyStatus>('idle');
  const [error, setError] = useState<string>('');

  const updateField = (key: keyof ApplyFormState) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const payload = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus('error');
        setError(payload?.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setForm(initialState);
    } catch (err) {
      setStatus('error');
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <section>
      <div className="container">
        <div className="page-header reveal">
          <div className="page-eyebrow">Join the team</div>
          <h1 className="page-title">Apply to sarrus</h1>
        </div>

        <div className="apply-card reveal reveal-delay-1">
          <div className="apply-copy">
            <h2 className="apply-title">Tell us about you</h2>
            <p className="apply-sub">
              We review every application. Share your strengths, what you enjoy building or breaking,
              and links to your work.
            </p>
          </div>

          <form className="apply-form" onSubmit={onSubmit}>
            <div className="form-grid">
              <label className="form-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={updateField('name')}
                  required
                  autoComplete="name"
                />
              </label>
              <label className="form-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField('email')}
                  required
                  autoComplete="email"
                />
              </label>
              <label className="form-field">
                <span>Handle</span>
                <input
                  type="text"
                  name="handle"
                  value={form.handle}
                  onChange={updateField('handle')}
                  placeholder="0x..."
                />
              </label>
              <label className="form-field">
                <span>Focus / Role Interests</span>
                <input
                  type="text"
                  name="focus"
                  value={form.focus}
                  onChange={updateField('focus')}
                  placeholder="web, pwn, crypto, rev"
                />
              </label>
              <label className="form-field">
                <span>Skills</span>
                <input
                  type="text"
                  name="skills"
                  value={form.skills}
                  onChange={updateField('skills')}
                  placeholder="Python, Rust, Burp, Ghidra..."
                />
              </label>
              <label className="form-field">
                <span>Links</span>
                <input
                  type="text"
                  name="links"
                  value={form.links}
                  onChange={updateField('links')}
                  placeholder="GitHub, writeups, portfolio"
                />
              </label>
            </div>

            <label className="form-field full">
              <span>Message</span>
              <textarea
                name="message"
                rows={6}
                value={form.message}
                onChange={updateField('message')}
                required
                placeholder="Tell us about your experience, favorite challenges, or goals."
              />
            </label>

            <label className="form-field honeypot" aria-hidden="true">
              <span>Company</span>
              <input
                type="text"
                name="company"
                tabIndex={-1}
                value={form.company}
                onChange={updateField('company')}
                autoComplete="off"
              />
            </label>

            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Submit application'}
              </button>
              {status === 'success' ? (
                <span className="form-status success">Application sent. We will get back to you soon.</span>
              ) : null}
              {status === 'error' ? (
                <span className="form-status error">{error}</span>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
