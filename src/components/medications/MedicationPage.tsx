
import React, { useState } from 'react';
import { PillBottle, Pill, Calendar, Clock, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/hooks/use-toast';
import GlassCard from '@/components/ui/GlassCard';

// Mock medications data
const medicationsData = [
  {
    id: '1',
    name: 'Amoxicillin',
    dosage: '500mg',
    frequency: 'Twice daily',
    time: '8:00 AM, 8:00 PM',
    remaining: 5,
    refillDate: '2023-06-25',
    prescribedBy: 'Dr. Sarah Williams',
    status: 'active',
    notes: 'Take with food',
    category: 'antibiotic'
  },
  {
    id: '2',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    time: '9:00 AM',
    remaining: 15,
    refillDate: '2023-07-10',
    prescribedBy: 'Dr. James Rodriguez',
    status: 'active',
    notes: 'Monitor blood pressure',
    category: 'blood pressure'
  },
  {
    id: '3',
    name: 'Metformin',
    dosage: '850mg',
    frequency: 'Three times daily',
    time: '8:00 AM, 2:00 PM, 8:00 PM',
    remaining: 10,
    refillDate: '2023-06-30',
    prescribedBy: 'Dr. Emily Chen',
    status: 'active',
    notes: 'Take with meals',
    category: 'diabetes'
  },
  {
    id: '4',
    name: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    time: '8:00 PM',
    remaining: 20,
    refillDate: '2023-07-15',
    prescribedBy: 'Dr. James Rodriguez',
    status: 'active',
    notes: 'Take in the evening',
    category: 'cholesterol'
  },
  {
    id: '5',
    name: 'Cetirizine',
    dosage: '10mg',
    frequency: 'Once daily',
    time: '9:00 AM',
    remaining: 2,
    refillDate: '2023-06-20',
    prescribedBy: 'Dr. Sarah Williams',
    status: 'low',
    notes: 'Take as needed for allergies',
    category: 'allergy'
  },
  {
    id: '6',
    name: 'Ibuprofen',
    dosage: '400mg',
    frequency: 'As needed',
    time: 'As needed',
    remaining: 8,
    refillDate: '2023-07-05',
    prescribedBy: 'Dr. Sarah Williams',
    status: 'active',
    notes: 'Take for pain, no more than 3 times per day',
    category: 'pain'
  }
];

// Daily schedule based on medications
const generateDailySchedule = (medications: typeof medicationsData) => {
  const schedule: Record<string, any[]> = {
    "Morning (6AM-12PM)": [],
    "Afternoon (12PM-6PM)": [],
    "Evening (6PM-12AM)": [],
  };

  medications.forEach(med => {
    if (med.time.includes('AM') && !med.time.includes('As needed')) {
      schedule["Morning (6AM-12PM)"].push(med);
    }
    if (med.time.includes('PM') && med.time.includes('2:00')) {
      schedule["Afternoon (12PM-6PM)"].push(med);
    }
    if (med.time.includes('PM') && med.time.includes('8:00')) {
      schedule["Evening (6PM-12AM)"].push(med);
    }
  });

  return schedule;
};

const MedicationPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredMedications = medicationsData.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const schedule = generateDailySchedule(medicationsData);
  
  const handleRequestRefill = (medicationName: string) => {
    toast({
      title: "Refill Requested",
      description: `A refill request for ${medicationName} has been sent to your healthcare provider.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Medications</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <PillBottle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Total Medications</h3>
            <p className="text-2xl font-semibold">{medicationsData.length}</p>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4">
          <div className="bg-yellow-500/10 p-3 rounded-full">
            <Pill className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Low Stock</h3>
            <p className="text-2xl font-semibold">
              {medicationsData.filter(med => med.remaining <= 5).length}
            </p>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4">
          <div className="bg-green-500/10 p-3 rounded-full">
            <Calendar className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Next Refill</h3>
            <p className="text-2xl font-semibold">
              {new Date(Math.min(...medicationsData.map(med => new Date(med.refillDate).getTime())))
                .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Daily Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your medication schedule for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(schedule).map(([timeBlock, meds]) => (
              <div key={timeBlock} className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {timeBlock}
                </h4>
                {meds.length > 0 ? (
                  <div className="grid gap-2">
                    {meds.map(med => (
                      <div key={med.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Pill className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{med.name}</h4>
                            <p className="text-xs text-muted-foreground">{med.dosage} • {med.time}</p>
                          </div>
                        </div>
                        <Badge variant={med.remaining <= 5 ? "destructive" : "outline"}>
                          {med.remaining} left
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No medications scheduled</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Medications List</CardTitle>
              <CardDescription>Manage your prescriptions</CardDescription>
            </div>
            <Input 
              placeholder="Search medications..." 
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Next Refill</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.prescribedBy}</p>
                    </div>
                  </TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>
                    <div>
                      <p>{med.frequency}</p>
                      <p className="text-xs text-muted-foreground">{med.time}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={med.remaining <= 5 ? "destructive" : "outline"}>
                      {med.remaining} pills
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(med.refillDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm">Details</Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <div className="space-y-2">
                            <h4 className="font-medium">{med.name}</h4>
                            <p className="text-sm text-muted-foreground">{med.notes}</p>
                            <div className="text-sm">
                              <p><strong>Category:</strong> {med.category}</p>
                              <p><strong>Prescribed by:</strong> {med.prescribedBy}</p>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      {med.remaining <= 5 && (
                        <Button 
                          size="sm"
                          onClick={() => handleRequestRefill(med.name)}
                        >
                          Request Refill
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationPage;
