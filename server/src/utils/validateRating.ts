export function validateRating(rating: any): boolean {
  if (rating === undefined || rating === null) return false;
  if (typeof rating !== "number") return false;
  if (!Number.isInteger(rating)) return false;
  return rating >= 1 && rating <= 5;
}
