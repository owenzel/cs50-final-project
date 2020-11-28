import React, {Component} from 'react';
import Axios from "axios";
import './profile.css';

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            test: 1,
            organization: '',
            address: ''
        }

        //Bind functions (test)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidUpdate() {
        var data = {
            organization: this.state.organization,
            address: this.state.address
        } 
        
        console.log(JSON.stringify(data));

        if (this.state.organization != '' && this.state.address != '') {
            Axios.post('/profile', {
                organization: this.state.organization,
                address: this.state.address
            }).then(function (response) {
                console.log(response);
            });
            
            
            // fetch('/profile', {
            //     method: 'POST',
            //     // headers: {'Content-Type':'applications/json'},
            //     headers: {'Content-Type':'plain/text'},
            //     body: JSON.stringify(data)
            // }).then(function(response) {
            //     if (response.status >= 400) {
            //         throw new Error("Bad response from server");
            //     }
            //     return response.json();
            // }).then(function(data) {
            //     console.log(data)
            // }).catch(function(err) {
            //     console.log(err)
            // });
        }
    }

    //Test
    handleSubmit(event) {
        event.preventDefault();

        this.setState({
            organization: event.target[0].value,
            address: event.target[1].value
        });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit} method="POST">
                    <div>
                        <p>Organization:</p>
                        <input 
                            type="text" 
                            name="organization" 
                        />
                    </div>
                    <div>
                        <p>Address:</p>
                        <input 
                            type="text" 
                            name="address" 
                        />
                    </div>
                    <input type="submit" value="Submit" />
                </form>
                <p>{this.state.test}</p>
            </div>
        )
    }
}

export default Profile;