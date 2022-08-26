import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import RootElement from "./component/RootElement";
import {deleteService, getAllServices, saveService, updateService} from "../../services/private/ServicesService";
import {cloneDeep, findIndex, isEmpty} from "lodash";
import ServiceTable from "../../components/tables/ServiceTable";
import CustomDialog from "../../components/core/CustomDialog";
import CustomLoader from "../../components/CustomLoader";
import {getAllBranches} from "../../services/private/BranchService";
import ServiceForm from "../../components/forms/ServiceForm";
import Swal from "sweetalert2";
import AlertBar from "../../components/core/Alert/AlertBar";
import {withRouter} from "react-router";
import {connect} from "react-redux";
import SearchInput from "../../components/core/style/SearchInput";
import InputSelect from "../../components/core/InputSelect/InputSelect";


const styles = theme => ({
    head: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom: '12px'
    },
    search: {
        padding: '0px 0px  6px  6px',
    },
    searchButton: {
        float: 'right',
        padding: '6px 10px',
        marginTop: '8px',
        marginRight: '16px',
        background: '#ddd',
        fontSize: '17px',
        border: 'none',
        cursor: 'pointer'
    },
    searchInput: {
        padding: '6px',
        marginTop: '8px',
        fontSize: '17px',
        border: 'none'
    }
});


class Service extends Component {

    constructor(props) {
        super(props);
        this.originalServices = [];
        this.state = {
            services: [],
            branches: [],
            service: {},
            isLoading: false,
            tableHeader: [
                {
                    align: 'left',
                    key: 'name',
                    label: 'Service name'
                },
                {
                    align: 'left',
                    key: 'name',
                    label: 'Branch name'
                },
                {
                    align: 'left',
                    key: 'type',
                    label: 'Type'
                },
                {
                    align: 'left',
                    key: 'max_reservation',
                    label: 'Max reservation'
                },
                {
                    align: 'left',
                    key: 'tax',
                    label: 'Tax'
                },
                {
                    align: 'left',
                    key: 'status',
                    label: 'Status'
                },
                {
                    align: 'center',
                    key: 'action',
                    label: 'Action'
                }
            ],
            isOpen: false,
            isEdit: false,
            isAdd: false,
            responseError: [],
            alertOpen: false,
            alertMessage: '',
            alertType: '',
            errors: {},
        }
    }

    componentDidMount = async () => {
        this.setState({isLoading: true});
        const {user} = this.props;
        console.log(user);
        let services=[];
        let branches=[];
        let branchesFormat=[];
        let data={}
        try {
            if(!user.roles.includes('super_admin')){
                data={
                    'branch_id':2
                }
                services = await getAllServices(data);
            }else{
                services = await getAllServices(data);
                branches = await getAllBranches();
                branchesFormat = branches.data.map(branch => ({
                    label: branch.name,
                    value: branch.id
                }))
            }

            this.originalServices = cloneDeep(services.data);
            this.setState({
                services: services.data,
                branches: branchesFormat,
                isLoading: false
            },()=>console.log(this.state.services));
        } catch (e) {
            // this.setState({isLoading: false});
        }
    }

    searchBranch = (value) => {
        let filterServices = cloneDeep(this.originalServices);
        if (value.length !== 0) {
            this.setState({
                services: this.originalServices.filter(service => service.name.toLowerCase().includes(value.toLowerCase()))
            })
        } else {
            this.setState({services: filterServices})
        }
    }

