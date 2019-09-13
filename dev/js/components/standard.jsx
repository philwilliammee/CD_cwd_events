import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {
    getTruncDesc,
    getTypeIds,
    getEventTime,
    getEventType,
    getMonthHeader,
    getDisplayDate,
} from '../helpers/displayEvent';
import EventFilters from './filter';
import AddCal from './addCal'
import buildEventWrapperFilters from '../helpers/buildEventWrapperFilters';
import {
    EventTitle,
    EventDate,
    EventLocation,
    EventThumbnail,
    EventDescription,
    EventTypes,
} from './partials';

const StandardInner = props => {
    const {
        event,
        filterby,
        addcal,
        excerptlength,
        thumbnail,
        innerClass} = props;

    return (
        <div className={`views-row ${innerClass}`}>
            <div className="event-node node">
                <div className="field title">
                    <EventTitle title={event.title} url={event.localist_url} />
                </div>
                <EventLocation locationName={event.location_name} />
                <div>
                    <EventDate date={getEventTime(event)} />
                    <EventTypes eventTypes={getEventType(event, filterby)} />
                </div>
                <EventThumbnail
                    photoUrl={event.photo_url}
                    title={event.title}
                    thumbnail={thumbnail}
                    photoCrop='big'
                />
                <EventDescription
                    description={getTruncDesc(event, excerptlength)}
                    title = {event.title}
                />
                {
                    addcal === 'true'
                        ? <AddCal event={event} />
                        : ''
                }
            </div>
        </div>
    )
}

StandardInner.propTypes = {
    event: PropTypes.object,
    filterby: PropTypes.string.isRequired,
    addcal: PropTypes.string.isRequired,
    excerptlength: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    innerClass: PropTypes.string,
};

StandardInner.defaultProps = {
    event: {},
    innerClass: '',
};

const Standard = (props) => {
    const {
        events,
        filterby,
        usefilterby,
        addcal,
        excerptlength,
        thumbnail} = props;
    const [filterEvents, handleEventFilter] = useState(events);
    const filterObjs = buildEventWrapperFilters(events, filterby);
    const thumbNailClass = (thumbnail === 'false') ? 'no-thumbnails' : '';
    let lastMonth = '';
    let lastDay = '';

    const applyFilter = obj => {
        if (obj.name === 'filterAll'){
            handleEventFilter(events);
        } else {
            const filters = events.filter( event => {
                if (getTypeIds(event.event).includes(obj.id)){
                    return event;
                }
            })
            handleEventFilter(filters);
        }
    }

    const getMonth = event => {
        const month = getMonthHeader(event);
        if (lastMonth !== month) {
            lastMonth = month;
            return (
                <h3 className="month-header">{month}</h3>
            )
        }
        return '';
    }

    const getDay = (event, filterby) => {
        const displayDate = getDisplayDate(event, filterby);
        if (lastDay !== displayDate) {
            lastDay = displayDate;
            return (
                <h4 className="day-header">
                    <span className="fa fa-calendar-o"></span>
                    {displayDate}
                </h4>
            )
        }
        return '';
    }

    return (
        <section className="standard" id="eventStandard" title="Events List">
            <div className="main-body">
                <div className={`events-listing ${thumbNailClass}`}>
                    { usefilterby === 'true'
                        ? <EventFilters
                            filterObjs={filterObjs}
                            applyFilter={applyFilter}
                        />
                        : ''}
                    <div className="events-list">
                        { filterEvents.length > 0
                            ? filterEvents.map( event => {
                                return (
                                    <div key={event.event.id}>
                                        { getMonth(event.event) }
                                        { getDay(event.event, filterby) }
                                        <StandardInner
                                            event={event.event}
                                            filterby={filterby}
                                            addcal={addcal}
                                            excerptlength={excerptlength}
                                            thumbnail={thumbnail}
                                        />
                                    </div>
                                )})
                            : <p>There are no upcomming events.</p>}
                    </div>
                </div>
            </div>
        </section>
    );
}

Standard.propTypes = {
    events: PropTypes.array,
    filterby: PropTypes.string.isRequired,
    usefilterby: PropTypes.string,
    addcal: PropTypes.string,
    excerptlength: PropTypes.string,
    thumbnail: PropTypes.string,
};

Standard.defaultProps = {
    events: [],
    usefilterby: 'true',
    addcal: 'true',
    excerptlength: '250',
    thumbnail: 'true',
};

export default Standard;
