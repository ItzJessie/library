import { useMemo, useState } from "react";
import "../css/ContactForm.css";

const ACCESS_KEY = "d660fc80-b260-4e38-8254-cf6bfec2b117";

const ContactForm = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: ""
	});
	const [errors, setErrors] = useState({});
	const [status, setStatus] = useState({ type: "", message: "" });
	const [isSubmitting, setIsSubmitting] = useState(false);

	const emailRegex = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/, []);

	const validate = () => {
		const nextErrors = {};

		if (!formData.name.trim()) {
			nextErrors.name = "Name is required.";
		}

		if (!formData.email.trim()) {
			nextErrors.email = "Email is required.";
		} else if (!emailRegex.test(formData.email.trim())) {
			nextErrors.email = "Please enter a valid email address.";
		}

		if (!formData.subject.trim()) {
			nextErrors.subject = "Subject is required.";
		}

		if (!formData.message.trim()) {
			nextErrors.message = "Message is required.";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	};

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData((prev) => ({
			...prev,
			[name]: value
		}));

		if (errors[name]) {
			setErrors((prev) => {
				const next = { ...prev };
				delete next[name];
				return next;
			});
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setStatus({ type: "", message: "" });

		if (!validate()) {
			setStatus({ type: "error", message: "Please fix the highlighted fields." });
			return;
		}

		setIsSubmitting(true);
		setStatus({ type: "pending", message: "Please wait..." });

		try {
			// Use FormData to avoid CORS preflight issues caused by JSON requests.
			const payload = new FormData();
			payload.append("access_key", ACCESS_KEY);
			payload.append("name", formData.name.trim());
			payload.append("email", formData.email.trim());
			payload.append("subject", formData.subject.trim());
			payload.append("message", formData.message.trim());

			const response = await fetch("https://api.web3forms.com/submit", {
				method: "POST",
				body: payload
			});

			let data = null;
			try {
				data = await response.json();
			} catch {
				data = null;
			}

			if (response.ok) {
				setStatus({
					type: "success",
					message: data?.message || "Message sent successfully."
				});
				setFormData({
					name: "",
					email: "",
					subject: "",
					message: ""
				});
			} else {
				setStatus({
					type: "error",
					message: data?.message || "Unable to send message right now. Please try again shortly."
				});
			}
		} catch (error) {
			setStatus({
				type: "error",
				message: "Unable to reach the form service. Please check your connection and try again."
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="contact-section reveal reveal-up" aria-labelledby="contact-heading">
			<h2 id="contact-heading">Get In Touch</h2>
			<p className="contact-intro">
				Have questions or want to share your thoughts about Japanese animation? We would love to hear from you.
			</p>

			<form className="contact-form" onSubmit={handleSubmit} noValidate>
				<div className="form-group">
					<label htmlFor="contactName">Name *</label>
					<input
						type="text"
						id="contactName"
						name="name"
						value={formData.name}
						onChange={handleChange}
						required
						placeholder="Your full name"
						aria-invalid={Boolean(errors.name)}
						aria-describedby={errors.name ? "contact-name-error" : undefined}
					/>
					<span className="error-message" id="contact-name-error">{errors.name || ""}</span>
				</div>

				<div className="form-group">
					<label htmlFor="contactEmail">Email *</label>
					<input
						type="email"
						id="contactEmail"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						placeholder="your.email@example.com"
						aria-invalid={Boolean(errors.email)}
						aria-describedby={errors.email ? "contact-email-error" : undefined}
					/>
					<span className="error-message" id="contact-email-error">{errors.email || ""}</span>
				</div>

				<div className="form-group">
					<label htmlFor="contactSubject">Subject *</label>
					<input
						type="text"
						id="contactSubject"
						name="subject"
						value={formData.subject}
						onChange={handleChange}
						required
						placeholder="What is this about?"
						aria-invalid={Boolean(errors.subject)}
						aria-describedby={errors.subject ? "contact-subject-error" : undefined}
					/>
					<span className="error-message" id="contact-subject-error">{errors.subject || ""}</span>
				</div>

				<div className="form-group">
					<label htmlFor="contactMessage">Message *</label>
					<textarea
						id="contactMessage"
						name="message"
						value={formData.message}
						onChange={handleChange}
						required
						rows="6"
						placeholder="Your message here..."
						aria-invalid={Boolean(errors.message)}
						aria-describedby={errors.message ? "contact-message-error" : undefined}
					></textarea>
					<span className="error-message" id="contact-message-error">{errors.message || ""}</span>
				</div>

				<button type="submit" className="submit-button" disabled={isSubmitting}>
					{isSubmitting ? "Sending..." : "Send Message"}
				</button>

				{status.message ? (
					<div className={`form-feedback ${status.type}`.trim()} role="status" aria-live="polite">
						{status.message}
					</div>
				) : null}
			</form>
		</section>
	);
};

export default ContactForm;
