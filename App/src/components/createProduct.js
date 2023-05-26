import React, { useState } from 'react';
import axios from 'axios';
import './createProduct.css';

const CreateProduct = () => {
  const [productData, setProductData] = useState({
    nombre: "",
    unidad: "",
    cantidad: "",
    precio: "",
    proveedor: "",
    especificacion: ""
  });

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/process', productData)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('There was an error!', error);
      });
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://i.ytimg.com/vi/1u-74sc4IIs/maxresdefault.jpg')`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input type="text" name="nombre" onChange={handleChange} />
        </label>
        <label>
          Unidad:
          <input type="text" name="unidad" onChange={handleChange} />
        </label>
        <label>
          Cantidad:
          <input type="text" name="cantidad" onChange={handleChange} />
        </label>
        <label>
          Precio:
          <input type="text" name="precio" onChange={handleChange} />
        </label>
        <label>
          Proveedor:
          <input type="text" name="proveedor" onChange={handleChange} />
        </label>
        <label>
          Especificación:
          <input type="text" name="especificacion" onChange={handleChange} />
        </label>
        <input type="submit" value="Crear Producto" />
      </form>
    </div>
  );
};

export default CreateProduct;
