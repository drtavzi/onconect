import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnershipForm } from "./PartnershipForm";
import { DemoForm } from "./DemoForm";
import { Video, FileText, Calendar, Bot, Building, TestTube } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function ServicesSection() {
  const { t } = useLanguage();

  const services = [
    {
      icon: Video,
      title: t('consultationTitle'),
      description: t('consultationDesc'),
      color: "text-primary"
    },
    {
      icon: FileText,
      title: t('secondOpinionTitle'),
      description: t('secondOpinionDesc'),
      color: "text-accent"
    },
    {
      icon: Calendar,
      title: t('treatmentPlanTitle'),
      description: t('treatmentPlanDesc'),
      color: "text-primary"
    },
    {
      icon: Bot,
      title: "AI Translation",
      description: "Automated translation and report generation",
      color: "text-accent"
    },
    {
      icon: Building,
      title: "Clinic Network",
      description: "Partner clinics worldwide for treatment implementation",
      color: "text-primary"
    },
    {
      icon: TestTube,
      title: "Lab Analysis",
      description: "Advanced lab result interpretation and recommendations",
      color: "text-accent"
    }
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('servicesTitle')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('servicesSubtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-smooth border-border">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
          <Card className="p-8 shadow-medium accent-gradient">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                {t('partnershipTitle')}
              </h3>
              <p className="text-white/90">
                {t('partnershipDesc')}
              </p>
              <PartnershipForm />
            </div>
          </Card>

          <Card className="p-8 shadow-medium medical-gradient">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">
                {t('demoTitle')}
              </h3>
              <p className="text-white/90">
                {t('demoDesc')}
              </p>
              <DemoForm />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}