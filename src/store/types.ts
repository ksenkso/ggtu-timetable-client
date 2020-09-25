import { WithId } from 'ggtu-timetable-api-client';

export interface NamedEntity {
  id?: number;
  name: string;
}

export type NamedEntityDict = Record<number | string, WithId<NamedEntity>>;
