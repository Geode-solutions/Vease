export function formatRelativeTime(dateInput) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSecs < 60) return "just now"
  if (diffMins < 60)
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
  if (diffHours < 24)
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
  if (diffWeeks < 4)
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`
  if (diffMonths < 12)
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`

  return date.toLocaleDateString()
}