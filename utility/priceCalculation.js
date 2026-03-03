// calculating total price - Backend utility function
function calculateTotal(roomPrice, checkIn, checkOut, adultsNum, childrenAges = []) {
  if (!roomPrice || !checkIn || !checkOut) return 0;
  
  const price = roomPrice;
  const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);
  if (nights <= 0) return 0;
  
  let total = adultsNum * price * nights;
  childrenAges.forEach((ageGroup) => {
    if (ageGroup === "0-6") return;
    if (ageGroup === "7-12") total += price * 0.5 * nights;
    if (ageGroup === "13+") total += price * nights;
  });
  
  return Math.round(total * 100) / 100;
}

module.exports = { calculateTotal };