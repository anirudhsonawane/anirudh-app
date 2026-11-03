import { useState } from "react";
import "./contactPageTransition.css";

type ContactTab = "investors" | "partnership";

function ContactUS() {
  const [activeTab, setActiveTab] = useState<ContactTab>("investors");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <main className="contact-page">
      {/* SHARED WEBSITE NAVIGATION */}

      <nav className="navigation contact-navigation">
        <div className="nav-item">
          <a href="/about">About</a>
        </div>

        <div className="nav-item nav-brand">
          <a href="/" aria-label="Realevate Home">
            <img
              src="/Ascent™ Black Geometric Logo.png"
              alt="Realevate"
              className="nav-logo"
            />
          </a>
        </div>

        <div className="nav-item">
          <a href="/contact">Contact Us</a>
        </div>
      </nav>

      {/* MAIN CONTACT CONTENT */}

      <section className="contact-content">
        {/* VERTICAL CONTACT TITLE */}

        <div className="contact-title-container" aria-hidden="true">
          <div className="contact-title-track">
            <span>Contact</span>
            <span>Contact</span>
            <span>Contact</span>
            <span>Contact</span>
            <span>Contact</span>
            <span>Contact</span>
          </div>
        </div>

        {/* CONTACT INFORMATION */}

        <div className="contact-information">
          <div className="contact-intro">Let's talk.</div>

          <div className="contact-details">
            <div className="contact-detail">
              <h3>Office</h3>
              <a href="mailto:info@realevate.agency">Info@realevate.agency</a>
            </div>

            <div className="contact-detail">
              <h3>Whatsapp</h3>
              <a
                href="https://wa.me/972546020690"
                target="_blank"
                rel="noopener noreferrer"
              >
                Send a message
              </a>
            </div>

            <div className="contact-detail">
              <h3>Phone</h3>
              <a href="tel:+972546020690">(+972) 54 60 20 690</a>
            </div>
          </div>
        </div>

        {/* CONTACT FORM */}

        <div className="contact-form-container">
          <div
            className="contact-tabs"
            role="tablist"
            aria-label="Enquiry type"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "investors"}
              className={`contact-tab ${
                activeTab === "investors" ? "active" : ""
              }`}
              onClick={() => setActiveTab("investors")}
            >
              Investors
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "partnership"}
              className={`contact-tab ${
                activeTab === "partnership" ? "active" : ""
              }`}
              onClick={() => setActiveTab("partnership")}
            >
              Partnership
            </button>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-field full-width">
              <input
                type="text"
                name="fullName"
                placeholder="Full name*"
                aria-label="Full name"
                autoComplete="name"
                required
              />
            </div>

            <div className="contact-field full-width">
              <input
                type="email"
                name="email"
                placeholder="Email*"
                aria-label="Email"
                autoComplete="email"
                required
              />
            </div>

            <div className="contact-field-grid">
              <div className="contact-field">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone*"
                  aria-label="Phone"
                  autoComplete="tel"
                  required
                />
              </div>

              <div className="contact-field select-field">
                <select
                  name="country"
                  aria-label="Country"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Country*
                  </option>
                </select>
              </div>

              <div className="contact-field select-field">
                <select
                  name="investmentBudget"
                  aria-label="Investment budget"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Investment budget*
                  </option>
                </select>
              </div>

              <div className="contact-field select-field">
                <select
                  name="purchaseGoal"
                  aria-label="Purchase goal"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Purchase goal
                  </option>
                </select>
              </div>

              <div className="contact-field select-field">
                <select
                  name="preferredDestination"
                  aria-label="Preferred destination"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Preferred destination
                  </option>
                </select>
              </div>

              <div className="contact-field select-field">
                <select
                  name="purchaseTimeline"
                  aria-label="Purchase timeline"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Purchase timeline
                  </option>
                </select>
              </div>
            </div>

            <div className="contact-field contact-message-field">
              <textarea
                name="message"
                placeholder="Message"
                aria-label="Message"
                rows={2}
              />
            </div>

            <div className="contact-consent">
              <input
                type="checkbox"
                id="contact-consent"
                name="consent"
                required
              />

              <label htmlFor="contact-consent">
                I agree to the <span>Privacy Policy</span> &{" "}
                <span>Terms Of Use</span> and to receive information and
                occasional updates from Realevate.
              </label>
            </div>

            <button type="submit" className="contact-submit">
              Send
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

export default ContactUS;
