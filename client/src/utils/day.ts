type IsSameDayParams = string | number | Date;

export const isSameDay = (date1: IsSameDayParams, date2: IsSameDayParams) => {
  var d1 = new Date(date1);
  var d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  );
};
