import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building2 } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function PartnershipForm() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clinicName: "",
    contactPerson: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    additionalInfo: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('clinic_partnerships')
        .insert([{
          clinic_name: formData.clinicName,
          contact_person: formData.contactPerson,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          additional_info: formData.additionalInfo
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: t('partnershipSuccess'),
      });

      setFormData({
        clinicName: "",
        contactPerson: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        additionalInfo: ""
      });
      setIsOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit partnership request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="bg-white text-accent hover:bg-white/90">
          <Building2 className="w-4 h-4 mr-2" />
          {t('partnershipButton')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('partnershipTitle')}</DialogTitle>
        </DialogHeader>
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName">{t('clinicName')}</Label>
                <Input
                  id="clinicName"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({...formData, clinicName: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPerson">{t('contactPerson')}</Label>
                <Input
                  id="contactPerson"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t('emailAddress')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">{t('country')}</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">{t('city')}</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">{t('additionalInfo')}</Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                  rows={3}
                />
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