import React, {Component} from 'react';
import './style/component.css'
import CalendarSlot from "../components/CalendarSlot";
import moment from 'moment';
import {
    bookingSchedule,
    getAllDiscounts, getAllHoliDays,
    getAllSchedule,
    removeReservedSlot,
    reserveSlot,
    userRegister
} from '../services/ScheduleService';
import {chain, isEmpty, isEqual} from 'lodash';
import Cart from "../components/Cart";
import UserForm from "../components/UserForm";
import InstaGallery from "../components/InstaGallery";
import Swal from 'sweetalert2';
import '../../node_modules/animate.css';
import {getAllStudios} from "../services/RoomService";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import CustomLoader from "../components/CustomLoader";
import {withStyles} from "@material-ui/core";
import CustomDialog from "../components/core/CustomDialog";
import FacilitiesTables from "../components/tables/FacilitiesTables";
import {getAllBranches} from "../services/BranchService";


const styles = theme => ({
    subBar: {
        display: "flex",
        direction: "row",
        justifyContent: "space-between",
        marginTop:'12px'
    },
});

class Studios extends Component {

    constructor(props) {
        super(props);
        this.state = {
            header: [],
            timeSchedule: [],
            bookedSchedule: [],
            cartHeader: ['#', 'Date', 'Room', 'Time Slot', 'Price', 'Action'],
            isOpenForm: false,
            instaFeed: [],
            date: moment(),
            allStudios:[],
            studios: [],
            studio: {},
            busySlots: [],
            isLoading: false,
            holiday: [],
            openClose: [],
            locallyAddedSlots: [],
            allDiscounts: [],
            holiDays:[],
            isOpen: false,
            branches :[],
            branch:{}
        }
        // Activate the event listener
        this.setupBeforeUnloadListener();
    }

    componentDidMount = async () => {
        const {date} = this.state;
        this.setState({isLoading: true});

        const holiDays = await getAllHoliDays(1, {date:moment(date).format('YYYY-MM-DD')});
        try {
            const allStudios = await getAllStudios(1);
            const allDiscounts = await getAllDiscounts();
            const branches = await getAllBranches();
            const studiosByBranch= allStudios.filter(studio=>studio.branch_id === branches[0].id);
            this.setState(state => {
                return {studios: studiosByBranch,
                    allStudios,
                    allDiscounts: allDiscounts , studio:studiosByBranch[0] , holiDays ,
                        branches ,branch:branches[0]}
            },()=>this.weekFormat(moment(date).format('YYYY-MM-DD')));
        } catch (err) {
            alert('Something went wrong');
            this.setState({isLoading: false})
        }
    }

    mapWithHolyDays =async (timeSchedule)=>{
        const {date ,studio} = this.state;
        const holiDays = await getAllHoliDays(studio.id, {date:moment(date).format('YYYY-MM-DD')});
        let timeScheduleWithHolyDays=[];
    //    there is 2 type of holiday
    //        01.full day
    //        02.open close
                timeSchedule.forEach(item=>{
                    const withHoliDay = item.map(row=>({
                        ...row,
                        status:holiDays.map(holiday =>{
                            if(moment(row.dateWithTime ,'YYYY-MM-DD' ).isSame(moment(holiday.date , 'YYYY-MM-DD'))){
                                const time = moment(moment(row.dateWithTime).format('HH:mm:ss' ) , 'HH:mm:ss' );
                                const startTime=moment(holiday.close_from , 'HH:mm:ss');
                                const endTime  =moment(holiday.close_to , 'HH:mm:ss');
                                const status = isEqual(holiday.type , 'fullDay')?
                                               'holidays'   :
                                    time.isBetween(startTime ,endTime ,undefined,'[)')?
                                                "holidays"  :row.status;
                                return status;
                            }else{
                                return row.status;
                            }
                        })
                    }));
                    withHoliDay.forEach((i ,index)=>{
                        const isHoliday=i.status.findIndex(sta=>sta === 'holidays');
                        const isBooked=i.status.findIndex(sta=>sta === 'booked');
                        const isBooking=i.status.findIndex(sta=>sta === 'booking');
                        if(isHoliday !== -1){
                            withHoliDay[index].status='holidays';
                        }else if(isBooked !== -1){
                                withHoliDay[index].status='booked';
                                }else if(isBooking !== -1){
                                    withHoliDay[index].status='booking';
                                }else{
                            withHoliDay[index].status='available';
                        }
                    })
                    timeScheduleWithHolyDays.push(withHoliDay);
                });
        await this.setState(state => {
            return {timeSchedule: timeScheduleWithHolyDays, isLoading: false}
        });
    }

