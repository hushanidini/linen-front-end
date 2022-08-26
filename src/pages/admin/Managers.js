import React, {Component} from 'react';
import RootElement from "./component/RootElement";
import ManagersTable from "../../components/tables/ManagersTable";
import {fetchManagers} from "../../services/private/ManagersService";
import {addBranches, addManager, getAllBranches} from "../../services/private/BranchService";
import {isEmpty ,get} from 'lodash';
import {connect} from "react-redux";
import AlertBar from "../../components/core/Alert/AlertBar";
import CustomLoader from "../../components/CustomLoader";
import {withStyles} from "@material-ui/core";
import CustomDialog from "../../components/core/CustomDialog";
import UserForm from "../../components/forms/UserForm";

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


class Managers extends Component {

    constructor(props) {
        super(props);
        this.state = {
            managers: [],
            branches: [],
            errors: {},
            tableHeader: [
                {
                    align: 'left',
                    key: 'name',
                    label: 'first name'
                },

                {
                    align: 'left',
                    key: 'lastname',
                    label: 'Last name'
                },
                {
                    align: 'left',
                    key: 'email',
                    label: 'Email'
                },
                {
                    align: 'left',
                    key: 'Branches',
                    label: 'Branches'
                },
                {
                    align: 'left',
                    key: 'action',
                    label: 'Action'
                }
            ],
            alertOpen: false,
            alertMessage: '',
            alertType: '',
            isLoading: false,
            isOpen: false,
            isEdit: false,
            isAdd: false,
        }
    }

    componentDidMount = async () => {
        this.setState({isLoading: true});

        try {
            const managers = await fetchManagers();
            const branches = await getAllBranches();
            this.setState({
                isLoading: false,
                managers: managers.data,
                branches: this.formatForMultipleSelect(branches.data)
            });
        } catch (e) {
        }

    }
    formatForMultipleSelect = branches => {
        return branches.map(branch => ({
            name: branch.name,
            id: branch.id
        }))
    }

    addBranches = async (ids, user) => {
        console.log(ids, user);
        if (isEmpty(ids)) return;
        this.setState({isLoading: true});
        try {
            const data = {
                user_id: user.id,
                branch_ids: ids
            }
            await addBranches(data);
            this.setState({
                isLoading: false,
                alertOpen: true,
                alertMessage: 'Successfully added branches',
                alertType: 'success'
            });
        } catch (e) {
            this.setState({
                isLoading: false,
                alertOpen: true,
                alertMessage: 'Something went wrong',
                alertType: 'error'
            });
        }
    }

    handleSubmit = async data => {
        this.setState({isLoading: true , errors: {}});
        if(data.role === 'manager'){
            try{
                const response = await addManager(data);
                this.setState({isLoading: false,
                    managers:[...this.state.managers , response.data] ,
                    isOpen: false,
                    isNew: false,
                    alertOpen: true,
                    alertMessage: 'Successfully added',
                    alertType: 'success'});
            }catch(e){
                if(e.response && e.response.data && e.response.data.errors ){
                    this.setState({
                        isLoading: false,
                        errors:e.response.data.errors
                    });
                }else{
                    this.setState({
                        isOpen: false,
                        isNew: false,
                        isLoading: false,
                        alertOpen: true,
                        alertMessage: 'Something went wrong',
                        alertType: 'error',
                        errors:{}
                    });
                }

            }
        }
        if(data.role === 'user'){
            // const data = {
            //     role:data.role,
            //     name:data.name,
            //     email:data.email
            // }
        }
        if(!get(data,'role' , false)){
            this.setState({isLoading: false, errors:{role:['Role should not be empty']}})
        }
    }

    render() {
        const {classes} = this.props;
        const {
            tableHeader, managers,
            branches, alertOpen,
            alertMessage,
            alertType, isLoading,
            isOpen,
            errors,
            isAdd, isEdit,
        } = this.state;
        return (
            <RootElement>
                <div className={classes.head}>
                    <div className={classes.searchContainer}>
                        Manager list
                    </div>
                    <div>
                        <button className="btn btn-success"
                                onClick={() => this.setState({isOpen: true, isAdd: true})}>Add
                        </button>
                    </div>
                </div>
                <ManagersTable
                    addBranches={(branchIds, user) => this.addBranches(branchIds, user)}
                    branches={branches}
                    tableDatas={managers}
                    header={tableHeader}/>

                <div>
                    Managers
                </div>

                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={() => this.setState({alertOpen: false})}/>
                )}
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
                {isOpen && (
                    <CustomDialog
                        closeDialog={() => this.setState({isOpen: false, isAdd: false, isEdit: false, errors: {}})}
                        isNoteOpen={isOpen}>
                        {isAdd && (
                            <UserForm initialValues={{}}
                                      errors={errors}
                                      branches={branches}
                                      handleClose={() => this.setState({isOpen: false, isAdd: false, errors: {}})}
                                      getFormValue={data => this.handleSubmit(data)}/>
                        )}
                        {isEdit && (
                            <UserForm initialValues={{}} errors={errors}
                                      handleClose={() => this.setState({isOpen: false, isEdit: false, errors: {}})}
                                      getFormValue={data => this.handleUpdateSubmit(data)}/>
                        )}
                    </CustomDialog>
                )}
            </RootElement>
        )
    }
}

const mapStateToProps = state => {
    const {user} = state;
    return {user};
}
Managers = withStyles(styles)(Managers);
export default connect(mapStateToProps)(Managers);
