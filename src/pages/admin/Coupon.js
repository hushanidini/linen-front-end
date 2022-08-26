import React, {Component} from 'react';
import RootElement from "./component/RootElement";
import {addCoupon, deleteCoupon, getCoupons, updateCoupon} from "../../services/private/CouponService";
import CouponTable from "../../components/tables/CouponTable";
import {withStyles} from "@material-ui/core";
import CustomDialog from "../../components/core/CustomDialog";
import CustomLoader from "../../components/CustomLoader";
import AlertBar from "../../components/core/Alert/AlertBar";
import CouponForm from "../../components/forms/CouponForm";
import {findIndex, isEmpty} from 'lodash';
import Swal from "sweetalert2";
import {getAllBranches} from "../../services/private/BranchService";
import {getAllServices} from "../../services/private/ServicesService";
import SearchInput from "../../components/core/style/SearchInput";
import {searchUser} from "../../services/private/UserService";
import {fetchMemberships} from "../../services/private/MemberShipService";


class Coupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isOpen: false,
            isAdd: false,
            isEdit: false,
            coupons: [],
            coupon: {},
            errors: {},
            tableHeader: [
                {
                    align: 'left',
                    key: 'title',
                    label: 'Title'
                },
                {
                    align: 'left',
                    key: 'code',
                    label: 'code'
                },
                {
                    align: 'left',
                    key: 'off_percentage',
                    label: 'Off percentage'
                },
                {
                    align: 'left',
                    key: 'start',
                    label: 'Activations start'
                },
                {
                    align: 'left',
                    key: 'end',
                    label: 'Expire at'
                },
                {
                    align: 'left',
                    key: 'max_no_use',
                    label: 'Maximum number of use'
                },
                {
                    align: 'left',
                    key: 'no_of_used',
                    label: 'No of used'
                },
                {
                    align: 'center',
                    key: 'end',
                    label: 'Action '
                }
            ],
            services: [],
            users: [],
            branches: [],
            memberships: []

        }
    }

    componentDidMount = async () => {
        this.setState({isLoading: true});

        try {
            const couponsResponse = await getCoupons();
            const branchResponse = await getAllBranches();
            const servicesResponse = await getAllServices();
            const membershipsResponse = await fetchMemberships();
            this.setState({
                isLoading: false,
                branches: branchResponse.data,
                services: servicesResponse.data,
                coupons: couponsResponse.data,
                memberships: membershipsResponse.data,
            });

        } catch (e) {
            this.setState({isLoading: false});
        }
    }

    deleteCoupon = async coupon => {
        const {coupons} = this.state;
        const swal = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to delete it.',
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
                await deleteCoupon(coupon.id,);
                const index = findIndex(coupons, {id: coupon.id});
                coupons.splice(index, 1);
                this.setState({
                    isLoading: false,
                    isOpen: false,
                    isAdd: false,
                    coupons
                })
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
    }

    changeStatus = async coupon => {
        const {coupons} = this.state;
        const swal = await Swal.fire({
            title: 'Are you sure?',
            text: 'You want to change status.',
            icon: 'success',
            showCloseButton: true,
            showCancelButton: true,
            reverseButtons: true,
            cancelButtonText: `Cancel`,
            confirmButtonText: `Change`,
            confirmButtonColor: '#ff5252'
        });
        if (swal.value) {
            try {
                const response = await updateCoupon(coupon.id, {status: !coupon.status});
                const index = findIndex(coupons, {id: coupon.id});
                coupons[index] = response.data;
                this.setState({
                    isLoading: false,
                    isOpen: false,
                    isAdd: false,
                    coupons
                })
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
    }

    handleSubmit = async coupon => {
        this.setState({isLoading: true});
        try {
            const response = await addCoupon({...coupon, status: true});
            this.setState({
                isLoading: false,
                isOpen: false,
                isAdd: false,
                coupons: [...this.state.coupons, response.data],
                alertOpen: true,
                alertMessage: response.message,
                alertType: 'success'
            })
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

    handleUpdate = async couponData => {
        this.setState({isLoading: true});
        const {coupon, coupons} = this.state;
        try {
            const response = await updateCoupon(coupon.id, couponData);
            const index = findIndex(coupons, {id: coupon.id});
            coupons[index] = response.data;
            this.setState({
                isLoading: false,
                isOpen: false,
                isEdit: false,
                isAdd: false,
                coupons
            })
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

    formatForMultipleSelect = dataSet => {
        return dataSet.map(data => ({
            name: data.name,
            id: data.id
        }));
    }

    searchCoupon = dataSet => {

    }

    searchUsers = async name => {
        this.setState({isLoading: true});
        try {
            const response = await searchUser({name});
            this.setState({
                users: response.data.map(user => ({name: user.firstname + ' ' + user.lastname, id: user.id})),
                isLoading: false,
                alertOpen: true,
                alertMessage: isEmpty(response.data) ? "No users" : "Loaded users",
                alertType: 'success'
            });
        } catch (e) {
            this.setState({isLoading: false});
        }
    }

    render() {
        const {
            coupons, coupon,
            tableHeader,
            isOpen,
            isAdd,
            isEdit,
            isLoading,
            alertOpen,
            alertMessage,
            errors,
            alertType,
            branches,
            services,
            users,
            memberships,
        } = this.state;
        const {classes} = this.props;
        return (
            <RootElement>
                <div className={classes.head}>
                    <div style={{marginTop: '20px', width: '200px'}}>
                        <SearchInput
                            onChangeSearch={value => this.searchCoupon(value)}
                        />
                    </div>
                    <div>
                        <button className="btn btn-success"
                                onClick={() => this.setState({isOpen: true, isAdd: true, errors: {}})}>Add
                        </button>
                    </div>
                </div>
                <CouponTable coupons={coupons}
                             header={tableHeader}
                             openUpdateForm={(coupon) => this.setState({coupon, isOpen: true, isEdit: true})}
                             handleDelete={(coupon) => this.deleteCoupon(coupon)}
                             changeStatus={(coupon) => this.changeStatus(coupon)}
                />

                {isOpen && (
                    <CustomDialog
                        closeDialog={() => this.setState({isOpen: false, isAdd: false, isEdit: false, errors: {}})}
                        isNoteOpen={isOpen}>
                        {isAdd && (
                            <CouponForm
                                users={users}
                                memberships={this.formatForMultipleSelect(memberships)}
                                searchValue={val => this.searchUsers(val)}
                                branches={this.formatForMultipleSelect(branches)}
                                services={this.formatForMultipleSelect(services)}
                                initialValues={{}}
                                errors={errors}
                                handleClose={() => this.setState({isOpen: false, isAdd: false, errors: {}})}
                                getFormValue={data => this.handleSubmit(data)}/>

                        )}
                        {isEdit && (
                            <CouponForm
                                users={users}
                                memberships={this.formatForMultipleSelect(memberships)}
                                searchValue={val => this.searchUsers(val)}
                                branches={this.formatForMultipleSelect(branches)}
                                services={this.formatForMultipleSelect(services)}
                                initialValues={coupon}
                                errors={errors}
                                handleClose={() => this.setState({isOpen: false, isAdd: false, errors: {}})}
                                getFormValue={data => this.handleUpdate(data)}/>
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
        );
    }
}

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

Coupon = withStyles(styles)(Coupon);
export default Coupon;
