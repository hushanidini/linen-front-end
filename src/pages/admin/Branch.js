import React ,{Component} from 'react';
import {withStyles} from "@material-ui/core";
import RootElement from "./component/RootElement";
import {deleteBranch, getAllBranches, saveBranches, updateBranches} from "../../services/private/BranchService";
import BranchTable from "../../components/tables/BranchTable";
import CustomDialog from "../../components/core/CustomDialog";
import {cloneDeep, findIndex, isEmpty} from "lodash";
import BranchForm from "../../components/forms/BranchForm";
import CustomLoader from "../../components/CustomLoader";
import Swal from 'sweetalert2';
import AlertBar from "../../components/core/Alert/AlertBar";
import SearchInput from "../../components/core/style/SearchInput";


const styles = theme => ({
    head:{
        display: 'flex',
        justifyContent: 'space-between',
        paddingBottom:'12px'
    },
    searchContainer:{
            float: 'right',
            padding: '0px 0px  6px  6px',
            marginTop: '8px',
            marginRight: '16px',
            background:'#ddd',
            fontSize: '17px',
            border: 'none',
            cursor: 'pointer'
    },
    searchButton:{
        float: 'right',
        padding: '6px 10px',
        marginTop: '8px',
        marginRight: '16px',
        background:'#ddd',
        fontSize: '17px',
        border: 'none',
        cursor: 'pointer'
    },
    searchInput:{
        padding: '6px',
        marginTop: '8px',
        fontSize: '17px',
        border: 'none'
    }
});


class Branch extends Component {
    constructor(props) {
        super(props);
        this.originalBranches = [];
        this.state = {
            branches:[],
            branch:{},
            isLoading:false,
            tableHeader:[
                {
                    align: 'left',
                    key:'name',
                    label: 'Branch name'
                },
                {
                    align: 'left',
                    key:'email',
                    label: 'Email'
                },
                {
                    align: 'left',
                    key:'address',
                    label: 'Address'
                },
                {
                    align: 'left',
                    key:'phone',
                    label: 'phone'
                },
                {
                    align: 'center',
                    key:'action',
                    label: 'Action'
                }
            ],
            isOpen:false,
            isEdit:false,
            isAdd:false,
            responseError:[],
            alertOpen:false,
            alertMessage:'',
            alertType:'',
            errors:{},
        }
    }

    componentDidMount = async ()=>{
        this.setState({isLoading: true});
        try{
            const branches = await getAllBranches();
            this.originalBranches = cloneDeep(branches.data);
            this.setState({branches: branches.data , isLoading: false})
        }catch(e){
            this.setState({isLoading: false});
        }

    }

    handleSubmit= async data=>{
        const branch={
            ...data,
            status:true,
        }
        this.setState({isLoading: true ,errors:{}})
        try {
            const branchResponse = await saveBranches(branch);
            this.originalBranches = cloneDeep( [...this.state.branches , branchResponse.data] );
            this.setState(state =>{
                return {branches: [...state.branches , branchResponse.data] ,
                        isLoading: false,isOpen:false,isAdd: false,
                        alertOpen:true,
                        alertMessage:branchResponse.message,
                        alertType:'success'
                }});
        }catch(e) {
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

    updateBranch= async data=>{
        const branchData={
            ...data,
            status:1,
        }
        const {branches , branch} = this.state;
        this.setState({isLoading: true ,errors:{}})
        try {
            const branchResponse = await updateBranches(branch.id ,branchData);
            const index = findIndex(branches ,{id:branch.id});
            branches[index] = branchData;
            this.originalBranches = cloneDeep( branches );
            this.setState(state =>{
                return {isEdit:false ,
                        branches,
                        isLoading: false,
                        isOpen:false,
                        alertOpen:true,
                        alertMessage:branchResponse.message,
                        alertType:'success'
                }});
        }catch(e) {
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

    deleteBranch = async data=>{
        const {branches}=this.state;
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
            try {
                const response = await deleteBranch(data.id);
                const removedBranches =branches.filter(item => item.id !== data.id);
                this.originalBranches = cloneDeep( removedBranches );

                this.setState({branches:removedBranches,
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

    openUpdateForm=(branch)=>{
        this.setState({isOpen:true,isEdit: true,branch ,errors:{}});
    }

    searchBranch=(value)=>{
        let filterBranch = cloneDeep(this.originalBranches);
        if(value.length !== 0){
            this.setState({
                branches:this.originalBranches.filter(branch=>
                                            branch.name.toLowerCase().includes(value.toLowerCase())
                                                ||
                                            branch.email.toLowerCase().includes(value.toLowerCase()))
            })
        }else{
            this.setState({branches:filterBranch})
        }
    }

    changeStatus =async branch=>{
        const branchData={
            status:!branch.status,
        }
        const {branches } = this.state;
        this.setState({isLoading: true})
        try {
            const branchResponse = await updateBranches(branch.id ,branchData);
            const index = findIndex(branches ,{id:branch.id});
            branches[index] = branchResponse.data;
            this.originalBranches = cloneDeep( branches );
            this.setState(state =>{
                return {isEdit:false ,
                    branches,
                    isLoading: false,
                    isOpen:false,
                    alertOpen:true,
                    alertMessage:branchResponse.message,
                    alertType:'success'
                }});
        }catch(err) {
            this.setState({isLoading: false,
                alertOpen:true,
                alertMessage:'Something went wrong!',
                alertType:'error'
            });
        }
    }

    render() {
        const emptyBranch = {
            name:null,
            email:null,
            address:null,
            phone:null
        };
        const {classes} = this.props;
        const {tableHeader ,branches ,isOpen,isAdd,isEdit,
            branch,
            isLoading,
            alertOpen,
            alertMessage,
            errors,
            alertType} = this.state;
        return (
            <RootElement>
                {alertOpen && (
                    <AlertBar alertMessage={alertMessage}
                              alertType={alertType}
                              onClose={()=>this.setState({alertOpen:false})}/>
                )}

                <div className={classes.head}>
                    <div style={{marginTop: '20px', width: '200px'}}>
                        <SearchInput
                            onChangeSearch={value => this.searchBranch(value)}
                            onClickSearch={value => this.searchBranch(value)}
                        />
                    </div>
                    <div >
                        <button className="btn btn-success" onClick={()=>this.setState({isOpen: true ,isAdd: true ,errors:{}})}>Add</button>
                    </div>
                </div>
                {!isEmpty(branches) && (
                    <BranchTable header={tableHeader}
                                 branches={branches}
                                 goToDetails={data=>this.props.history.push('branch/details/'+data.id)}
                                 changeStatus={data=>this.changeStatus(data)}
                                 openUpdateForm={data=>this.openUpdateForm(data)}
                                 handleDelete={data=>this.deleteBranch(data)}
                    />
                )}

                {isOpen && (
                    <CustomDialog closeDialog={()=>this.setState({isOpen: false ,isAdd: false ,isEdit: false ,errors:{}})}
                                  isNoteOpen = {isOpen}>
                        {isAdd && (
                            <BranchForm
                                errors={errors}
                                initialValues={emptyBranch}
                                handleClose={()=>this.setState({isOpen: false , isAdd: false,errors:{}})}
                                getFormValue={data=>this.handleSubmit(data)}/>
                        )}
                        {isEdit && (
                            <BranchForm
                                errors={errors}
                                initialValues={branch}
                                handleClose={()=>this.setState({isOpen: false , isEdit: false,errors:{}})}
                                getFormValue={data=>this.updateBranch(data)}/>
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

export default withStyles(styles)(Branch);