    handleSubmit = async (service) => {
        this.setState({isLoading: true, errors: {}});
        try {
            const response = await saveService(service)
            this.originalServices = cloneDeep([...this.state.services, response.data]);
            this.setState(state => {
                return {
                    services: [...state.services, response.data],
                    isLoading: false, isOpen: false, isAdd: false,
                    alertOpen: true,
                    alertMessage: response.message,
                    alertType: 'success'
                }
            });
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

    updateBranch = async (data) => {
        this.setState({isLoading: true, errors: {}});
        const {services, service} = this.state;
        try {
            const serviceResponse = await updateService(service.id, data);
            const index = findIndex(services, {id: service.id});
            serviceResponse.data.branch = service.branch;
            services[index] = serviceResponse.data;
            this.originalServices = cloneDeep(services);
            this.setState({
                isLoading: false,
                isOpen: false,
                isEdit: false,
                services,
                alertOpen: true,
                alertMessage: serviceResponse.message,
                alertType: 'success'
            });
        } catch (e) {
            if (e.response && e.response.data && e.response.data.errors) {
                this.setState({
                    isLoading: false,
                    errors: e.response.data.errors
                });
            } else {
                this.setState({
                    isOpen: false,
                    isEdit: false,
                    isLoading: false,
                    alertOpen: true,
                    alertMessage: "Something went wrong",
                    alertType: 'error'
                });
            }
        }
    }

    openUpdateForm = (service) => {
        this.setState({isOpen: true, isEdit: true, service});
    }

    deleteBranch = async (data) => {
        const {services} = this.state;

        const swal = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to save the changes.',
            icon: 'success',
            showCloseButton: true,
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Delete`,
            confirmButtonColor: '#ff5252'
        });
        if (swal.value) {
            try {
                const response = await deleteService(data.id);
                const removedServices = services.filter(item => item.id !== data.id);
                this.originalBranches = cloneDeep(removedServices);

                this.setState({
                    services: removedServices,
                    alertOpen: true,
                    alertMessage: response.message,
                    alertType: 'success'
                });
            } catch (e) {
                this.setState({
                    alertOpen: true,
                    alertMessage: 'Something went wrong!',
                    alertType: 'error'
                });
            }
        }
    }

    goToDetails = id => {
        this.props.history.push('service/details/' + id);
    }

    selectByBranch = (value) => {
        let filterServices = cloneDeep(this.originalServices);
        if (value !== 'default') {
            this.setState({
                services: this.originalServices.filter(item => item.branch_id === Number(value))
            });
        } else {
            this.setState({
                services: filterServices
            });
        }

    }

    render() {
        const {classes} = this.props;
        const {
            services, tableHeader, service,
            branches,
            isOpen,
            isAdd,
            isEdit,
            isLoading,
            alertOpen,
            alertMessage,
            errors,
            alertType
        } = this.state;
        return (
            <RootElement>
                <div className={classes.head}>
                    <div style={{marginTop: '20px', width: '200px'}}>
                        <SearchInput
                            onChangeSearch={value => this.searchBranch(value)}
                            onClickSearch={value => this.searchBranch(value)}
                        />
                    </div>
                    <div style={{marginTop: '20px', width: '200px'}}>
                        {!isEmpty(services) && (
                            <InputSelect
                                options={branches}
                                placeholder={'Select all'}
                                isLabel={false}
                                getValue={value => this.selectByBranch(value)}
                            />
                        )}
                    </div>
                    <div>
                        <button className="btn btn-success"
                                onClick={() => this.setState({isOpen: true, isAdd: true})}>Add
                        </button>
                    </div>
                </div>
                {!isEmpty(services) && (
                    <ServiceTable services={services}
                                  header={tableHeader}
                                  goToDetails={(value) => this.goToDetails(value)}
                                  openUpdateForm={data => this.openUpdateForm(data)}
                                  handleDelete={data => this.deleteBranch(data)}/>
                )}

                {isOpen && (
                    <CustomDialog
                        closeDialog={() => this.setState({isOpen: false, isAdd: false, isEdit: false, errors: {}})}
                        isNoteOpen={isOpen}>
                        {isAdd && (
                            <ServiceForm
                                errors={errors}
                                initialValues={''}
                                branches={branches}
                                handleClose={() => this.setState({isOpen: false, isAdd: false, errors: {}})}
                                getFormValue={data => this.handleSubmit(data)}/>
                        )}
                        {isEdit && (
                            <ServiceForm
                                errors={errors}
                                initialValues={service}
                                branches={branches}
                                handleClose={() => this.setState({isOpen: false, isEdit: false, errors: {}})}
                                getFormValue={data => this.updateBranch(data)}/>
                        )}
                    </CustomDialog>
                )}
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}

                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={() => this.setState({alertOpen: false})}/>
                )}
            </RootElement>

        )
    }
}

const mapStateToProps = state => {
    const {user} = state;
    return {user};
}
Service = withRouter(Service);
Service = withStyles(styles)(Service);
export default connect(mapStateToProps)(Service)
