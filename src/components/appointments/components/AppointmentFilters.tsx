
import React from 'react';
import { Filter, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { format } from 'date-fns';
import { VideoIcon, MapPin, CheckCircle2, XCircle } from 'lucide-react';

interface AppointmentFiltersProps {
  selectedDate: Date | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  viewMode: 'upcoming' | 'past' | 'all';
  setViewMode: React.Dispatch<React.SetStateAction<'upcoming' | 'past' | 'all'>>;
}

const AppointmentFilters = ({ 
  selectedDate, 
  setSelectedDate, 
  viewMode, 
  setViewMode 
}: AppointmentFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="flex gap-2">
        <Button 
          variant={viewMode === 'upcoming' ? 'default' : 'outline'} 
          onClick={() => setViewMode('upcoming')}
          size="sm"
        >
          Upcoming
        </Button>
        <Button 
          variant={viewMode === 'past' ? 'default' : 'outline'} 
          onClick={() => setViewMode('past')}
          size="sm"
        >
          Past
        </Button>
        <Button 
          variant={viewMode === 'all' ? 'default' : 'outline'} 
          onClick={() => setViewMode('all')}
          size="sm"
        >
          All
        </Button>
      </div>

      <div className="flex gap-2 items-center ml-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Appointments</SheetTitle>
              <SheetDescription>
                Apply filters to find specific appointments
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Appointment Type</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">All</Button>
                  <Button variant="outline" size="sm">
                    <VideoIcon className="h-4 w-4 mr-2" />
                    Video
                  </Button>
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    In-person
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Status</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">All</Button>
                  <Button variant="outline" size="sm">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Completed
                  </Button>
                  <Button variant="outline" size="sm">
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancelled
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Doctor</h3>
                <Input type="text" placeholder="Search doctor" />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline">Reset</Button>
              <Button>Apply Filters</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default AppointmentFilters;
