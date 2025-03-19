
import React, { useState } from 'react';
import { CalendarIcon, VideoIcon, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Doctor } from '@/types';

// Form schema for booking appointments
const appointmentFormSchema = z.object({
  doctorId: z.string({
    required_error: "Please select a doctor.",
  }),
  date: z.date({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  type: z.enum(['video', 'in-person'], {
    required_error: "Please select appointment type.",
  }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface BookAppointmentFormProps {
  doctors: Doctor[];
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel: () => void;
}

const BookAppointmentForm = ({ doctors, onSubmit, onCancel }: BookAppointmentFormProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Initialize form
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      type: 'video',
      notes: '',
    },
  });

  // Handle doctor selection
  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    form.setValue('doctorId', doctor.id);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Doctor Selection */}
        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Doctor</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-md cursor-pointer transition-colors",
                      selectedDoctor?.id === doctor.id 
                        ? "border-primary bg-primary/5" 
                        : "hover:border-primary/50"
                    )}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="h-12 w-12 rounded-full overflow-hidden">
                      <img 
                        src={doctor.avatar} 
                        alt={doctor.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{doctor.name}</p>
                      <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Date & Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Appointment Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        // Disable dates in the past
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appointment Time</FormLabel>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {selectedDoctor?.availableSlots?.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={field.value === slot ? "default" : "outline"}
                      className="text-sm"
                      onClick={() => {
                        field.onChange(slot);
                      }}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Appointment Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment Type</FormLabel>
              <div className="flex gap-4 mt-2">
                <Button
                  type="button"
                  variant={field.value === 'video' ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => field.onChange('video')}
                >
                  <VideoIcon className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
                <Button
                  type="button"
                  variant={field.value === 'in-person' ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => field.onChange('in-person')}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  In-Person
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Notes */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <textarea
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[100px]"
                  placeholder="Any special requirements or information for the doctor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Book Appointment</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default BookAppointmentForm;
