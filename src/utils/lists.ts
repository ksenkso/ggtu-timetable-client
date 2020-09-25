import { Cabinet } from 'ggtu-timetable-api-client';
import { NamedEntity } from '@/store/types';

export interface SelectOption {
  name: string;
  value: number;
}

export const defaultEntityAdapter = (list: NamedEntity[]): SelectOption[] => {
  return list.map(entity => ({
    value: entity.id as number,
    name: entity.name
  }));
};

export const cabinetsAdapter = (cabinets: Cabinet[]) => {
  return cabinets.map(cabinet => ({
    value: cabinet.id,
    name: cabinet.building!.name + ' ' + cabinet.name
  }));
};
