// src/components/bookings/BookingForm.js
import { useState } from "react";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

export default function BookingForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    roomId: "",
    category: "REGULAR",
    startDate: "",
    endDate: "",
    description: "",
    schedules: [{ startTime: "", endTime: "", day: "MONDAY" }],
  });

  const combineDateAndTime = (date, time) => {
    const [hours, minutes] = time.split(":");
    const result = new Date(date);
    result.setHours(hours);
    result.setMinutes(minutes);
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result.toISOString();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      schedules: formData.schedules.map((schedule) => ({
        ...schedule,
        startTime: combineDateAndTime(formData.startDate, schedule.startTime),
        endTime: combineDateAndTime(formData.startDate, schedule.endTime),
        roomId: formData.roomId,
      })),
    };
    onSubmit(payload);
  };

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedules: [
        ...formData.schedules,
        { startTime: "", endTime: "", day: "MONDAY" },
      ],
    });
  };

  const BOOKING_CATEGORIES = ["EVENT", "REGULAR", "EXTRA", "LABS"];

  const updateSchedule = (index, field, value) => {
    const newSchedules = [...formData.schedules];
    newSchedules[index][field] = value;
    setFormData({ ...formData, schedules: newSchedules });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Room ID
          </label>
          <input
            type="number"
            required
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.roomId}
            onChange={(e) =>
              setFormData({ ...formData, roomId: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            {BOOKING_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Schedules</h3>
            <button
              type="button"
              onClick={addSchedule}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Add Schedule
            </button>
          </div>

          {formData.schedules.map((schedule, index) => (
            <div
              key={index}
              className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={schedule.startTime}
                    onChange={(e) =>
                      updateSchedule(index, "startTime", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    value={schedule.endTime}
                    onChange={(e) =>
                      updateSchedule(index, "endTime", e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Day
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={schedule.day}
                  onChange={(e) => updateSchedule(index, "day", e.target.value)}
                >
                  {[
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY",
                  ].map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Submit Booking
        </button>
      </div>
    </form>
  );
}
