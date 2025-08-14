export function getPathName() {
  const path = window.location.href;
  const pathArray = path.split("/");
  const pathname = pathArray[pathArray.length - 1];
  return pathname;
}

export function convertTimeFormat(startDate, endDate) {
  console.log(startDate,endDate)
  function formatTime(time) {
    let [hours, minutes] = time?.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  }

  const startTimeFormatted = formatTime(startDate);
  const endTimeFormatted = formatTime(endDate);

  return `${startTimeFormatted} - ${endTimeFormatted}`;
}


export function formatDate(inputDate) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const [year, month, day] = inputDate.split("-");
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}
