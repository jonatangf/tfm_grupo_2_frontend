import { Pipe, PipeTransform } from '@angular/core';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

/*
* PIPE para rango de fechas en el mismo o distintos meses
*/

@Pipe({
  name: 'dateRange'
})
export class DateRangePipe implements PipeTransform {
  transform(start: string | Date, end: string | Date): string {
    if (!start || !end) return '';

    const startDate = dayjs(start).locale('es');
    const endDate = dayjs(end).locale('es');

    // Si están en el mismo mes
    if (startDate.month() === endDate.month()) {
      return `Del ${startDate.format('D')} al ${endDate.format('D MMMM YYYY')}`;
    }

    // Si son meses distintos
    return `Del ${startDate.format('D MMMM')} al ${endDate.format('D MMMM YYYY')}`;
  }
}

/*
*  PIPE para una fecha
*/

@Pipe({
    name: 'dateSingle'
})

export class DateSinglePipe implements PipeTransform{
    transform(value: string | Date): string {
        if(!value) return '';
        return dayjs(value).locale('es').format('D [de] MMMM YYYY');
    }
}
