import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function CookingPage(){
  const [token, setToken] = useState('');
  const [expire, setExpire] = useState('');
  const [orders, setOrders] = useState([]);
  const [orders2, setOrders2] = useState([]);
  const history = useHistory();

  useEffect(()=>{
    getOrders();
    getOthersOrders();
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
      const response = await axios.get('https://adelicias-backend-app.azurewebsites.net/orders',{
      params: {
        estado: 1
      }
      });
      console.log(response.data);
      setOrders(response.data);
  }



  const getOthersOrders = async()=>{
      const response = await axios.get('https://adelicias-backend-app.azurewebsites.net/orders',{
      params: {
        estado: 2
      }
      });
      console.log(response.data);
      setOrders2(response.data);
  }

  const removeOrder = (id)=>{
    const add = (el)=>{
      setOrders2((orders2) => [...orders2, el]);
    }

    orders.map((el)=>{
      if(el.id === id){
	add(el);
      }
    });
    const new_arr = orders.filter(el => el.id !== id)
    setOrders(new_arr);
  }

  const handleClick = async(id)=>{

    removeOrder(id);
    try{
      await axios.post('https://adelicias-backend-app.azurewebsites.net/change-status',{
	id: id
      });
    }catch(err){
      console.log(err);
    }
  }


  const handleRemove = async(id)=>{
    const new_arr = orders2.filter(el => el.id !== id)
    setOrders2(new_arr);
    try{
      await axios.post('https://adelicias-backend-app.azurewebsites.net/finish-order',{
	id: id
      });
    }catch(err){
      console.log(err);
    }
  }

  return(
    <>
	<div className="container" style={{marginTop: 80}}>
	  <div className="row">
	    <div className="col-md-6">
	      <table className="table">
		<thead className="thead-dark">
		  <tr>
		    <th scope="col">#</th>
		    <th scope="col">fecha</th>
		    <th scope="col">Usuario</th>
		    <th scope="col">Estado</th>
		    <th scope="col">Total</th>
		    <th scope="col">Acciones</th>
		  </tr>
		</thead>
		<tbody>
		  {orders.map((ord, index) => (
		    <tr key={ord.id+ord.totalPedido}>
		      <th scope="row">{index}</th>
		      <td>{ord.fecha}</td>
		      <td>{ord.idUsuario}</td>
		      <td className="text-primary">Solicitado</td>
		      <td>Q.{ord.totalPedido}</td>
		      <td>
			<button onClick={(e) => handleClick(ord.id)} className="btn btn-primary">Cocinar</button>
		      </td>
		    </tr>
		  ))}
		</tbody>
	      </table>
	     </div>
<div className="col-md-6">
	      <table className="table">
		<thead className="thead-dark">
		  <tr>
		    <th scope="col">#</th>
		    <th scope="col">fecha</th>
		    <th scope="col">Usuario</th>
		    <th scope="col">Estado</th>
		    <th scope="col">Total</th>
		    <th scope="col">Acciones</th>
		  </tr>
		</thead>
		<tbody>
		  {orders2.map((ord, index) => (
		    <tr key={ord.id+ord.totalPedido}>
		      <th scope="row">{index}</th>
		      <td>{ord.fecha}</td>
		      <td>{ord.idUsuario}</td>
		      <td className="text-success">Cocinando</td>
		      <td>Q.{ord.totalPedido}</td>
		      <td>
			<button onClick={(e) => handleRemove(ord.id)} className="btn btn-success">
			  Terminar
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
