const dateFormatter = (inputDate) => {
  const date = new Date(inputDate);  // ✅ Convert to Date object

  if (isNaN(date)) return "Invalid Date";

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHour = String(hours % 12 || 12).padStart(2, '0');

  const time = `${formattedHour}:${minutes} ${ampm}`;

  return `${dd}-${mm}-${yyyy} - ${weekday}, ${time}`;
};

export default dateFormatter;
