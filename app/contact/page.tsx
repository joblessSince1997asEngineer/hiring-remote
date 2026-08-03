export default function ContactPage() {
  return (
    <div className="container contact-container">
      {/* Left Side: Information */}
      <div className="contact-left">
        <h2>Let's talk about your hiring needs</h2>
        <p>Our global recruitment experts are ready to help you scale your team. Fill out the form, and we'll be in touch within 24 hours.</p>
        
        <div className="contact-item">
          <div style={{color: '#2563eb'}}>✉️</div>
          <div>
            <h4 style={{fontWeight: 'bold'}}>Email us</h4>
            <p style={{color: '#6b7280', fontSize: '14px'}}>Our friendly team is here to help.</p>
            <p style={{color: '#2563eb', fontWeight: '500'}}>hello@hiringremote.com</p>
          </div>
        </div>

        <div className="contact-item">
          <div style={{color: '#2563eb'}}>📍</div>
          <div>
            <h4 style={{fontWeight: 'bold'}}>Global HQ</h4>
            <p style={{color: '#6b7280', fontSize: '14px'}}>We are a fully remote company.</p>
            <p style={{color: '#6b7280', fontSize: '14px'}}>San Francisco, CA (Mailing Address)</p>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="contact-form">
        <div className="half-grid">
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
        </div>
        <input type="email" placeholder="Work email" />
        <input type="text" placeholder="Company name" />
        <textarea rows={5} placeholder="How can we help?"></textarea>
        <button className="submit-btn">Submit Inquiry</button>
      </div>
    </div>
  )
}