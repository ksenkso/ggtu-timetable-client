import { TimetableEntry } from 'ggtu-timetable-api-client';
import { TimetableEntryType } from 'ggtu-timetable-api-client';

export interface EmptyTimetableEntry {
  id: number;
  type: TimetableEntryType;
}

export function fillTimetable(
  day: TimetableEntry[]
): (TimetableEntry | EmptyTimetableEntry)[] {
  day.sort((a, b) => a.index - b.index);
  const filled = [];
  let entryIndex = 0,
    lessonIndex = 0;
  while (entryIndex < day.length) {
    if (day[entryIndex].index > lessonIndex) {
      filled.push({
        id: Math.random(),
        type: TimetableEntryType.Empty
      });
    } else {
      filled.push(day[entryIndex]);
      entryIndex++;
    }
    lessonIndex++;
  }
  return filled;
}

export function timetableAdapter(timetable: TimetableEntry[][][]) {
  return timetable.map(week => week.map(day => fillTimetable(day)));
}
