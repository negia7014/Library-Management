const msInDay = 24*60*60*1000;
export default function calculateFine(returnedDate, expectedDate, perDay){
if(!returnedDate) return 0;
const diff = Math.ceil((new Date(returnedDate) - new Date(expectedDate)) / msInDay);
return diff > 0 ? diff * (perDay||10) : 0;
};