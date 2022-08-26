import React, {Component} from 'react';
import RootElement from "./component/RootElement";
import CustomCalendar from "../../components/CustomCalendar";
import {fetchBookedDataPrivate} from "../../services/private/BookingService";
import moment from "moment";
import {chain, cloneDeep, isEmpty} from "lodash";
import {withStyles} from "@material-ui/core";
import InputSelect from "../../components/core/InputSelect/InputSelect";
import {getAllServices} from "../../services/private/ServicesService";
import SearchInput from "../../components/core/style/SearchInput";
import CustomLoader from "../../components/CustomLoader";


const styles = theme => ({
    content:{
       minWidth:'1600px' ,
       overflow: 'auto' ,
       padding:theme.spacing(3),
   },
    header:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: '12px'

    }
});

class Booking extends Component {

    constructor(props) {
        super(props);
        this.originalBookedData=[];
        this.state = {
            bookedSlots: [],
            serviceId: 1,
            date:moment(),
            services:[],
            isLoading:false,
        }
    }

    componentDidMount = async () => {
        this.setState({isLoading:true});
        try {
            const data = {
                // service_id: this.state.serviceId,
                start_date: moment().subtract(1 ,'months').format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment().add(1, 'months').format('YYYY-MM-DD HH:mm:ss'),
            }
            const services = await getAllServices();
            const response = await fetchBookedDataPrivate(data)
            const groupBy=chain(response.data).groupBy('service_id').map((value, key) =>({
                service_id:key,
                data:value
            })).value();
            let merged=[];
            groupBy.forEach(item=>{
                item.data.forEach(data=>{
                    merged=[...merged , data];
                })
            })

            const bookedData = merged.map(data => ({
                ...data,
                title: data.status,
                start: data.slot,
            }));
            this.originalBookedData = bookedData;
            this.setState({bookedSlots: bookedData ,
                services: services.data.map(service => ({
                    label: service.name,
                    value: service.id,
                    isLoading:false
                })),
            })
        } catch (e) {
        }
    }

    selectByService = (value) => {
        let cloneOriginalBookedData = cloneDeep(this.originalBookedData);
        if (value !== 'default') {
            this.setState({bookedSlots:this.originalBookedData.filter(item=>item.service_id === value)});
        } else {
            this.setState({bookedSlots:cloneOriginalBookedData});
        }

    }

    dateChange=async (start, end) => {
        if(moment(start , 'YYYY-MM-DD HH:mm:ss').isSame(this.state.date,'YYYY-MM-DD HH:mm:ss')){
          return ;
        }
        // this.setState({isLoading:true});
        try {
            const data = {
                // service_id: this.state.serviceId,
                start_date: moment(start ,'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss'),
                end_date: moment(end ,'YYYY-MM-DD').format('YYYY-MM-DD HH:mm:ss'),
            }

            const response = await fetchBookedDataPrivate(data);
            const groupBy=chain(response.data).groupBy('service_id').map((value, key) =>({
                service_id:key,
                data:value
            })).value();
            let merged=[];
            groupBy.forEach(item=>{
                item.data.forEach(data=>{
                    merged=[...merged , data];
                })
            })
            const bookedData = merged.map(data => ({
                ...data,
                title: data.status,
                start: data.slot,
            }));
            this.originalBookedData = bookedData;
            this.setState({
                bookedSlots: bookedData,
                date:start,
                isLoading:false
            })
        } catch (e) {

        }
    }

    render() {
        const {classes} = this.props;
        const {bookedSlots ,services,
            isLoading} = this.state;
        return (
            <RootElement>
                <div className={classes.header}>

                    <div style={{marginTop: '20px', width: '200px'}}>
                        <SearchInput/>
                    </div>

                    <div style={{marginTop: '20px', width: '200px'}}>
                        {!isEmpty(services) && (
                            <InputSelect
                                options={services}
                                placeholder={'All services'}
                                isLabel={false}
                                getValue={value => this.selectByService(value)}
                            />
                        )}
                    </div>
                </div>
                <div className={classes.content}>
                    <CustomCalendar
                        dateChange={(startDate , endDate)=>this.dateChange(startDate , endDate)}
                        data={bookedSlots}/>
                    {/*<CalendarComponent data={bookedSlots}/>*/}
                </div>
                {isLoading && (
                    <CustomLoader isNoteOpen={true}/>
                )}
            </RootElement>
        )
    }

}
export default withStyles(styles)(Booking);
