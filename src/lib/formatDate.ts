function format_Date(date: Date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2); // Getting last two digits of the year
  return `${day}.${month}.${year}`;
}

export const formatDate = (date?: string) => {
  return format_Date(date ? new Date(date) : new Date());
};
// export const formatDate = (date?: string) => {
//   return format_Date(date ? new Date(date) : new Date());
// };
