import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">CausaPoll</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/precios">Planes</Link>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="" target="_blank" rel="noreferrer">Soporte</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
