import React, {Component} from 'react';
import Axios from "axios";
import './register.css';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        //Bind functions (test)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    //Test
    handleSubmit(e) {
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
            <div>
                <form onSubmit={this.handleSubmit}>
                    <div>
                        <p>Full name:</p>
                        <input type="text"/>
                    </div>
                    <div>
                        <p>Email:</p>
                        <input type="email"/>
                    </div>
                    <div>
                        <p>Password:</p>
                        <input type="text"/>
                    </div>
                    <div>
                        <p>Confirm password:</p>
                        <input type="text"/>
                    </div>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }
}

export default Register;