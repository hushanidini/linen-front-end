import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick


// import "./styles.css";
//https://codesandbox.io/s/2z6wp2jozn?file=/src/DemoApp.jsx:380-462
// must manually import the stylesheets for each plugin
// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import Moment from "react-moment";
import listPlugin from "@fullcalendar/list";


export default class CalendarComponent extends React.Component {

    calendarComponentRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            calendarEvents: [
                // initial event data
                {title: "Event Now", start: new Date()}
            ]
        };
    }

    renderEventContent(eventInfo) {
        return (
            <div className="badge badge-primary"
                 style={{
                     display: 'flex',
                     justifyContent: 'space-around',
                     width: '65px',
                     padding: 4,
                     cursor: 'pointer',
                     backgroundColor: eventInfo.event._def.extendedProps.service.color
                 }}>
                <b onClick={() => console.log(eventInfo)}>
                    <Moment format={'hh:mm:A'}>{eventInfo.event._def.extendedProps.slot}</Moment></b>
                {/*<i onClick={() => console.log(eventInfo.event._def.extendedProps.branch_id)}>{eventInfo.event.title}</i>*/}
            </div>
        )
    }

    render() {
        return (
            <div className="demo-app-calendar">
                <FullCalendar
                    defaultView="dayGridMonth"
                    header={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                    }}
                    ref={this.calendarComponentRef}
                    weekends={this.state.calendarWeekends}
                    events={this.props.data}
                    dateClick={this.handleDateClick}
                    eventContent={this.renderEventContent}

                    plugins={[dayGridPlugin, interactionPlugin ,listPlugin ,timeGridPlugin]}
                    dayMaxEventRows={22}
                    // dayMaxEvents={true}
                    initialView="dayGridMonth"
                    buttonText={
                        {today: 'Today', dayGridMonth: 'Month'}
                    }
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,listWeek'
                    }}
                />
            </div>
        );
    }

    toggleWeekends = () => {
        this.setState({
            // update a property
            calendarWeekends: !this.state.calendarWeekends
        });
    };

    gotoPast = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    };

    handleDateClick = arg => {
        if (alert("Would you like to add an event to " + arg.dateStr + " ?")) {
            this.setState({
                // add new event data
                calendarEvents: this.state.calendarEvents.concat({
                    // creates a new array
                    title: "New Event",
                    start: arg.date,
                    allDay: arg.allDay
                })
            });
        }
    };
}
