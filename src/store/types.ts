import { Patch, WithId } from 'ggtu-timetable-api-client';
import { KeyedTimetable } from '@/store/index';

export interface RootState {
  user: {
    type: string,
    entityId: number
  },
  timetable: {
    default: KeyedTimetable,
    hasLoaded: boolean,
    patches: Patch[]
  }
}

export interface NamedEntity {
  id?: number;
  name: string;
}

export type NamedEntityDict = Record<number | string, WithId<NamedEntity>>;
