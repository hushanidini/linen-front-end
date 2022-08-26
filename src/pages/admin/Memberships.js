import React, {Component} from 'react';
import RootElement from "./component/RootElement";
import {
    addMembership,
    deleteMembership,
    fetchMemberships,
    updateMembership
} from "../../services/private/MemberShipService";
import CustomLoader from "../../components/CustomLoader";
import MembershipTable from "../../components/tables/MemberShipTable";
import {withStyles} from "@material-ui/core";
import CustomDialog from "../../components/core/CustomDialog";
import MembershipForm from "../../components/forms/MembershipForm";
import {findIndex ,isEmpty} from 'lodash';
import AlertBar from "../../components/core/Alert/AlertBar";
import Swal from "sweetalert2";


const styles = theme => ({
    head: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '12px'
    },
    searchContainer: {
        float: 'right',
        padding: '0px 0px  6px  6px',
        marginTop: '8px',
        marginRight: '16px',
        fontSize: '17px',
        border: 'none',
        cursor: 'pointer'
    },
});

class Membership extends Component {
    constructor(props) {
        super(props);
        this.state = {
            memberships: [],
            membership:{},
            isLoading: false,
            isOpen:false,
            isEdit: false,
            isAdd: false,
            isNew: false,
            header:[
                {
                    align: 'left',
                    key: 'name',
                    label: 'Membership name'
                },
                {
                    align: 'right',
                    key: 'fee',
                    label: 'Fee'
                },
                {
                    align: 'right',
                    key: 'points_per_booking',
                    label: 'Points per booking'
                },
                {
                    align: 'right',
                    key: 'cancellation',
                    label: 'Cancellation'
                },
                {
                    align: 'right',
                    key: 'exchange',
                    label: 'exchange'
                },
                {
                    align: 'center',
                    key: 'action',
                    label: 'Action'
                }
            ],
            errors:{}
        }
    }

    componentDidMount = async ()=> {
        this.setState({isLoading: true});
        try{
            const membership = await fetchMemberships();
            this.setState({memberships: membership.data , isLoading: false});
        }catch(e){
            this.setState({isLoading: false});
        }
    }

    openUpdateForm = (membership) => {
        this.setState({isOpen: true, isEdit: true, membership});
    }

    deleteMembership = async (membership) => {
        const {memberships} = this.state;
        const swal = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to save the changes.',
            icon:'success',
            showCloseButton:true,
            showCancelButton: true,
            reverseButtons:true,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Delete`,
            confirmButtonColor:'#ff5252'
        });
        if (swal.value){
            this.setState({isLoading: true});
            try {
                const response = await deleteMembership(membership.id);
                const removedMemberships =memberships.filter(item => item.id !== membership.id);

                this.setState({
                    isLoading: false,
                    memberships:removedMemberships,
                    alertOpen:true,
                    alertMessage:response.message,
                    alertType:'success'
                }  );
            }catch(e){
                this.setState({
                    isLoading: false,
                    alertOpen:true,
                    alertMessage:'Something went wrong!',
                    alertType:'error'
                })
            }
        }
    }

    handleSubmit = async (membership) => {
        this.setState({isLoading: true , error:{}});
        try{
            const response = await addMembership(membership);
            this.setState({
                memberships:[...this.state.memberships , response.data] ,
                isLoading: false ,
                isOpen:false,
                isAdd:false,
                alertOpen:true,
                alertMessage:response.message,
                alertType:'success'
            })
        }catch(e){
            if(e.response && e.response.data && e.response.data.errors ){
                this.setState({
                    isLoading: false,
                    errors:e.response.data.errors
                });
            }else{
                this.setState({
                    isOpen:false,
                    isAdd:false,
                    isLoading: false,
                    alertOpen:true,
                    alertMessage:"Something went wrong",
                    alertType:'error'
                });
            }
        }
    }

    handleUpdateSubmit = async (membershipData) => {
        const {membership ,memberships} = this.state;
        this.setState({isLoading:true});
        try{
            const response = await updateMembership(membership.id,membershipData);
            const index = findIndex(memberships , {id:membership.id});
            memberships[index] = response.data;
            this.setState(state =>{
                return {
                    isEdit:false ,
                    memberships,
                    isLoading: false,
                    isOpen:false,
                    alertOpen:true,
                    alertMessage:response.message,
                    alertType:'success'
                }});

        }catch(e){
            if(e.response && e.response.data && e.response.data.errors ){
                this.setState({
                    isLoading: false,
                    errors:e.response.data.errors
                });
            }else{
                this.setState({
                    isOpen:false,
                    isEdit:false,
                    isLoading: false,
                    alertOpen:true,
                    alertMessage:"Something went wrong",
                    alertType:'error'
                });
            }
        }
    }

    render() {
        const {
            isLoading,
            alertOpen,
            alertMessage,
            alertType,
            isOpen,
            errors,
            membership,
            header,memberships,isAdd,isEdit,
        } = this.state;
        const {classes} = this.props;
        return (
            <RootElement>
                <div className={classes.head}>
                    <div className={classes.searchContainer}>
                            Memberships
                    </div>
                    <div>
                        <button className="btn btn-success"
                                onClick={() => this.setState({isOpen: true, isAdd: true})}>Add
                        </button>
                    </div>
                </div>
                {!isEmpty(memberships) && (
                    <MembershipTable openUpdateForm={data => this.openUpdateForm(data)}
                                     handleDelete={data => this.deleteMembership(data)}
                                     memberships={memberships} header={header}/>
                )}
                {isEmpty(memberships) && (
                    <div style={{display: 'flex',height: '100%' ,alignItems: 'center',justifyContent: 'center' , fontSize: 24}}>
                        Not found memberships
                    </div>
                )}

                {isOpen && (
                    <CustomDialog
                        closeDialog={() => this.setState({isOpen: false, isAdd: false, isEdit: false, errors: {}})}
                        isNoteOpen={isOpen}>
                        {isAdd && (
                            <MembershipForm initialValues={{}} errors={errors}
                                            handleClose={() => this.setState({isOpen: false, isAdd: false, errors: {}})}
                                            getFormValue={data => this.handleSubmit(data)}/>
                        )}
                        {isEdit && (
                            <MembershipForm initialValues={membership} errors={errors}
                                            handleClose={() => this.setState({isOpen: false, isEdit: false, errors: {}})}
                                            getFormValue={data => this.handleUpdateSubmit(data)}/>
                        )}
                    </CustomDialog>
                )}
                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={()=>this.setState({alertOpen:false})}/>
                )}
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
            </RootElement>
        )
    }
}

export default withStyles(styles)(Membership);