    renderDiscount = (length, studio_id) => {
        const {allDiscounts} = this.state;
        const dis = allDiscounts.filter(item => (item.studio_id === studio_id && item.no_of_slot === length.toString()));
        if (isEmpty(dis[0])) return 1; else return dis[0].discount;
    }

    weekFormat = date => {
        let weekData = [];
        for (let i = 0; i < 7; i++) {
            weekData.push(moment(date).add(i, 'day').format('YYYY-MM-DD'))
        }
        this.setState(state => {
            return {header: weekData}
        }, () => this.dataWithTime())
    }

    changeDate = date => {
        this.setState({date: date, isLoading: true});
        this.weekFormat(moment(date).format('YYYY-MM-DD'));
    }

    dataWithTime = async () => {
        const {header, studio, locallyAddedSlots , date} = this.state;
        let dateWithTime = [];
        for (let i = 0; i < 12; i++) {
            const row = header.map((item, index) => ({
                dateWithTime: moment(item).add(i + 8, 'hour').format('YYYY-MM-DD HH:mm:ss'),
                status: 'available',
                studio_name: studio.name,
                studio_id: studio.id,
                tax: studio.tax,
                price: studio.price
            }));
            dateWithTime.push(row);
        }
        date.set({hour:0,minute:0,second:0,millisecond:0})
        const data={
            start_time: moment(date).format('YYYY-MM-DD HH:mm:ss'),
            end_time: moment(date).add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
        }
        let slots = await getAllSchedule(studio.id , data);
        const groupByDate = chain(slots).groupBy('slot').map((value ,key)=>({
            data:value,
            date:key
        })).value();
        let  filteredBusySlots =[]
        groupByDate.forEach(byDate =>{
            const bookedSlot = slots.filter(slot=>isEqual(byDate.date, slot.slot) && (byDate.data.length >= studio.max_reservation))
            filteredBusySlots.push(bookedSlot[0]);
        })

        locallyAddedSlots.forEach(localSlots => {
            filteredBusySlots.push(localSlots);
        })
        this.setState(state => {
            return {
                timeSchedule: dateWithTime,
                busySlots: filteredBusySlots.filter(item=>!isEmpty(item))
            }
        }, () => this.bookedSlotTimeMapping());
    }

    bookedSlotTimeMapping = async () => {
        let {timeSchedule, busySlots, locallyAddedSlots, studio} = this.state;
        let newColSchedule = [];
        if (locallyAddedSlots.length > 0) {
            locallyAddedSlots.forEach(localSlots => {
                busySlots.forEach(slot => {
                    timeSchedule.forEach(schedule => {
                        const XY = schedule.map((item, i) => ({
                            ...item,
                            date: moment(item.dateWithTime).format('YYYY-MM-DD'),
                            status: (isEqual(item.studio_id, localSlots.studio_id) && isEqual(localSlots.slot, item.dateWithTime)) ? 'booking' :
                                (isEqual(slot.slot, item.dateWithTime) &&
                                    item.status !== 'booked' &&
                                    item.status !== 'booking' &&
                                    isEqual(slot.studio_id, studio.id)) ? 'booked' : item.status
                        }));
                        newColSchedule.push(XY);
                    });
                    timeSchedule = newColSchedule;
                    newColSchedule = [];
                });
            })
        } else {
            busySlots.forEach(slot => {
                timeSchedule.forEach(schedule => {
                    const XY = schedule.map((item, i) => ({
                        ...item,
                        date: moment(item.dateWithTime).format('YYYY-MM-DD'),
                        status: (isEqual(slot.slot, item.dateWithTime) && item.status !== 'booked') ? 'booked' : item.status
                    }));
                    newColSchedule.push(XY);
                });
                timeSchedule = newColSchedule;
                newColSchedule = [];
            });
        }


        // await this.setState(state => {
        //     return {timeSchedule: timeSchedule, isLoading: false}
        // },()=>this.mapWithHolyDays());
        this.mapWithHolyDays(timeSchedule);
    }

    checkReservationSlot = async data => {
        const {studio} = this.state;
        const obj = {
            studio_id:studio.id,
            slot:data.dateWithTime
        }
        if (data.status === 'available'){
            try{
                await reserveSlot(obj);
            }catch (e){
                data.status = 'available';
                // this.addSchedule(data);
            }

        }
        if (data.status === "booking"){
            try{
                await removeReservedSlot(obj)
            }catch (e){
                data.status = 'booking';
                // this.addSchedule(data);
            }
        }

    }

