import { useState } from 'react';
import api from '../api/axios';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/contact', formData);
      setSubmitSuccess(true);
      setThreadId(response.data.thread_id);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});

      // Hide success message after 8 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setThreadId(null);
      }, 8000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setErrors({
        submit: 'Failed to send message. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1">
      <div className="relative overflow-hidden rounded-3xl bg-white/95 p-6 shadow-2xl shadow-[#30442B]/10 ring-1 ring-[#30442B]/10 sm:p-10">
        <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-amber-100 opacity-60 blur-3xl"></div>
        <div className="relative">
          <h2 className="font-outfit text-3xl font-semibold text-[#30442B]">Send us a message</h2>
          <p className="mt-3 text-sm text-neutral-500">All fields are required so we can serve you better.</p>

          {submitSuccess && (
            <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-800">
              <p className="font-semibold">Thank you for your message!</p>
              <p className="text-sm mt-1">We'll respond within 24 hours.</p>
              {threadId && (
                <p className="text-xs mt-2 text-green-700">
                  Reference ID: <span className="font-mono font-semibold">{threadId}</span>
                </p>
              )}
            </div>
          )}

          {errors.submit && (
            <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800">
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}

          <form id="contact-form" className="mt-8 space-y-7" onSubmit={handleSubmit} noValidate>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500"
                >
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/15"
                  placeholder="Your full name"
                  aria-describedby="contact-name-error"
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-2 text-sm font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500"
                >
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/15"
                  placeholder="name@example.com"
                  aria-describedby="contact-email-error"
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-2 text-sm font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500"
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                autoComplete="off"
                value={formData.subject}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/15"
                placeholder="Let us know how we can help"
                aria-describedby="contact-subject-error"
              />
              {errors.subject && (
                <p id="contact-subject-error" className="mt-2 text-sm font-medium text-red-500">
                  {errors.subject}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold uppercase tracking-[0.25em] text-neutral-500"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows="6"
                autoComplete="off"
                value={formData.message}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[15px] font-medium text-neutral-900 shadow-sm transition focus:border-[#30442B] focus:outline-none focus:ring-4 focus:ring-[#30442B]/15"
                placeholder="Share the details so we can tailor our reply"
                aria-describedby="contact-message-error"
              ></textarea>
              {errors.message && (
                <p id="contact-message-error" className="mt-2 text-sm font-medium text-red-500">
                  {errors.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">We'll respond within 24 hours — promise.</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-[#30442B] px-8 py-3 cursor-pointer text-sm font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-[#3a533a] focus:outline-none focus:ring-4 focus:ring-[#30442B]/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
