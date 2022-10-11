import React, {useState} from 'react'
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const AdminNav = () => {
    const history = useHistory();

    const Logout = async () => {
	window.localStorage.removeItem("userID");

        try {
            await axios.delete('http://localhost:5000/logout');
            history.push("/");
        } catch (error) {
            console.log(error);
        }
    }
    
    return (
      <>
	<nav className="navbar navbar-expand-lg navbar-light bg-light">
	  <a className="navbar-brand" href="/dashboard">Adelicia's Restaurant
	    <img src="https://github.com/Olivers11/Images/blob/master/adlicias_background-removebg-preview.png?raw=true" 
	  alt="logo" className='d-inline-block align-top' style={{width: 30, marginRight: 10, objectFit: 'cover'}}/>
	  </a>
	  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
	    <span className="navbar-toggler-icon"></span>
	  </button>

	  <div className="collapse navbar-collapse" id="navbarSupportedContent">
	    <ul className="navbar-nav mr-auto">

	      <div className="container">
		<li className="nav-item active">
		  <a className="nav-link" href="/admin-dash"> Informe
		    <span className="sr-only">(current)</span></a>
		</li>
		<li className="nav-item active">
		  <a className="nav-link" href="/register">Registrar Usuario
		    <span className="sr-only">(current)</span></a>
		</li>
	      </div>
	    </ul>
	    <form className="form-inline my-2 my-lg-0">
	      <button className="btn btn-outline-danger my-2 my-sm-0" type="button" onClick={Logout}>Logout</button>
	    </form>
	  </div>
	</nav>
      </>
    );
}

export default AdminNav;