    addSchedule = date => {
        this.setState({isLoading: true});
        this.checkReservationSlot(date);
        const {timeSchedule, studio, studios, locallyAddedSlots} = this.state;
        let dateWithTime = [];
        let localSlots = [];
        //add to local which slot booked.
        localSlots = locallyAddedSlots;
        localSlots.push({studio_id: studio.id, slot: date.dateWithTime});
        //reserved slot from calendar
        for (let i = 0; i < 12; i++) {
            const row = timeSchedule[i].map((item, index) => ({
                ...item,
                dateWithTime: item.dateWithTime,
                status: (item.status === 'available') ? ((item.dateWithTime === date.dateWithTime) ? 'booking' : item.status) : item.status
            }));
            dateWithTime.push(row);
        }
        const lData = localSlots.map((item, index) => ({
            ...item,
            date: moment(item.slot).format('YYYY-MM-DD'),
            studio: studios.filter(std => std.id === item.studio_id),
        }));
        //first group by studio
        const groupByStudios = chain(lData).groupBy('studio_id').map((value, key) => ({
            studio_id: key,
            data: value
        })).value();
        //second group by date
        let groupByDate = [];
        groupByStudios.forEach((stuGroup) => {
            const dateGroup = chain(stuGroup.data).groupBy('date').map((value, key) => ({
                date: key,
                data: value
            })).value();
            groupByDate.push(dateGroup);
        })

        Swal.fire({
            toast: true,
            position: 'top-right',
            icon: 'success',
            title: `Slot added to cart.`,
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
                // icon: '',

            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            width: 'auto',
            padding: '14px',

        });

        this.setState({
            timeSchedule: dateWithTime,
            bookedSchedule: groupByDate,
            locallyAddedSlots: localSlots,
            isLoading: false
        })
    }


    removeBookingSchedule = (date, studio_id) => {
        this.setState({isLoading: true})
        const {timeSchedule, locallyAddedSlots, studios, studio} = this.state;
        this.checkReservationSlot({studio_id:studio.id,dateWithTime:date , status : "booking"});
        let dateWithTime = [];
        let localSlots = [];
        //removed to local which slot booked.
        localSlots = locallyAddedSlots.filter(slot => !isEqual(slot, {studio_id: studio_id, slot: date}));

        for (let i = 0; i < 12; i++) {
            const row = timeSchedule[i].map((item, index) => ({
                ...item,
                dateWithTime: item.dateWithTime,
                status: (item.status === 'booking') ? ((item.dateWithTime === date) ? 'available' : item.status) : item.status
            }));
            dateWithTime.push(row);
        }

        //remove from local

        const lData = localSlots.map((item) => ({
            ...item,
            date: moment(item.slot).format('YYYY-MM-DD'),
            studio: studios.filter(std => std.id === item.studio_id),
        }));
        //first group by studio
        const groupByStudios = chain(lData).groupBy('studio_id').map((value, key) => ({
            studio_id: key,
            data: value
        })).value();
        //second group by date
        let groupByDate = [];
        groupByStudios.forEach((stuGroup) => {
            const dateGroup = chain(stuGroup.data).groupBy('date').map((value, key) => ({
                date: key,
                data: value
            })).value();
            groupByDate.push(dateGroup);
        });
        Swal.fire({
            toast: true,
            position: 'top-right',
            icon: 'success',
            title: `Slot removed from cart.`,
            showClass: {
                popup: 'animate__animated animate__fadeInDown',
                // icon: '',

            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp',
            },
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            width: 'auto',
            padding: '14px',

        });
        this.setState({
            timeSchedule: dateWithTime,
            bookedSchedule: groupByDate,
            locallyAddedSlots: localSlots,
            isLoading: false
        });
    }

    goToFinalStep = () => {
        this.setState({isOpenForm: true})
    }

    submitForm = async data => {
        const {bookedSchedule} = this.state;
        console.log(bookedSchedule);
        // return ;
        let schedule = [];
        bookedSchedule[0].forEach((scheduleData, i) => {
            scheduleData.data.forEach(item => {
                schedule.push(item.dateWithTime);
            });
        })
        try {
            await userRegister(data);
            let promises = [];
            if ((data.name && !isEmpty(schedule))) {
                const createPromises = schedule.map(async entry => {
                    return await bookingSchedule({schedule: entry, name: data.name});
                });
                promises = [...promises, ...createPromises];
            }
            await Promise.all(promises);
        } catch (e) {

        }

    }

    onChangeStudio = $event => {
        this.setState({isLoading: true})
        const {studios, date} = this.state;
        const studio = studios.filter(studio => studio.id === $event.target.value);
        //call schedule api too
        this.setState(state => {
            return {studio: studio[0]}
        }, () => this.weekFormat(moment(date).format('YYYY-MM-DD')));
    }
    onChangeBranch = $event => {
        this.setState({isLoading: true})
        const {allStudios, date,branches} = this.state;
        const branch = branches.filter(branch => branch.id === $event.target.value);
        const studios = allStudios.filter(std => std.branch_id === $event.target.value);
        if(!isEmpty(studios[0])){
            this.setState(state => {
                return {branch,
                    studios,
                    studio:studios[0]}
            }, () => this.weekFormat(moment(date).format('YYYY-MM-DD')));
        }
    }
    componentWillUnmount() {
        alert("componentWillUnmount");
    }
    // Things to do before unloading/closing the tab
    doSomethingBeforeUnload = () => {
        // Do something
        alert("doSomethingBeforeUnload");
    }

