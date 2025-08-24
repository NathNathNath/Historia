import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Schedule {
  id?: string;
  date: string;
  className: string;
  timeStart: string;
  timeEnd: string;
}

interface AddScheduleModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (schedule: Schedule) => void;
  scheduleToEdit?: Schedule;
}

export default function AddScheduleModal({ open, onClose, onAdd, scheduleToEdit }: AddScheduleModalProps) {
  const [date, setDate] = useState(scheduleToEdit?.date || "");
  const [className, setClassName] = useState(scheduleToEdit?.className || "");
  const [timeStart, setTimeStart] = useState(scheduleToEdit?.timeStart || "");
  const [timeEnd, setTimeEnd] = useState(scheduleToEdit?.timeEnd || "");

  // Clear form fields
  const resetForm = () => {
    setDate("");
    setClassName("");
    setTimeStart("");
    setTimeEnd("");
  };

  // Handle dialog close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Update form when scheduleToEdit changes
  useEffect(() => {
    if (scheduleToEdit) {
      setDate(scheduleToEdit.date);
      setClassName(scheduleToEdit.className);
      setTimeStart(scheduleToEdit.timeStart);
      setTimeEnd(scheduleToEdit.timeEnd);
    }
  }, [scheduleToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onAdd({ 
        ...(scheduleToEdit?.id ? { id: scheduleToEdit.id } : {}),
        date, 
        className, 
        timeStart, 
        timeEnd 
      });
      resetForm();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-center">Add Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 rounded-md">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </span>
              <Input type="text" value={className} onChange={e => setClassName(e.target.value)} required className="flex-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <div className="flex items-center gap-2">
              <Input type="time" value={timeStart} onChange={e => setTimeStart(e.target.value)} required className="w-32" />
              <span className="mx-2">to</span>
              <Input type="time" value={timeEnd} onChange={e => setTimeEnd(e.target.value)} required className="w-32" />
            </div>
          </div>
          <div className="flex gap-2 mt-6">
            <Button type="submit" className="flex-1 bg-purple-600 text-white hover:bg-purple-700">Add</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
