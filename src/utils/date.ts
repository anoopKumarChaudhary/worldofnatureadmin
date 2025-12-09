export const formatDate = (date: string | Date | undefined | null): string => {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getSmartDate = (doc: any, dateField: string = 'createdAt'): Date | null => {
  if (doc[dateField]) return new Date(doc[dateField]);
  
  // Fallback: Extract timestamp from MongoDB ObjectId
  if (doc._id && typeof doc._id === "string" && doc._id.length === 24) {
    const timestamp = parseInt(doc._id.substring(0, 8), 16) * 1000;
    return new Date(timestamp);
  }
  
  return null;
};
