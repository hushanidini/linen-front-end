import React, {Component} from "react";
import './style/login.css'
import {loginUser} from "../services/AuthService";
import LoginComponent from "../components/Login/LoginComponent";
import CustomLoader from "../components/CustomLoader";


class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            isLoading: false,
        }
    }

    loginSubmit = async (data) => {
        this.setState({isLoading: true, errors: {}});
        const user = {
            email: data.email,
            password: data.password,
        }
        try {
            await loginUser(user);
            this.props.history.push('/');
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                this.setState({
                    isLoading: false,
                    errors: e.response.data.errors
                });
            } else {
                this.setState({
                    isOpen: false,
                    isAdd: false,
                    isLoading: false,
                    alertOpen: true,
                    alertMessage: "Something went wrong",
                    alertType: 'error'
                });
            }
        }
    }

    render() {
        const {errors, isLoading} = this.state;
        return (
            <div className="global-container" style={{height: 'calc(100vh - 160px)', backgroundColor: 'white'}}>
                {/*<LoginForm getFormValue={val=>this.loginSubmit(val)}/>*/}
                <LoginComponent errors={errors}
                                getFormValue={val => this.loginSubmit(val)}/>
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
            </div>
        );
    }
}

export default Login;
