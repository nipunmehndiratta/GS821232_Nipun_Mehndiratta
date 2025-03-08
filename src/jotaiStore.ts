import { atomWithStorage } from 'jotai/utils';
import { initialStores, initialSKUs, initialCalendar, initialPlanningData } from './utils/data';
import { StoreItem, SKUItem, CalendarItem, PlanningItem } from './types';

export const storeAtom = atomWithStorage<StoreItem[]>('storeAtom', initialStores);
export const skuAtom = atomWithStorage<SKUItem[]>('skuAtom', initialSKUs);
export const calendarAtom = atomWithStorage<CalendarItem[]>('calendarAtom', initialCalendar);
export const planningAtom = atomWithStorage<PlanningItem[]>('planningAtom', initialPlanningData);