import '../css/Home.css'


function Home() {
  return (
    <div className="home-container">
      <div className="overlay">
        <h1 className="brand-name">[PLACEHOLDER]</h1>
        <p className="tagline">Reborn Luxury.</p>
        <p className="coming-soon">COMING SOON</p>
        <input
          className="email-input"
          type="email"
          placeholder="Notify me at my email..."
        />
        <button className="notify-button">Notify Me</button>
        <div className="social-icons">
          <a href="#"><i className="fab fa-instagram" /></a>
          <a href="#"><i className="fab fa-tiktok" /></a>
        </div>
      </div>
    </div>
  );
}

export default Home;