import '../styles/navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <ul>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#misc">Misc</a></li>
        </ul>
      </div>
    </nav>
  )
}
