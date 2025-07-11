import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Download, RefreshCw, Users, FileText, Building2, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Partnership {
  id: string;
  clinic_name: string;
  contact_person: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  status: string;
  created_at: string;
}

interface DemoSubmission {
  id: string;
  patient_name: string;
  contact_email: string;
  language: string;
  status: string;
  created_at: string;
  medical_history: string;
  lab_results: string;
  oncologist_report: string;
}

export default function AdminDashboard() {
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [submissions, setSubmissions] = useState<DemoSubmission[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simple authentication check
      if (credentials.username === 'admin' && credentials.password === 'onconect2024') {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        fetchData();
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const [partnershipsResult, submissionsResult] = await Promise.all([
        supabase.from('clinic_partnerships').select('*').order('created_at', { ascending: false }),
        supabase.from('demo_submissions').select('*').order('created_at', { ascending: false })
      ]);

      if (partnershipsResult.data) setPartnerships(partnershipsResult.data);
      if (submissionsResult.data) setSubmissions(submissionsResult.data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    }
  };

  const updatePartnershipStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('clinic_partnerships')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setPartnerships(partnerships.map(p => 
        p.id === id ? { ...p, status } : p
      ));

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const updateSubmissionStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('demo_submissions')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setSubmissions(submissions.map(s => 
        s.id === id ? { ...s, status } : s
      ));

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'submitted':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
      case 'contacted':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">OnConect Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full medical-gradient" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground mt-4">
                <p><strong>Credentials:</strong></p>
                <p>Username: admin</p>
                <p>Password: onconect2024</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold text-primary">OnConect Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => setIsAuthenticated(false)} variant="ghost" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Partnerships</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{partnerships.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Demo Submissions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.filter(s => s.status === 'submitted').length + 
                 partnerships.filter(p => p.status === 'pending').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="partnerships" className="space-y-6">
          <TabsList>
            <TabsTrigger value="partnerships">Clinic Partnerships</TabsTrigger>
            <TabsTrigger value="submissions">Demo Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="partnerships">
            <Card>
              <CardHeader>
                <CardTitle>Clinic Partnership Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Clinic Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partnerships.map((partnership) => (
                      <TableRow key={partnership.id}>
                        <TableCell className="font-medium">{partnership.clinic_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{partnership.contact_person}</div>
                            <div className="text-muted-foreground">{partnership.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{partnership.city}, {partnership.country}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(partnership.status)}>
                            {partnership.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(partnership.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Select onValueChange={(value) => updatePartnershipStatus(partnership.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Demo Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">{submission.patient_name}</TableCell>
                        <TableCell className="text-sm">{submission.contact_email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{submission.language.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(submission.status)}>
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="space-x-2">
                          <Select onValueChange={(value) => updateSubmissionStatus(submission.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="submitted">Submitted</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="translated">Translated</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="sent_to_oncologist">Sent to Oncologist</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}