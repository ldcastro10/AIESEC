import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const redirectToContabilidad = () => {
    window.location.href = 'https://script.google.com/macros/s/AKfycbzF_5-CRfyzO6CevhE8uXPLL1tPRKJq46ufR72ufLg_5w-Hse4p9FNfQJuUmTZ5fng/exec';
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/createproduct">
          <button className="navbar-button">Crear Producto o Servicio</button>
        </Link>
        <Link to="/pago">
          <button className="navbar-button">Pago</button>
        </Link>
        <button className="navbar-button" onClick={redirectToContabilidad}>
          Contabilidad
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
