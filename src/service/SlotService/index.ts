import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat); 

export const groupSlots = (slots: string[]): string[] => {
    if (slots.length === 0) return [];

    const timeFormat = 'HH:mm';

    const sorted = [...slots].sort((a, b) => { 
        const [aStart] = a.split(' - ');
        const [bStart] = b.split(' - ');
        return dayjs(aStart, timeFormat).diff(dayjs(bStart, timeFormat));
    });

    const result: { start: string; end: string }[] = [];
    const [initialStart, initialEnd] = sorted[0].split(' - ').map(s => s.trim());
    let currentGroup = { start: initialStart, end: initialEnd };

    for (let i = 1; i < sorted.length; i++) {
        const [start, end] = sorted[i].split(' - ');
        const prevEnd = currentGroup.end;

        const expectedStart = dayjs(prevEnd, timeFormat).add(1, 'minute');

        if (dayjs(start, timeFormat).isSame(expectedStart)) {
            currentGroup.end = end; 
        } else {
            result.push(currentGroup);
            currentGroup = { start, end };
        }
    }
    result.push(currentGroup);

    return result.map(({ start, end }) => `${start} as ${end}`);
}