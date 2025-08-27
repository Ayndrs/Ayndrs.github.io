import '../styles/navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul className="navbar-left">
          <a href="#/">GOHYUN</a>
        </ul>
        <ul className="navbar-right">
          <li><a href="#projects">Projects</a></li>
          <li><a href="#misc">Misc</a></li>
        </ul>
      </div>
    </nav>
  )
}
