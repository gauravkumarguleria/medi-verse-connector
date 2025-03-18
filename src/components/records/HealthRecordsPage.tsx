
import React, { useState, useRef } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  FileText,
  Search,
  Upload,
  FileHeart,
  Filter,
  Plus,
  FolderOpen,
  Calendar,
  FileImage,
  FilePlus,
  List,
  Grid,
  Download,
  Trash2,
  Share2,
  BookOpen,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

// Mock data for health records
const healthRecords = [
  {
    id: '1',
    name: 'Blood Test Results',
    date: '2023-05-14',
    category: 'Lab Results',
    provider: 'Dr. Sarah Williams',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    shared: false,
  },
  {
    id: '2',
    name: 'Chest X-Ray',
    date: '2023-04-28',
    category: 'Imaging',
    provider: 'Riverside Hospital',
    fileType: 'DICOM',
    fileSize: '8.7 MB',
    shared: true,
  },
  {
    id: '3',
    name: 'Prescription - Amoxicillin',
    date: '2023-03-15',
    category: 'Prescriptions',
    provider: 'Dr. Michael Chen',
    fileType: 'PDF',
    fileSize: '0.5 MB',
    shared: false,
  },
  {
    id: '4',
    name: 'Annual Physical Results',
    date: '2023-02-10',
    category: 'Wellness',
    provider: 'HealthFirst Clinic',
    fileType: 'PDF',
    fileSize: '2.3 MB',
    shared: false,
  },
  {
    id: '5',
    name: 'Allergies Report',
    date: '2023-01-22',
    category: 'Allergies',
    provider: 'Allergy Specialists Inc.',
    fileType: 'PDF',
    fileSize: '0.8 MB',
    shared: true,
  },
];

// Categories for filtering
const recordCategories = [
  'All Documents',
  'Lab Results',
  'Imaging',
  'Prescriptions',
  'Wellness',
  'Allergies',
  'Immunizations',
  'Surgical',
  'Other',
];

const HealthRecordsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Filter records based on search term and category
  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          record.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All Documents' || record.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            toast({
              title: "Upload complete",
              description: `Successfully uploaded ${files.length} file(s)`,
            });
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleDownload = (recordId: string) => {
    // In a real app, you would fetch the file from the server
    // and trigger a download using the File API or a Blob
    const record = healthRecords.find(r => r.id === recordId);
    
    toast({
      title: "Download started",
      description: `Downloading "${record?.name}"...`,
    });
    
    // Simulate a download delay
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `"${record?.name}" has been downloaded successfully.`,
      });
    }, 1500);
  };

  const handleShare = (recordId: string) => {
    const record = healthRecords.find(r => r.id === recordId);
    
    // In a real app, this would open a sharing dialog or copy a link
    toast({
      title: "Sharing options",
      description: `Share "${record?.name}" with healthcare providers or family members.`,
    });

    // You would implement a sharing modal or mechanism here
  };

  const handleDelete = (recordId: string) => {
    const record = healthRecords.find(r => r.id === recordId);
    
    // In a real app, you would delete the record from your database
    toast({
      title: "Document deleted",
      description: `"${record?.name}" has been removed from your records.`,
      variant: "destructive",
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lab Results':
        return <FileText className="h-5 w-5 text-medical-blue" />;
      case 'Imaging':
        return <FileImage className="h-5 w-5 text-purple-500" />;
      case 'Prescriptions':
        return <FileHeart className="h-5 w-5 text-medical-orange" />;
      case 'Wellness':
        return <BookOpen className="h-5 w-5 text-medical-green" />;
      case 'Allergies':
        return <FileHeart className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Health Records</h1>
        <Button onClick={handleUploadClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Document
        </Button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          multiple 
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.dicom"
        />
      </div>

      {/* Upload Progress Alert */}
      {uploadProgress !== null && (
        <Alert className="relative overflow-hidden">
          <div 
            className="absolute left-0 top-0 h-1 bg-primary" 
            style={{ width: `${uploadProgress}%` }}
          />
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="flex items-center justify-between">
            <span>Uploading files...</span>
            <span>{uploadProgress}%</span>
          </AlertTitle>
          <AlertDescription>
            Please wait while your files are being uploaded.
          </AlertDescription>
        </Alert>
      )}

      {/* Recently Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <Badge key={index} variant="outline" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {file.name}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Records Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-medical-blue/10 p-2 rounded-full">
                <FileText className="h-5 w-5 text-medical-blue" />
              </div>
              <CardTitle className="text-lg">Total Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{healthRecords.length}</div>
            <p className="text-sm text-muted-foreground">Across {recordCategories.length - 1} categories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-medical-green/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-medical-green" />
              </div>
              <CardTitle className="text-lg">Recent Uploads</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">In the last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-medical-orange/10 p-2 rounded-full">
                <Share2 className="h-5 w-5 text-medical-orange" />
              </div>
              <CardTitle className="text-lg">Shared Documents</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2</div>
            <p className="text-sm text-muted-foreground">With healthcare providers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefixIcon={<Search className="h-4 w-4" />}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full md:w-auto">
            <TabsList className="h-10 w-full md:w-auto overflow-auto">
              {recordCategories.slice(0, 4).map((category) => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
              {/* More dropdown would go here in a real implementation */}
            </TabsList>
          </Tabs>
          
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Records Display */}
      {viewMode === 'list' ? (
        <Card>
          <Table>
            <TableCaption>A list of your recent health records.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>File Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {getCategoryIcon(record.category)}
                      <span>{record.name}</span>
                      {record.shared && <Badge variant="outline" className="ml-2">Shared</Badge>}
                    </TableCell>
                    <TableCell>
                      {new Date(record.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{record.category}</TableCell>
                    <TableCell>{record.provider}</TableCell>
                    <TableCell>{record.fileType} ({record.fileSize})</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(record.id)}
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShare(record.id)}
                          title="Share"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.id)}
                          title="Delete"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FolderOpen className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No records found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchTerm ? "Try a different search term" : "Upload your first health record"}
                      </p>
                      <Button onClick={handleUploadClick}>
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <Card key={record.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-muted h-32 flex items-center justify-center">
                  {getCategoryIcon(record.category)}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{record.name}</CardTitle>
                    {record.shared && <Badge variant="outline">Shared</Badge>}
                  </div>
                  <CardDescription>
                    {new Date(record.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{record.category}</p>
                      <p className="text-sm">{record.provider}</p>
                    </div>
                    <Badge variant="secondary">{record.fileType}</Badge>
                  </div>
                </CardContent>
                <div className="border-t px-6 py-3 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDownload(record.id)}
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(record.id)}
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(record.id)}
                    title="Delete"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full">
              <Card className="flex flex-col items-center justify-center p-10 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No records found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchTerm ? "Try a different search term" : "Upload your first health record"}
                </p>
                <Button onClick={handleUploadClick}>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Upload New Document Section with Drag and Drop */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
          <CardDescription>
            Upload your medical records, prescriptions, or lab results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? 'bg-primary/5 border-primary' : 'bg-background'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FilePlus className={`h-12 w-12 mx-auto mb-4 ${
              isDragging ? 'text-primary animate-bounce' : 'text-muted-foreground'
            }`} />
            <h3 className="text-lg font-medium mb-2">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Supports PDF, JPEG, PNG, DICOM and other medical formats
            </p>
            <Button onClick={handleUploadClick}>
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRecordsPage;
