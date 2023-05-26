import React, { useState, useEffect } from 'react';
import './OrderView.css';
import axios from 'axios';
import { io } from 'socket.io-client';
import Navbar from './navbar';
import Slider from "react-slick";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const socket = io('http://localhost:5000');

// Componente que representa un producto o servicio individual
function ProductCard({ product, onViewDetail }) {
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes enviar el comentario y la calificación al servidor o realizar otras acciones necesarias
    console.log('Comentario:', comment);
    console.log('Calificación:', rating);
    handleClose();
  };

  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body className="mb-3">
        <Card.Title>{product.nombre}</Card.Title>
        <Card.Text>Unidad: {product.unidad}</Card.Text>
        <Card.Text>Cantidad: {product.cantidad}</Card.Text>
        <Card.Text>Precio: {product.precio}</Card.Text>
        <Card.Text>Proveedor: {product.proveedor}</Card.Text>
        <Button variant="primary" onClick={() => onViewDetail(product)}>Ver Detalle</Button>
        <Button variant="primary">Agregar a la compra</Button>
      </Card.Body>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Comentario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="comment">
              <Form.Label>Comentario:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="rating">
              <Form.Label>Calificación:</Form.Label>
              <Form.Control
                type="number"
                min={0}
                max={5}
                step={0.5}
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Enviar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Card>
  );
}

// Slider para la lista de productos o servicios
function ProductList({ items, onViewDetail }) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {items.map((item) => (
        <div key={item.id}>
          <ProductCard product={item} onViewDetail={onViewDetail} />
        </div>
      ))}
    </Slider>
  );
}

const CardDetail = ({ product }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);

  const fetchComments = () => {
    // Aquí puedes hacer una solicitud al servidor para obtener los comentarios y calificaciones para el producto seleccionado
    // Por ahora, generaremos algunos datos de ejemplo
    const dummyComments = [
      { id: 1, comment: '¡Excelente producto!', rating: 4.5 },
      { id: 2, comment: 'Buena calidad, lo recomiendo.', rating: 5 },
    ];
    setComments(dummyComments);
  };

  const handleSubmitComment = (event) => {
    event.preventDefault();
    // Aquí puedes enviar el nuevo comentario y la calificación al servidor o realizar otras acciones necesarias
    const newCommentObject = { id: comments.length + 1, comment: newComment, rating: newRating };
    setComments([...comments, newCommentObject]);
    setNewComment('');
    setNewRating(0);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="card-detail-container">
      <h2>{product.nombre}</h2>
      <p>Unidad: {product.unidad}</p>
      <p>Cantidad: {product.cantidad}</p>
      <p>Precio: {product.precio}</p>
      <p>Proveedor: {product.proveedor}</p>
      <h3>Comentarios</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>Comentario: {comment.comment}</p>
          <p>Calificación: {comment.rating}</p>
        </div>
      ))}
      <h3>Agregar Comentario</h3>
      <form onSubmit={handleSubmitComment}>
        <label htmlFor="newComment">Comentario:</label>
        <textarea
          id="newComment"
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <label htmlFor="newRating">Calificación:</label>
        <input
          id="newRating"
          type="number"
          min={0}
          max={5}
          step={0.5}
          value={newRating}
          onChange={(e) => setNewRating(parseFloat(e.target.value))}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};


const OrderView = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchItems = () => {
    axios
      .get('http://localhost:3001/products')
      .then((response) => {
        console.log("response:", response.data);
        const products = response.data.filter((item) => item.tipo === 'PRODUCTO');
        const services = response.data.filter((item) => item.tipo === 'SERVICIO');

        setProducts(products);
        setServices(services);
        console.log("Products:", products);
        console.log("Services:", services);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  };

  useEffect(() => {
    fetchItems();

    socket.on('database_update', (data) => {
      fetchItems();
    });

    return () => {
      socket.off('database_update');
    };
  }, []);

  const handleViewDetail = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="order-container">
      <Navbar />
      <div className="order-view">
        <h2>Productos</h2>
        <Row>
          <ProductList items={products} onViewDetail={handleViewDetail} />
        </Row>
        
        <h2>Servicios</h2>
        <Row>
          <ProductList items={services} onViewDetail={handleViewDetail} />
        </Row>
      </div>
      {selectedProduct && <CardDetail product={selectedProduct} />}
    </div>
  );
};

export default OrderView;
