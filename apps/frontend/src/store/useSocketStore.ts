import { ScheduleData } from '@/types';
import { defineStore } from 'pinia';

export const useScheduleStore = defineStore('schedule', {
    state: () => ({
        scheduleData: [] as ScheduleData[]
    }),
    actions: {
        setScheduleData(data: ScheduleData[]) {
            this.scheduleData = data;
        },
    },
});