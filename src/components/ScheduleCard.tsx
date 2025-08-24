import { format } from "date-fns";

interface ScheduleCardProps {
  id: string;
  date: string;
  className: string;
  timeStart: string;
  timeEnd: string;
  onEdit: (schedule: { id: string; date: string; className: string; timeStart: string; timeEnd: string }) => void;
  onDelete: (id: string) => void;
}

export default function ScheduleCard({ id, date, className, timeStart, timeEnd, onEdit, onDelete }: ScheduleCardProps) {
  // Format the date to "Month DD, YYYY"
  const formattedDate = format(new Date(date), "MMMM dd, yyyy");

  // Format time to 12-hour format with AM/PM
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const parsedHours = parseInt(hours, 10);
    const period = parsedHours >= 12 ? 'PM' : 'AM';
    const displayHours = parsedHours % 12 || 12;
    return `${displayHours}:${minutes} ${period}`;
  };

  const handleEdit = () => {
    onEdit({ id, date, className, timeStart, timeEnd });
  };

  const handleDelete = () => {
    onDelete(id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-purple-600 mb-2">{className}</h3>
          <p className="text-gray-600 mb-1">
            <span className="inline-block w-5 mr-2">📅</span>
            {formattedDate}
          </p>
          <p className="text-gray-600">
            <span className="inline-block w-5 mr-2">⏰</span>
            {formatTime(timeStart)} - {formatTime(timeEnd)}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleEdit}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-blue-600 hover:text-blue-800"
            title="Edit Schedule"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-600 hover:text-red-800"
            title="Delete Schedule"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
