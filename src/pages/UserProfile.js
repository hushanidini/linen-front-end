import React, {Component} from 'react';
import PublicRootElement from "./admin/component/PublicRootElement";
import {connect} from "react-redux";
import CustomLoader from "../components/CustomLoader";
import Profile from "../components/Profile";

class UserProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            invoiceDetails: [],
            isLoading: false,
            tableHeader: [
                {
                    align: 'left',
                    key: 'photographer_name',
                    label: 'Photographer name'
                },
                {
                    align: 'left',
                    key: 'shoot_type',
                    label: 'Shoot type'
                },
                {
                    align: 'left',
                    key: 'No of slots',
                    label: 'No of slots'
                },
            ],
        }
    }

    componentDidMount = async () => {
        this.setState({isLoading: true});
        try {
            this.setState({isLoading: false});
        } catch (err) {
            this.setState({isLoading: false});
        }
    }

    render() {
        const {isLoading} = this.state;
        const {user ,membership} = this.props;
        return (
            <PublicRootElement>
                <Profile membership={membership} user={user}/>

                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
            </PublicRootElement>
        )
    }

}

const mapStateToProps = state => {
    const {user ,membership} = state;
    return {user ,membership};

}
export default connect(mapStateToProps, null)(UserProfile);
