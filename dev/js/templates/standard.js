import { eventFilters, add_calendar } from '../helpers/template-helpers';

/**
 * Tests to see if month / day should be displayed.
 */
class CheckDate {
    constructor() {
        this.lastMonth = '';
        this.lastDay = '';
    }

    month(builtData) {
        if (this.lastMonth !== builtData.month) {
            this.lastMonth = builtData.month;
            return /* html */ `
                <h3 class="month-header">${builtData.monthHeader}</h3>
            `;
        }
        return '';
    }

    day(builtData) {
        if (this.lastDay !== builtData.displayDate) {
            this.lastDay = builtData.displayDate;
            return /* html */ `
                <h4 class="day-header">
                    <span class="fa fa-calendar-o"></span
                    >${builtData.displayDate}
                </h4>
            `;
        }
        return '';
    }
}

const checkDate = new CheckDate();

/**
 *
 * @param {obj} builtData A buildEvents.js obj.
 * @return {string} Html string
 */
export const standardInner = builtData => /* html */ `
    ${checkDate.month(builtData)} ${checkDate.day(builtData)}
    <div
        class="event-node node dept-${builtData.department} type-${
    builtData.type
} group-${builtData.event.group_id || ''}"
    >
        <h3>
            <a target="_blank" href="${builtData.event.localist_url}"
                >${builtData.event.title}</a
            >
        </h3>
        ${
            builtData.event_time
                ? /* html */ `
                  <h4 class="meta date">
                      <span class="start">${builtData.event_time}</span>
                  </h4>
                `
                : ''
        }
        ${
            builtData.event.location_name
                ? /* html */ `
                  <h4 class="meta location">
                      ${builtData.event.location_name}
                  </h4>
                `
                : ''
        }
        ${
            builtData.event_types
                ? `<h4 class="meta type"><span class="fa"></span>${
                      builtData.event_types
                  }</h4>`
                : ''
        }
        <p class="description">
            ${builtData.description}
            <a
                class="read-more more"
                href="${builtData.event.localist_url}"
                target="_blank"
                > read more <span class="visually-hidden">
                    about ${builtData.event.title}</span
                ></a
            >
        </p>
        ${builtData.addCal ? `${add_calendar(builtData.event)}` : ''}
    </div>
    <!--end of node -->
`;

/**
 *
 * @param {string} inner The html inner string.
 * @param {obj} args Mostly unused try and remove these.
 * @return {string} Html string
 */
export const standardWrapper = (inner, args) => /* html */ `
    <section class="standard" id="eventStandard" title="${args.title}">
        ${args.heading ? `<h2>${args.heading}</h2>` : ''}
        <div class="main-body">
            <div class="events-listing no-thumbnails">
                ${eventFilters(args.filters, args.target)}
                <div class="events-list">
                    ${inner}
                </div>
            </div>
            <!--events listing -->
        </div>
        <!-- main-body -->
    </section>
    <!--end of section -->
`;
