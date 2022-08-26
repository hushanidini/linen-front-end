import React, {Component} from "react";
import CustomLoader from "../components/CustomLoader";
import img from "../assets/img/logo2.png";
import AlertBar from "../components/core/Alert/AlertBar";
import ActivationForm from "../components/forms/ActivationForm";
import {isEmpty} from 'lodash';
import {activeAccount, resendActivationCode} from "../services/UserService";


class Activation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            isLoading: false,
            initialValues: {},
            time: {},
            seconds: 15,
            email: '',
        };
    }


    componentDidMount = async () => {
        this.setState({isLoading: true});
        const {match: {params},} = this.props;

        this.setState({isLoading: false, email: params.email});
    }

    resendActivationCode = async () => {
        this.setState({isLoading: true });
        const {email} = this.state;
        try {

            await resendActivationCode({email});
            this.setState({
                isLoading: false,
                errors: {},
                isSuccess: true,
                alertOpen: true,
                alertMessage: "Successfully resent",
                alertType: 'success',
            });
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                this.setState({
                    isLoading: false,
                    errors: e.response.data.errors
                });
            } else {
                this.setState({
                    isLoading: false,
                    alertOpen: true,
                    alertMessage: "Something went wrong",
                    alertType: 'error'
                });
            }
        }
    }

    activeAccount= async val=>{
        this.setState({isLoading:true});
        const {email} = this.state;
        try{
            const data ={
                activation_code: val.activation_code,
                email: email
            }
            await activeAccount(data);
            this.setState({
                isLoading:true,
                alertOpen: true,
                alertMessage: "Successfully verified your account",
                alertType: 'success',
            })
            setTimeout(() =>
                this.props.history.push('/login'), 4000
            )
        }catch(e){
            if (e.response && e.response.data && e.response.data.errors) {
                this.setState({
                    isLoading: false,
                    errors: e.response.data.errors
                });
            } else {
                this.setState({
                    isLoading: false,
                    alertOpen: true,
                    alertMessage: "Something went wrong",
                    alertType: 'error'
                });
            }
        }
    }

    render() {
        const {
            errors, isLoading,
            alertOpen,
            alertMessage,
            alertType,
            email
        } = this.state;
        return (
            <div className="container pt-5">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="col-md-12 d-flex justify-content-center">
                            <img src={img} alt="" className="col-md-6"/>
                        </div>
                        <br/>
                        <br/>
                        <p>Enter the code in the email sent to Email id here to verify and confirm your Account.</p>
                        {!isEmpty(email) && (
                            <ActivationForm getFormValue={(val)=> this.activeAccount(val)} initialValues={{}} errors={errors}/>
                        )}
                        <div style={{flexDirection: 'column', display: 'flex', alignItems: 'center'}}>
                            <p> We have sent you an active code. please check your mail {"  "}
                                    <a href={true} style={{
                                        cursor: 'pointer',
                                        color: '#007bff',
                                        textDecoration:'underline'
                                    }} onClick={() => this.resendActivationCode()}>RESEND</a>
                            </p>
                        </div>
                    </div>
                </div>

                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={() => this.setState({alertOpen: false})}/>
                )}
            </div>

        );
    }
}

export default Activation;
