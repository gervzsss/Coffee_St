import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { staggerContainer, staggerItem } from "../../../components/motion/variants";
import { useContactForm } from "../../hooks";
import { useAuth } from "../../hooks/useAuth";
import { preventEnterSubmit, getInputClasses } from "../../utils/formHelpers";

export default function ContactForm() {
  const { user } = useAuth();
  const { formData, errors, isSubmitting, submitSuccess, threadId, handleChange, handleBlur, handleSubmit } = useContactForm();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div ref={ref} className="flex-1" initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }} transition={{ duration: 0.6, delay: 0.3 }}>
      <div className="relative overflow-hidden rounded-2xl bg-white/95 p-4 shadow-2xl ring-1 shadow-[#30442B]/10 ring-[#30442B]/10 sm:rounded-3xl sm:p-6 lg:p-10">
        <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-amber-100 opacity-60 blur-3xl"></div>
        <motion.div className="relative" variants={staggerContainer} initial="hidden" animate={isInView ? "visible" : "hidden"}>
          <motion.h2 className="font-outfit text-xl font-semibold text-[#30442B] sm:text-2xl lg:text-3xl" variants={staggerItem}>
            Send us a message
          </motion.h2>
          <motion.p className="mt-2 text-xs text-neutral-500 sm:mt-3 sm:text-sm" variants={staggerItem}>
            All fields are required so we can serve you better.
          </motion.p>

          {submitSuccess && (
            <motion.div
              className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-semibold">Thank you for your message!</p>
              <p className="mt-1 text-sm">We'll respond within 24 hours.</p>
              {threadId && (
                <p className="mt-2 text-xs text-green-700">
                  Reference ID: <span className="font-mono font-semibold">{threadId}</span>
                </p>
              )}
            </motion.div>
          )}

          {errors.submit && (
            <motion.div
              className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm">{errors.submit}</p>
            </motion.div>
          )}

          <motion.form id="contact-form" className="mt-6 space-y-5 sm:mt-8 sm:space-y-6 lg:space-y-7" onSubmit={handleSubmit} noValidate variants={staggerItem}>
            <motion.div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6" variants={staggerItem}>
              <div>
                <label htmlFor="contact-name" className="block text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
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
                  className={getInputClasses("name", errors)}
                  placeholder="Your full name"
                  aria-describedby="contact-name-error"
                  readOnly={!!user}
                  disabled={!!user}
                />
                {errors.name && (
                  <p id="contact-name-error" className="mt-2 text-sm font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
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
                  className={getInputClasses("email", errors)}
                  placeholder="name@example.com"
                  aria-describedby="contact-email-error"
                  readOnly={!!user}
                  disabled={!!user}
                />
                {errors.email && (
                  <p id="contact-email-error" className="mt-2 text-sm font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="contact-subject" className="block text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
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
                className={getInputClasses("subject", errors)}
                placeholder="Let us know how we can help"
                aria-describedby="contact-subject-error"
              />
              {errors.subject && (
                <p id="contact-subject-error" className="mt-2 text-sm font-medium text-red-500">
                  {errors.subject}
                </p>
              )}
            </motion.div>
            <motion.div variants={staggerItem}>
              <label htmlFor="contact-message" className="block text-xs font-semibold tracking-[0.25em] text-neutral-500 uppercase">
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
                className={getInputClasses("message", errors)}
                placeholder="Share the details so we can tailor our reply"
                aria-describedby="contact-message-error"
              ></textarea>
              {errors.message && (
                <p id="contact-message-error" className="mt-2 text-sm font-medium text-red-500">
                  {errors.message}
                </p>
              )}
            </motion.div>
            <motion.div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4" variants={staggerItem}>
              <p className="text-xs text-neutral-500 sm:text-sm">We'll respond within 24 hours — promise.</p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[#30442B] px-6 py-2.5 text-xs font-semibold tracking-[0.3em] text-white uppercase transition hover:bg-[#3a533a] focus:ring-4 focus:ring-[#30442B]/30 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:px-8 sm:py-3 sm:text-sm"
              >
                {isSubmitting ? "Sending..." : "Send message"}
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </motion.div>
  );
}
