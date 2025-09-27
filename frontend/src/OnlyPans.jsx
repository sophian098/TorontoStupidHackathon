import { useState } from 'react'
import pan1 from './assets/pan1.jpeg'
import pan2 from './assets/pan2.jpg'
import pan3 from './assets/pan3.jpeg'

export default function OnlyPans({ onBack }) {
  const [selectedPan, setSelectedPan] = useState(null)

  const pans = [
    {
      id: 1,
      name: "Sizzling Sarah",
      image: pan1,
      price: "$9.99",
      description: "Non-stick goddess with perfect heat distribution 🔥",
      subscribers: "12.3K",
      posts: 247,
      bio: "Professional chef's favorite. I make everything slide off smoothly 😉"
    },
    {
      id: 2,
      name: "Cast Iron Daddy",
      image: pan2,
      price: "$14.99",
      description: "Seasoned to perfection, built to last forever 💪",
      subscribers: "8.7K",
      posts: 189,
      bio: "Vintage vibes, modern performance. I get better with age 🍷"
    },
    {
      id: 3,
      name: "Copper Queen",
      image: pan3,
      price: "$19.99",
      description: "Premium heat conduction, luxury cooking experience ✨",
      subscribers: "15.1K",
      posts: 312,
      bio: "High-end cookware for discerning chefs. I'm worth every penny 💎"
    }
  ]

  return (
    <div className="onlypans-container">
      <div className="onlypans-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Text Wrecker
        </button>
        <h1 className="onlypans-title">OnlyPans 🍳</h1>
        <p className="onlypans-subtitle">Premium cookware content you can't find anywhere else</p>
      </div>

      <div className="pans-grid">
        {pans.map(pan => (
          <div key={pan.id} className="pan-card" onClick={() => setSelectedPan(pan)}>
            <div className="pan-image-container">
              <img src={pan.image} alt={pan.name} className="pan-image" />
              <div className="pan-overlay">
                <span className="pan-price">{pan.price}/month</span>
              </div>
            </div>
            <div className="pan-info">
              <h3 className="pan-name">{pan.name}</h3>
              <p className="pan-description">{pan.description}</p>
              <div className="pan-stats">
                <span className="subscribers">👥 {pan.subscribers}</span>
                <span className="posts">📸 {pan.posts} posts</span>
              </div>
            </div>
            <button className="subscribe-btn">Subscribe Now</button>
          </div>
        ))}
      </div>

      {selectedPan && (
        <div className="pan-modal-overlay" onClick={() => setSelectedPan(null)}>
          <div className="pan-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPan.name}</h2>
              <button className="close-modal" onClick={() => setSelectedPan(null)}>×</button>
            </div>
            <div className="modal-content">
              <img src={selectedPan.image} alt={selectedPan.name} className="modal-pan-image" />
              <div className="modal-info">
                <p className="modal-bio">{selectedPan.bio}</p>
                <p className="modal-description">{selectedPan.description}</p>
                <div className="modal-stats">
                  <div className="stat">
                    <span className="stat-number">{selectedPan.subscribers}</span>
                    <span className="stat-label">Subscribers</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{selectedPan.posts}</span>
                    <span className="stat-label">Posts</span>
                  </div>
                  <div className="stat">
                    <span className="stat-number">{selectedPan.price}</span>
                    <span className="stat-label">Per Month</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="subscribe-premium">Subscribe for {selectedPan.price}/month</button>
                  <button className="tip-button">Send Tip 💰</button>
                </div>
                <div className="recent-posts">
                  <h4>Recent Posts:</h4>
                  <div className="post-previews">
                    <div className="post-preview">🔥 "Just finished a perfect sear... check out these grill marks"</div>
                    <div className="post-preview">✨ "Getting steamy in the kitchen tonight... who wants to cook?"</div>
                    <div className="post-preview">💦 "Non-stick action in slow motion... so smooth"</div>
                    <div className="post-preview">🌶️ "Spicing things up with some jalapeños... can you handle the heat?"</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="onlypans-footer">
        <p>© 2024 OnlyPans - Where cookware gets spicy 🌶️</p>
        <div className="footer-links">
          <a href="#terms">Terms of Service</a>
          <a href="#privacy">Privacy Policy</a>
          <a href="#support">Support</a>
          <a href="#careers">Careers</a>
        </div>
      </div>
    </div>
  )
}
