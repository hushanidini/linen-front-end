import React from 'react'
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from "@fullcalendar/interaction";

import moment from "moment";
import Moment from "react-moment";

import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

function renderEventContent(eventInfo) {
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
            <b onClick={() => console.log(eventInfo.event._def.extendedProps)}>
                <Moment format={'hh:mm:A'}>{eventInfo.event._def.extendedProps.slot}</Moment></b>
            {/*<i onClick={() => console.log(eventInfo.event._def.extendedProps.branch_id)}>{eventInfo.event.title}</i>*/}
        </div>
    )
}

const CustomCalendar = ({data , dateChange}) => {


    const handleDateClick = (arg) => {
        console.log(arg.dateStr , data);
    }
    const getCalendarData =(fetchInfo, successCallback, failureCallback) => {
        try{
            // let year = new Date().getFullYear();
            // let month = new Date().getMonth() + 1;

            dateChange(moment(fetchInfo.startStr ).format('YYYY-MM-DD HH:mm:ss') ,moment(fetchInfo.endStr ).format('YYYY-MM-DD HH:mm:ss'));
            successCallback(data);
        }catch (e) {

        }
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin ,listPlugin ,timeGridPlugin]}
            initialView="dayGridMonth"
            navLinks={false}
            dayMaxEventRows={22}
            // dayMaxEvents={true}
            dateClick={(val) => handleDateClick(val)}
            eventContent={renderEventContent}
            buttonText={
                {today: 'Today', dayGridMonth: 'Month'}
            }
            // events={(event)=>console.log(event)}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            }}
            // contentHeight={600}
            eventOrder={'none'}
            events={
                (fetchInfo, successCallback, failureCallback) => getCalendarData(fetchInfo, successCallback, failureCallback)
            }

            eventClick={(e) => console.log(e)}
            forceEventDuration={true}
            eventTimeFormat={{
                hour: 'numeric',
                minute: 'numeric'
            }}
            titleFormat={{
                day: '2-digit', month: 'long'
            }}
            slotLabelFormat={{
                hour: '2-digit', minute: '2-digit'
            }}
            columnHeaderFormat={{
                weekday: 'short', day: 'numeric', omitCommas: true
            }}
            allDaySlot={false}
        />
    )
}
export default CustomCalendar;

//https://fullcalendar.io/demo-events.json?overload-day=&start=2021-02-28T00:00:00Z&end=2021-04-11T00:00:00Z&timeZone=UTC
// events: 'https://fullcalendar.io/demo-events.json?overload-day'
//2021-03-01
