
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Pill, 
  Search, 
  Filter, 
  Plus, 
  ClipboardList, 
  Users, 
  Clock
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import GlassCard from '@/components/ui/GlassCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const patients = [
  { id: '1', name: 'Sarah Johnson', age: 45, conditions: ['Hypertension', 'Diabetes'] },
  { id: '2', name: 'Michael Chen', age: 62, conditions: ['COPD', 'Arthritis'] },
  { id: '3', name: 'Emily Rodriguez', age: 28, conditions: ['Asthma'] },
  { id: '4', name: 'David Wilson', age: 55, conditions: ['Heart Disease', 'High Cholesterol'] },
  { id: '5', name: 'Linda Thompson', age: 39, conditions: ['Migraine', 'Anxiety'] },
];

const prescribedMedications = [
  { 
    id: '1',
    patientId: '1',
    patientName: 'Sarah Johnson',
    medicationName: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    startDate: '2023-05-15',
    endDate: '2023-11-15',
    status: 'active',
    notes: 'Monitor blood pressure weekly'
  },
  { 
    id: '2',
    patientId: '1',
    patientName: 'Sarah Johnson',
    medicationName: 'Metformin',
    dosage: '850mg',
    frequency: 'Twice daily',
    startDate: '2023-04-10',
    endDate: '2023-10-10',
    status: 'active',
    notes: 'Take with meals'
  },
  { 
    id: '3',
    patientId: '2',
    patientName: 'Michael Chen',
    medicationName: 'Albuterol',
    dosage: '90mcg',
    frequency: 'As needed',
    startDate: '2023-06-01',
    endDate: '2023-12-01',
    status: 'active',
    notes: 'Use inhaler for shortness of breath'
  },
  { 
    id: '4',
    patientId: '3',
    patientName: 'Emily Rodriguez',
    medicationName: 'Fluticasone',
    dosage: '110mcg',
    frequency: 'Twice daily',
    startDate: '2023-05-20',
    endDate: '2023-08-20',
    status: 'completed',
    notes: 'Two inhalations morning and evening'
  },
  { 
    id: '5',
    patientId: '4',
    patientName: 'David Wilson',
    medicationName: 'Atorvastatin',
    dosage: '20mg',
    frequency: 'Once daily',
    startDate: '2023-06-15',
    endDate: '2024-06-15',
    status: 'active',
    notes: 'Take in the evening'
  },
];

const DoctorMedicationPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isNewPrescriptionOpen, setIsNewPrescriptionOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  
  // Filter medications based on search term and active tab
  const filteredMedications = prescribedMedications.filter(med => {
    const matchesSearch = 
      med.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.dosage.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && med.status === activeTab;
  });
  
  const handleNewPrescription = () => {
    toast({
      title: "Prescription Added",
      description: "The new prescription has been added successfully.",
    });
    setIsNewPrescriptionOpen(false);
  };
  
  const handleMedicationChange = (medicationId: string, change: string) => {
    toast({
      title: `Medication ${change}`,
      description: `The medication has been ${change.toLowerCase()} successfully.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Patient Medications</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setIsNewPrescriptionOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Prescription
          </Button>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Pill className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Active Prescriptions</h3>
            <p className="text-2xl font-semibold">
              {prescribedMedications.filter(med => med.status === 'active').length}
            </p>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4">
          <div className="bg-green-500/10 p-3 rounded-full">
            <Users className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Patients on Medication</h3>
            <p className="text-2xl font-semibold">
              {new Set(prescribedMedications.map(med => med.patientId)).size}
            </p>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-4">
          <div className="bg-yellow-500/10 p-3 rounded-full">
            <Clock className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Upcoming Renewals</h3>
            <p className="text-2xl font-semibold">3</p>
          </div>
        </GlassCard>
      </div>

      {/* Prescription List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Prescriptions</CardTitle>
              <CardDescription>Manage your patients' medications</CardDescription>
            </div>
            <Input 
              placeholder="Search prescriptions..." 
              className="max-w-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefixIcon={<Search className="h-4 w-4 text-muted-foreground" />}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMedications.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell>
                      <div className="font-medium">{prescription.patientName}</div>
                    </TableCell>
                    <TableCell>{prescription.medicationName}</TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.frequency}</TableCell>
                    <TableCell>
                      {new Date(prescription.startDate).toLocaleDateString()} - 
                      {new Date(prescription.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={prescription.status === 'active' ? "default" : "secondary"}>
                        {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMedicationChange(prescription.id, 'Updated')}
                        >
                          Edit
                        </Button>
                        {prescription.status === 'active' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleMedicationChange(prescription.id, 'Discontinued')}
                          >
                            Discontinue
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMedicationChange(prescription.id, 'Renewed')}
                        >
                          Renew
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMedications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No prescriptions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* New Prescription Dialog */}
      <Dialog open={isNewPrescriptionOpen} onOpenChange={setIsNewPrescriptionOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Prescription</DialogTitle>
            <DialogDescription>
              Create a new prescription for a patient
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient">Patient</Label>
              <Select onValueChange={setSelectedPatient}>
                <SelectTrigger id="patient">
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map(patient => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="medication">Medication</Label>
              <Input id="medication" placeholder="Medication name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" placeholder="e.g. 10mg" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once daily</SelectItem>
                    <SelectItem value="twice">Twice daily</SelectItem>
                    <SelectItem value="three">Three times daily</SelectItem>
                    <SelectItem value="asneeded">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration</Label>
              <Select>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1week">1 week</SelectItem>
                  <SelectItem value="2weeks">2 weeks</SelectItem>
                  <SelectItem value="1month">1 month</SelectItem>
                  <SelectItem value="3months">3 months</SelectItem>
                  <SelectItem value="6months">6 months</SelectItem>
                  <SelectItem value="1year">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Additional instructions" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewPrescriptionOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleNewPrescription}>
              Add Prescription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorMedicationPage;
