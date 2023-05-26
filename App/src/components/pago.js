import React, { useState } from 'react';
import './pago.css';

const Pago = () => {
  const [paymentData, setPaymentData] = useState({
    nombre: "",
    cedula: "",
  });

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Redireccionar a la página de PayU
    window.location.href = 'https://colombia.payu.com/';
  };

  return (
    <div style={{ backgroundImage: `url('https://i.ytimg.com/vi/1u-74sc4IIs/maxresdefault.jpg')`, backgroundSize: 'cover', height: '100vh' }}>
      <form className="payment-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre">
          Nombre:
          <input type="text" id="nombre" name="nombre" onChange={handleChange} />
        </label>
        <label htmlFor="cedula">
          Cedula:
          <input type="text" id="cedula" name="cedula" onChange={handleChange} />
        </label>
        <input type="image" src="https://academiadecirugiaplastica.org.co/images/2021/boton.png" alt="PayU Button" className="payu-button" />
      </form>
    </div>
  );
};

export default Pago;
