import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";

function Detail(props) {
 return (
   <Card style={{ width: "18rem", height: "24rem" }} className="mb-3">
     <Card.Img
       style={{ height: "14rem" }}
       variant="top"
       src={props.selected.image}
       alt={props.selected.description}
     />
     <Card.Body>
       <Card.Title>
           {props.selected.name}
       </Card.Title>
       <Card.Text className="contenedor">{props.selected.description}</Card.Text>
     </Card.Body>
   </Card>
 );
}

export default Detail;