    // Setup the `beforeunload` event listener
    setupBeforeUnloadListener = () => {
        window.addEventListener("beforeunload", (ev) => {
            ev.preventDefault();
            return this.doSomethingBeforeUnload();
        });
    };

    render() {
        const {
            header,
            timeSchedule,
            bookedSchedule,
            cartHeader,
            isOpenForm,
            instaFeed,
            date,
            studios,
            studio,
            isLoading,
            isOpen,
            branches,
            branch
        } = this.state
        const {classes} =this.props;
        return (
            <div className="container">
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
                {isOpen && (
                    <CustomDialog
                        closeDialog={()=>this.setState({isOpen: false})}
                        isNoteOpen = {isOpen}>
                        <FacilitiesTables/>
                    </CustomDialog>
                )}

                <div className="booking-steps-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className=" col-md-4">
                                <div className="booking-step-wrapper date-time-step  active">
                                    <div className="icon"></div>
                                    <div className="text">
                                        <div className="big">Step 01</div>
                                        <div className="small">Date &amp; Start Time</div>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-md-4">
                                <div className="booking-step-wrapper details-step">
                                    <div className="icon"></div>
                                    <div className="text">
                                        <div className="big">Step 02</div>
                                        <div className="small">Details</div>
                                    </div>
                                </div>
                            </div>
                            <div className=" col-md-4">
                                <div className="booking-step-wrapper payment-step">
                                    <div className="icon"></div>
                                    <div className="text">
                                        <div className="big">Step 03</div>
                                        <div className="small">Payment</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {!isEmpty(bookedSchedule) && !isOpenForm && (
                    <Cart
                        header={cartHeader}
                        data={bookedSchedule}
                        getDiscount={(length, studio_id) => this.renderDiscount(length, studio_id)}
                        goToFinalStep={() => this.goToFinalStep()}
                        removeTimeSlot={(date, studio_id) => this.removeBookingSchedule(date, studio_id)}
                    >
                    </Cart>
                )}
                <div className={classes.subBar}>
                    <div style={{display: "flex",
                                direction: "row",
                                justifyContent: "space-between",}}>
                        <select id="inputState"
                                onChange={(event)=>this.onChangeBranch(event)}
                                className="form-control" style={{width: '180px' ,marginRight:'12px'}}>
                            {branches.map(br=>{
                                return <option selected={isEqual(branch , br)}
                                               value={br.id}
                                >{br.name}
                                </option>
                            })}
                        </select>

                        <select id="inputState"
                                onChange={(event)=>this.onChangeStudio(event)}
                                className="form-control" style={{width: '180px'}}>
                            {studios.map(stu=>{
                                return <option selected={isEqual(studio , stu)}
                                               value={stu.id}
                                >{stu.name}
                                </option>
                            })}
                        </select>
                    </div>

                    <div>
                        <button type="button" style={{margin: '4px'}}
                                onClick={()=>this.setState({isOpen:true})}
                                className="btn btn-success">Facilities</button>
                        <button type="button" style={{margin: '4px'}} className="btn btn-success">Go to Cart</button>
                    </div>
                </div>
                {!isOpenForm && (
                    <CalendarSlot header={header}
                                  studios={studios}
                                  selectedStudio={studio}
                                  timeSchedule={timeSchedule}
                                  // onChangeStudio={(data) => this.onChangeStudio(data)}
                                  changeDate={(date) => this.changeDate(date)}
                                  currentDate={moment(date).format('YYYY-MM-DD')}
                                  removeBookingSchedule={(date, studio_id) => this.removeBookingSchedule(date, studio_id)}
                                  addSchedule={(date) => this.addSchedule(date)}></CalendarSlot>
                )}

                {isOpenForm && (
                    <UserForm getFormValue={(data) => this.submitForm(data)}></UserForm>
                )}
                {!isEmpty(instaFeed) && (
                    <InstaGallery instaFeed={instaFeed.data}></InstaGallery>
                )}
            </div>
        );
    }
}

//{
//
//     "email": "vipi@gFromPostman",
//     "photographer_name": "vipi",
//     "name": "newUser",
//     "shoot_type": "shoot_type JSON body passed.",
//     "note": "note FromPostman body passed."
//
// }

export default withStyles(styles)(Studios);
