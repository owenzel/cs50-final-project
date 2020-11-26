import React, {Component} from 'react';
import Axios from "axios";
import './register.css';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        //Bind functions (test)
        this.handleClick = this.handleClick.bind(this)
    }

    //Test
    handleClick(e) {
        Axios.post(`http://localhost:8080/`, {
            firstName: 'Fred',
            lastName: 'Flintstone'
          })
          .then(res => {
              console.log(res);
          })
          .catch((err) => {
              console.log(err);
          });
    }

    render() {
        return (
            <button onClick={() => this.handleClick()}>Test</button>
        )
    }
}

export default Register;