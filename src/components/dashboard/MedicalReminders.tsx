
import React from 'react';
import { Bell, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

// Mock reminders data
const remindersList = [
  { 
    id: '1', 
    title: 'Annual Physical Checkup', 
    date: '2023-06-30', 
    time: '10:00 AM', 
    type: 'appointment',
    completed: false
  },
  { 
    id: '2', 
    title: 'Flu Vaccination', 
    date: '2023-06-28', 
    time: '2:30 PM', 
    type: 'vaccination',
    completed: false
  },
  { 
    id: '3', 
    title: 'Refill Prescription', 
    date: '2023-06-25', 
    description: 'Lisinopril 10mg',
    type: 'medication',
    completed: false
  },
  { 
    id: '4', 
    title: 'Lab Test Results Available', 
    date: '2023-06-24', 
    type: 'results',
    completed: true
  }
];

const MedicalReminders = () => {
  const handleMarkComplete = (id: string, title: string) => {
    toast({
      title: "Reminder Completed",
      description: `"${title}" has been marked as completed.`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Medical Reminders</CardTitle>
          <CardDescription>Upcoming health tasks and reminders</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Add Reminder
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {remindersList.map((reminder) => (
            <div 
              key={reminder.id} 
              className={`flex items-start justify-between p-3 border rounded-lg ${
                reminder.completed ? 'bg-muted/30' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  reminder.type === 'appointment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  reminder.type === 'vaccination' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                  reminder.type === 'medication' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' :
                  'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
                }`}>
                  {reminder.type === 'appointment' && <Calendar className="h-4 w-4" />}
                  {reminder.type === 'vaccination' && <CheckCircle2 className="h-4 w-4" />}
                  {reminder.type === 'medication' && <Bell className="h-4 w-4" />}
                  {reminder.type === 'results' && <Clock className="h-4 w-4" />}
                </div>
                <div>
                  <h4 className={`font-medium ${reminder.completed ? 'text-muted-foreground line-through' : ''}`}>
                    {reminder.title}
                  </h4>
                  {reminder.description && (
                    <p className="text-xs text-muted-foreground">{reminder.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {new Date(reminder.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    {reminder.time && (
                      <>
                        <Clock className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{reminder.time}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={reminder.completed ? "outline" : "default"}>
                  {reminder.completed ? 'Completed' : 'Pending'}
                </Badge>
                {!reminder.completed && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleMarkComplete(reminder.id, reminder.title)}
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicalReminders;
