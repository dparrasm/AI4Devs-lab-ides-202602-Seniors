import React, { useState } from 'react';
import type { CreateCandidateRequest } from '../types/candidate';
import { createCandidate } from '../services/candidatesApi';
import './AddCandidateForm.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  cv?: string;
}

interface AddCandidateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function AddCandidateForm({ onSuccess, onCancel }: AddCandidateFormProps) {
  const [formData, setFormData] = useState<CreateCandidateRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    education: '',
    workExperience: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!formData.firstName.trim()) next.firstName = 'First name is required';
    if (!formData.lastName.trim()) next.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      next.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      next.email = 'Please enter a valid email address';
    }
    if (cvFile) {
      if (!ALLOWED_CV_TYPES.includes(cvFile.type)) {
        next.cv = 'CV must be PDF or DOCX';
      } else if (cvFile.size > MAX_CV_SIZE) {
        next.cv = 'CV must be at most 5MB';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMessage(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await createCandidate(formData, cvFile);
      setSubmitMessage({ type: 'success', text: 'Candidate has been added successfully to the system.' });
      setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', education: '', workExperience: '' });
      setCvFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setSubmitMessage({ type: 'error', text: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="AddCandidateForm" onSubmit={handleSubmit} noValidate aria-label="Add candidate form">
      <h2>Add candidate</h2>

      <div className="form-group">
        <label htmlFor="firstName">First name *</label>
        <input
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
          disabled={loading}
          required
          aria-required="true"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
        />
        {errors.firstName && (
          <span id="firstName-error" className="field-error" role="alert">
            {errors.firstName}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last name *</label>
        <input
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
          disabled={loading}
          required
          aria-required="true"
          aria-invalid={!!errors.lastName}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
        />
        {errors.lastName && (
          <span id="lastName-error" className="field-error" role="alert">
            {errors.lastName}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          disabled={loading}
          required
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" className="field-error" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          value={formData.phone ?? ''}
          onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          id="address"
          type="text"
          value={formData.address ?? ''}
          onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="education">Education</label>
        <textarea
          id="education"
          value={formData.education ?? ''}
          onChange={(e) => setFormData((p) => ({ ...p, education: e.target.value }))}
          disabled={loading}
          rows={2}
        />
      </div>

      <div className="form-group">
        <label htmlFor="workExperience">Work experience</label>
        <textarea
          id="workExperience"
          value={formData.workExperience ?? ''}
          onChange={(e) => setFormData((p) => ({ ...p, workExperience: e.target.value }))}
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cv">CV (PDF or DOCX, max 5MB)</label>
        <input
          id="cv"
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
          disabled={loading}
          aria-invalid={!!errors.cv}
          aria-describedby={errors.cv ? 'cv-error' : undefined}
        />
        {errors.cv && (
          <span id="cv-error" className="field-error" role="alert">
            {errors.cv}
          </span>
        )}
      </div>

      {submitMessage && (
        <div
          className={`submit-message ${submitMessage.type}`}
          role="alert"
          aria-live="polite"
        >
          {submitMessage.text}
        </div>
      )}

      <div className="form-actions">
        {submitMessage?.type === 'success' && onSuccess ? (
          <button type="button" onClick={onSuccess} className="btn-primary">
            Back to dashboard
          </button>
        ) : (
          <>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Adding…' : 'Add candidate'}
            </button>
            {onCancel && (
              <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
                Cancel
              </button>
            )}
          </>
        )}
      </div>
    </form>
  );
}
