export const formatRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInSeconds < 60) {
    return "İndicə";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} dəqiqə əvvəl`;
  } else if (diffInHours < 24) {
    return `${diffInHours} saat əvvəl`;
  } else if (diffInDays === 1) {
    return "Dünən";
  } else if (diffInDays < 7) {
    return `${diffInDays} gün əvvəl`;
  } else if (diffInWeeks === 1) {
    return "1 həftə əvvəl";
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} həftə əvvəl`;
  } else if (diffInMonths === 1) {
    return "1 ay əvvəl";
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ay əvvəl`;
  } else {
    // For dates older than a year, show the full date
    return date.toLocaleDateString("az-AZ", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
};
