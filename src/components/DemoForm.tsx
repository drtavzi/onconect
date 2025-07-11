import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TestTube, Upload } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function DemoForm() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [formData, setFormData] = useState({
    patientName: "",
    patientAge: "",
    contactEmail: "",
    contactPhone: "",
    medicalHistory: "",
    labResults: "",
    oncologistReport: ""
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  const uploadFiles = async (submissionId: string) => {
    if (!files) return [];
    
    const uploadPromises = Array.from(files).map(async (file) => {
      const fileName = `${submissionId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('demo-files')
        .upload(fileName, file);
      
      if (error) throw error;
      return data.path;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First, insert the demo submission
      const { data: submission, error: insertError } = await supabase
        .from('demo_submissions')
        .insert([{
          patient_name: formData.patientName,
          patient_age: formData.patientAge ? parseInt(formData.patientAge) : null,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          language,
          medical_history: formData.medicalHistory,
          lab_results: formData.labResults,
          oncologist_report: formData.oncologistReport
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Upload files if any
      let fileUrls: string[] = [];
      if (files && files.length > 0) {
        fileUrls = await uploadFiles(submission.id);
        
        // Update submission with file URLs
        const { error: updateError } = await supabase
          .from('demo_submissions')
          .update({ file_urls: fileUrls })
          .eq('id', submission.id);

        if (updateError) throw updateError;
      }

      toast({
        title: "Success",
        description: t('demoSuccess'),
      });

      setFormData({
        patientName: "",
        patientAge: "",
        contactEmail: "",
        contactPhone: "",
        medicalHistory: "",
        labResults: "",
        oncologistReport: ""
      });
      setFiles(null);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit demo data",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
          <TestTube className="w-4 h-4 mr-2" />
          {t('demoButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('demoTitle')}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">{t('patientName')}</Label>
                  <Input
                    id="patientName"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patientAge">{t('patientAge')}</Label>
                  <Input
                    id="patientAge"
                    type="number"
                    value={formData.patientAge}
                    onChange={(e) => setFormData({...formData, patientAge: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">{t('contactEmail')}</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">{t('contactPhone')}</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medicalHistory">{t('medicalHistory')}</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                  rows={3}
                  placeholder="Patient's medical history, current symptoms, diagnosis..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="labResults">{t('labResults')}</Label>
                <Textarea
                  id="labResults"
                  value={formData.labResults}
                  onChange={(e) => setFormData({...formData, labResults: e.target.value})}
                  rows={3}
                  placeholder="Lab test results, blood work, imaging reports..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="oncologistReport">{t('oncologistReport')}</Label>
                <Textarea
                  id="oncologistReport"
                  value={formData.oncologistReport}
                  onChange={(e) => setFormData({...formData, oncologistReport: e.target.value})}
                  rows={3}
                  placeholder="Oncologist's current treatment plan and recommendations..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">{t('uploadFiles')}</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <Input
                    id="files"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                  />
                  <Label htmlFor="files" className="cursor-pointer">
                    <span className="text-sm text-muted-foreground">
                      Click to upload medical documents, reports, or images
                    </span>
                  </Label>
                  {files && files.length > 0 && (
                    <div className="mt-2 text-sm text-primary">
                      {files.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full medical-gradient" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : t('submit')}
              </Button>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}