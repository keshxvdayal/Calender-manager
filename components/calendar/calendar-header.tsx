import { format } from "date-fns"

interface CalendarHeaderProps {
  days: Date[]
}

const CalendarHeader = ({ days }: CalendarHeaderProps) => {
  return (
    <div className="grid grid-cols-7 border-b">
      {days.map((day, index) => (
        <div
          key={index}
          className={`text-center py-2 border-r last:border-r-0 ${
            day.getDay() === 0 || day.getDay() === 6 ? "bg-gray-50" : ""
          }`}
        >
          <div className="text-sm uppercase text-gray-500">{format(day, "EEE")}</div>
          <div className="text-xl font-semibold">{format(day, "d")}</div>
        </div>
      ))}
    </div>
  )
}

export default CalendarHeader
