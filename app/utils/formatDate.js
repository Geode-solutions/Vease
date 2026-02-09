const SECONDS = 1000
const MINUTES = 60
const HOURS = 60
const DAYS = 24
const WEEKS = 7
const MONTHS = 30
const QUARTERS = 4
const YEARS = 12

export function formatRelativeTime(dateInput) {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / SECONDS)
  const diffMins = Math.floor(diffSecs / MINUTES)
  const diffHours = Math.floor(diffMins / HOURS)
  const diffDays = Math.floor(diffHours / DAYS)
  const diffWeeks = Math.floor(diffDays / WEEKS)
  const diffMonths = Math.floor(diffDays / MONTHS)

  if (diffSecs < SECONDS) return "just now"
  if (diffMins < MINUTES)
    return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`
  if (diffHours < HOURS)
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  if (diffDays < DAYS)
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`
  if (diffWeeks < QUARTERS)
    return `${diffWeeks} ${diffWeeks === 1 ? "week" : "weeks"} ago`
  if (diffMonths < YEARS)
    return `${diffMonths} ${diffMonths === 1 ? "month" : "months"} ago`

  return date.toLocaleDateString()
}
