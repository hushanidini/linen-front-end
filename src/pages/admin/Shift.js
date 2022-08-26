import React, {Component} from 'react';
import RootElement from "./component/RootElement";
import {withStyles} from "@material-ui/core";
import AlertBar from "../../components/core/Alert/AlertBar";
import CustomDialog from "../../components/core/CustomDialog";
import CustomLoader from "../../components/CustomLoader";
import {addNewShift, deleteShift, getAllShifts, updateShift} from "../../services/private/ShiftService";
import {getAllServices} from "../../services/private/ServicesService";
import ShiftForm from "../../components/forms/ShiftForm";
import {cloneDeep, findIndex, isEmpty} from "lodash";
import ShiftTable from "../../components/tables/ShiftTable";
import InputSelect from "../../components/core/InputSelect/InputSelect";
import Swal from "sweetalert2";
import SearchInput from "../../components/core/style/SearchInput";

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
        background: '#ddd',
        fontSize: '17px',
        border: 'none',
        cursor: 'pointer'
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

class Shift extends Component {

    constructor(props) {
        super(props);
        this.originalShifts = [];
        this.state = {
            services: [],
            service: {},
            shifts: [],
            shift: {},
            isLoading: false,
            errors : {},
            tableHeader: [
                {
                    align: 'left',
                    key: 'name',
                    label: 'Shift name'
                },
                {
                    align: 'left',
                    key: 'service-name',
                    label: 'Service name'
                },
                {
                    align: 'left',
                    key: 'day',
                    label: 'Day'
                },
                {
                    align: 'right',
                    key:'price',
                    label: 'Price'
                },
                {
                    align: 'right',
                    key:'actual_price',
                    label: 'Actual price'
                },
                {
                    align: 'left',
                    key: 'start_time',
                    label: 'Start time'
                },
                {
                    align: 'left',
                    key: 'end_time',
                    label: 'End time'
                },
                {
                    align: 'left',
                    key: 'status',
                    label: 'status'
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
            alertType: ''
        }
    }

    componentDidMount = async () => {
        this.setState({isLoading: true})
        const services = await getAllServices();
        const shifts = await getAllShifts();
        this.originalShifts = shifts.data;
        this.setState({
            services: services.data.map(service => ({
                label: service.name,
                value: service.id
            })),
            serviceDetails:services.data,
            shifts: shifts.data,
            isLoading: false,
        });
    }

    searchShift = event => {

    }

    handleSubmit = async data => {
        const {serviceDetails}=this.state;

        this.setState({isLoading: true ,errors:{}});
        try{
            const shiftResponse = await addNewShift(data);
            const shiftData =  {
                ...shiftResponse.data,
                status:true,
                service:serviceDetails.filter(i=>shiftResponse.data.service_id===i.id)[0]
            }
            this.setState({
                isLoading: false,
                isOpen:false,
                isNew:false,
                shifts:[...this.state.shifts , shiftData],
                alertOpen:true,
                alertMessage:shiftResponse.message,
                alertType:'success'
            });
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

    openUpdateForm = data => {
            this.setState({shift:data , isNew:false ,isOpen:true , isEdit:true ,errors:{}});
    }

    updateShift = async data => {
        const {serviceDetails , shift , shifts}=this.state;

        this.setState({isLoading: true ,errors:{}});
        try{
            const shiftResponse = await updateShift(shift.id , data);
            const index = findIndex(shifts , {id:shift.id});
            let updatedShifts=shifts;
            if (index !== -1){
                const shiftData =  {
                    ...shiftResponse.data,
                    status:true,
                    service:serviceDetails.filter(i=>shiftResponse.data.service_id===i.id)[0]
                }
                updatedShifts[index]=shiftData;
            }

            this.setState({
                isLoading: false,
                isOpen:false,
                isEdit:false,
                shifts:updatedShifts,
                alertOpen:true,
                alertMessage:shiftResponse.message,
                alertType:'success'
            });
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

    deleteShift =async data => {
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
            try{
                const response = await deleteShift(data.id);
                this.setState({
                    shifts:this.state.shifts.filter(item => item.id !== data.id),
                    alertOpen:true,
                    alertMessage:response.message,
                    alertType:'success'
                });
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

    selectByService = (value) => {
        let filterShifts = cloneDeep(this.originalShifts);
        if (value !== 'default') {
            this.setState({
                shifts: this.originalShifts.filter(item => item.service_id === Number(value))
            });
        } else {
            this.setState({
                shifts: filterShifts
            });
        }

    }

    render() {
        const {classes} = this.props;
        const {
            tableHeader,
            isOpen, isAdd, isEdit,
            isLoading,
            alertOpen,
            alertMessage,
            alertType,
            services,
            shifts,
            shift,
            errors
        } = this.state;
        return (
            <RootElement>
                <div className={classes.head}>
                    <div style={{marginTop: '20px', width: '200px'}}>
                        <SearchInput
                            onChangeSearch={value => this.searchShift(value)}
                            onClickSearch={value => this.searchShift(value)}
                        />
                    </div>

                    <div style={{marginTop: '20px', width: '200px'}}>
                        {!isEmpty(services) && (
                            <InputSelect
                                options={services}
                                placeholder={'Select all'}
                                isLabel={false}
                                getValue={value => this.selectByService(value)}
                            />
                        )}
                    </div>
                    <div>
                        <button className="btn btn-success"
                                onClick={() => this.setState({isOpen: true, isAdd: true})}>Add
                        </button>
                    </div>
                </div>
                {!isEmpty(shifts) && (
                    <ShiftTable shifts={shifts}
                                header={tableHeader}
                                openUpdateForm={data => this.openUpdateForm(data)}
                                handleDelete={data => this.deleteShift(data)}/>
                )}


                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={() => this.setState({alertOpen: false})}/>
                )}
                {isOpen && (
                    <CustomDialog closeDialog={() => this.setState({isOpen: false, isAdd: false, isEdit: false ,errors:{}})}
                                  isNoteOpen={isOpen}>
                        {isAdd && (
                            <ShiftForm
                                initialValues={''}
                                errors={errors}
                                services={services}
                                handleClose={() => this.setState({isOpen: false, isAdd: false ,errors:{}})}
                                getFormValue={data => this.handleSubmit(data)}/>
                        )}
                        {isEdit && (
                            <ShiftForm
                                initialValues={shift}
                                errors={errors}
                                services={services}
                                handleClose={() => this.setState({isOpen: false, isEdit: false ,errors:{}})}
                                getFormValue={data => this.updateShift(data)}/>
                        )}
                    </CustomDialog>
                )}
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
            </RootElement>
        )
    }
}

export default withStyles(styles)(Shift);
