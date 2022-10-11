import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function WaiterDashboard(){
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [orders, setOrders] = useState([]);
  const history = useHistory();

  useEffect(()=>{
    getOrders();
    refreshToken();
  }, []);

  const refreshToken = async () => {
      try {
	  const response = await axios.get('https://adelicias-backend-app.azurewebsites.net/token');
	  setToken(response.data.accessToken);
	  const decoded = jwt_decode(response.data.accessToken);
	  setExpire(decoded.exp);
      } catch (error) {
	  if (error.response) {
	      history.push("/");
	  }
      }
  }

  const axiosJWT = axios.create();

  axiosJWT.interceptors.request.use(async (config) => {
      const currentDate = new Date();
      if (expire * 1000 < currentDate.getTime()) {
	  const response = await axios.get('https://adelicias-backend-app.azurewebsites.net/token');
	  config.headers.Authorization = `Bearer ${response.data.accessToken}`;
	  setToken(response.data.accessToken);
	  const decoded = jwt_decode(response.data.accessToken);
	  setExpire(decoded.exp);
      }
      return config;
  }, (error) => {
      return Promise.reject(error);
  });

  const getOrders = async () => {
      const response = await axios.get('https://adelicias-backend-app.azurewebsites.net/orders', {
	params: {
	  estado: 3
	},
      });
      setOrders(response.data);
  }

  const removeOrder = (id)=>{
    console.log("id to delete: ", id);
    const new_arr = orders.filter(el => el.id !== id)
    setOrders(new_arr);
  }

  const handleClick = async( id)=>{

    removeOrder(id);
    try{
      await axios.post('https://adelicias-backend-app.azurewebsites.net/check-order',{
	query: {
	  id: id
	}
      });
    }catch(err){
      console.log(err);
    }
  }


  const addOrderToPayment = (ord)=>{
    window.localStorage.setItem('payment-order', JSON.stringify(ord));
    history.push("/payment-page");
  }





  return(
      <>
	<h2 className="card-title ml-4 mt-4 text-warning">Ordenes Cocinadas</h2>
	<div className="container" style={{marginTop: 80}}>
	  <div className="row">
	    <div className="col-md-8 mx-auto">
	      <table className="table table-striped">
		<thead className="thead-dark">
		  <tr className="text-center">
		    <th scope="col">#</th>
		    <th scope="col">fecha</th>
		    <th scope="col">Usuario</th>
		    <th scope="col">Estado</th>
		    <th scope="col">Total</th>
		    <th scope="col">Acciones</th>
		  </tr>
		</thead>
		<tbody className="text-center">
		  {orders.map((ord, index) => (
		    <tr key={ord.id}>
		      <th scope="row">{index}</th>
		      <td>{ord.fecha}</td>
		      <td>{ord.idUsuario}</td>
		      <td>Cocinado</td>
		      <td>Q.{ord.totalPedido}</td>
		      <td>
			<button onClick={(e) => addOrderToPayment(ord)} className="btn btn-success">
			  Terminar Pedido
			</button>
		      </td>
		    </tr>
		  ))}
		</tbody>
	      </table>
	    </div>
	  </div>
	</div>
      </>
  );
}
