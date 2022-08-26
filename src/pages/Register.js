import React, {Component} from "react";
import CustomLoader from "../components/CustomLoader";
import img from "../assets/img/logo2.png";
import MembershipComponent from "../components/Register/MemberShipComponent";
import {fetchMemberships} from "../services/MembershipService";
import {registerUser, resendActivationCode} from '../services/UserService';
import RegisterComponent from "../components/Register/RegisterComponent";
import AlertBar from "../components/core/Alert/AlertBar";
import {ArrowBack} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            isLoading: false,
            isMembership: true,
            isRegister: false,
            isSuccess: false,
            memberships: [],
            membership: {},
            time: {},
            seconds: 15,
            email: '',
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let seconds;
        if(secs < 60){
            seconds = secs;
        }else{
            let divisor_for_seconds = divisor_for_minutes % 60;
            seconds = Math.ceil(divisor_for_seconds);
        }


        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    componentDidMount = async () => {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({isLoading: true, time: timeLeftVar});
        try {
            const memberships = await fetchMemberships();
            this.setState({memberships: memberships.data, isLoading: false});
        } catch (e) {
            this.setState({isLoading: true});
        }
    }

    startTimer() {
        if (this.timer === 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });
        // Check if we're at zero.
        if (seconds === 0) {
            clearInterval(this.timer);
        }
    }

    registerSubmit = async (data) => {
        this.setState({isLoading: true, errors: {} ,isSuccess:false });
        const {membership} = this.state;
        const user = {
            member_ship_id: membership.id,
            firstname: data.firstname,
            lastname: data.lastname,
            phone: data.phone,
            email: data.email,
            password: data.password,
        }
        try {
            await registerUser(user);
            this.props.history.push('activation/'+ data.email);
            // this.timer = 0;
            // this.setState({
            //     isLoading: false, errors: {},
            //     isSuccess: true,
            //     alertOpen: true,
            //     alertMessage: "Successfully sent activation code",
            //     alertType: 'success',
            //     email: data.email
            // }, () => this.startTimer());
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

    resendActivationCode = async () => {
        this.setState({isLoading: true });
        const {email} = this.state;
        try {

            await resendActivationCode({email});
            this.timer = 0;
            this.setState({
                isLoading: false,
                errors: {},
                isSuccess: true,
                alertOpen: true,
                alertMessage: "Successfully resent",
                alertType: 'success',
                seconds:30,
            },() => this.startTimer());
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

    render() {
        const {
            errors, isLoading,
            memberships,
            isRegister,
            isSuccess,
            time,
            alertOpen,
            alertMessage,
            alertType
        } = this.state;
        return (
            <div className="container pt-5">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <div className="col-md-12 d-flex justify-content-center">
                            <img src={img} alt="" className="col-md-6"/>
                        </div>
                        {isRegister && (
                            <div>
                                <IconButton onClick={()=>this.setState({isRegister:false})} >
                                    <ArrowBack/>
                                </IconButton>
                                <RegisterComponent errors={errors}
                                                   getFormValue={val => this.registerSubmit(val)}/>
                                {isSuccess && (
                                    <div style={{flexDirection: 'column', display: 'flex', alignItems: 'center'}}>
                                        <p> We have sent you an active code. please check your mail</p>
                                        {this.state.time.s === 0 && time.m === 0 ? (
                                                <a href={true} className="p-4" style={{
                                                    cursor: 'pointer',
                                                    color: '#007bff'
                                                }}
                                                onClick={() => this.resendActivationCode()}>Resend</a>
                                            ) :
                                            <div>
                                                m: {this.state.time.m} s: {this.state.time.s}
                                            </div>
                                        }
                                    </div>
                                )}
                                <div className="d-flex justify-content-center">
                                    <p className="p-4">
                                        <a href={true} style={{
                                        cursor: 'pointer',
                                        color: '#007bff'
                                    }} onClick={() => this.props.history.push('login')}>Login</a></p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {memberships && !isRegister && (
                    <div className="plan">
                        <h3 className="text-center pb-4">Select Your <b>Plan</b></h3>
                        <div className="row">
                            <div className=""
                                 style={{ display: 'flex',
                                     flexDirection: 'row' ,
                                     alignItems: 'center' ,
                                     overflow: 'auto' ,
                                     justifyContent: 'space-around'}}>
                                {memberships.map(membership => {
                                    return (
                                        <MembershipComponent getMembership={(data) => this.setState({
                                            membership: data,
                                            isMembership: false,
                                            isRegister: true
                                        })}
                                                             membership={membership}/>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                ) }

                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={()=>this.setState({alertOpen:false})}/>
                )}
            </div>

        );
    }
}

export default Register;
