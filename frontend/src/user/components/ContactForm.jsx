import { useContactForm } from '../hooks';
import { useAuth } from '../hooks/useAuth';
import { preventEnterSubmit, getInputClasses } from '../utils/formHelpers';

export default function ContactForm() {
  const { user } = useAuth();
  const {
    formData,
    errors,
    isSubmitting,
    submitSuccess,
    threadId,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useContactForm();

  return (
    <div className="flex-1">
      <div className="relative overflow-hidden rounded-3xl bg-white/95 p-6 shadow-2xl shadow-[#30442B]/10 ring-1 ring-[#30442B]/10 sm:p-10">
        <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-amber-100 opacity-60 blur-3xl"></div>
        <div className="relative">
          <h2 className="font-outfit text-3xl font-semibold text-[#30442B]">
            Send us a message
          </h2>
          <p className="mt-3 text-sm text-neutral-500">
            All fields are required so we can serve you better.
          </p>

          {submitSuccess && (
            <div className="mt-6 rounded-2xl bg-green-50 border border-green-200 p-4 text-green-800">
              <p className="font-semibold">Thank you for your message!</p>
              <p className="text-sm mt-1">We'll respond within 24 hours.</p>
              {threadId && (
                <p className="text-xs mt-2 text-green-700">
                  Reference ID:{' '}
                  <span className="font-mono font-semibold">{threadId}</span>
                </p>
              )}
            </div>
          )}

          {errors.submit && (
            <div className="mt-6 rounded-2xl bg-red-50 border border-red-200 p-4 text-red-800">
              <p className="text-sm">{errors.submit}</p>
            </div>
          )}

          <form
            id="contact-form"
            className="mt-8 space-y-7"
            onSubmit={handleSubmit}
            noValidate
          >
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
                  onBlur={handleBlur}
                  onKeyDown={preventEnterSubmit}
                  className={getInputClasses('name', errors)}
                  placeholder="Your full name"
                  aria-describedby="contact-name-error"
                  readOnly={!!user}
                  disabled={!!user}
                />
                {errors.name && (
                  <p
                    id="contact-name-error"
                    className="mt-2 text-sm font-medium text-red-500"
                  >
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
                  onBlur={handleBlur}
                  onKeyDown={preventEnterSubmit}
                  className={getInputClasses('email', errors)}
                  placeholder="name@example.com"
                  aria-describedby="contact-email-error"
                  readOnly={!!user}
                  disabled={!!user}
                />
                {errors.email && (
                  <p
                    id="contact-email-error"
                    className="mt-2 text-sm font-medium text-red-500"
                  >
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
                onBlur={handleBlur}
                onKeyDown={preventEnterSubmit}
                className={getInputClasses('subject', errors)}
                placeholder="Let us know how we can help"
                aria-describedby="contact-subject-error"
              />
              {errors.subject && (
                <p
                  id="contact-subject-error"
                  className="mt-2 text-sm font-medium text-red-500"
                >
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
                onBlur={handleBlur}
                onKeyDown={preventEnterSubmit}
                className={getInputClasses('message', errors)}
                placeholder="Share the details so we can tailor our reply"
                aria-describedby="contact-message-error"
              ></textarea>
              {errors.message && (
                <p
                  id="contact-message-error"
                  className="mt-2 text-sm font-medium text-red-500"
                >
                  {errors.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-500">
                We'll respond within 24 hours — promise.
              </p>
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
