import { Scheduler } from '@bryntum/scheduler-enterprise';

window.scheduler = new Scheduler({
    appendTo   : 'container',
    startDate  : new Date(2026, 9, 12),
    endDate    : new Date(2026, 9, 19),
    viewPreset : 'dayAndWeek',
    rowHeight  : 50,

    features : {
        scheduleContext  : { triggerEvent : 'hover' },
        scheduleTooltip  : false
    },

    columns : [{ text : 'Name', field : 'name', width : 200 }],

    project : {
        resources : [
            { id : 1, name : 'Ada' },
            { id : 2, name : 'Grace' },
            { id : 3, name : 'Linus' }
        ],
        events : []
    }
});
