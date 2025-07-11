import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Shield, Users, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="py-24 md:py-32 hero-gradient">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                {t('heroSubtitle')}
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                {t('heroDescription')}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-medium">
                {t('getStarted')}
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                {t('watchDemo')}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth bg-white/10 backdrop-blur border-white/20">
              <Heart className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('consultationTitle')}</h3>
              <p className="text-white/80 text-sm">{t('consultationDesc')}</p>
            </Card>
            
            <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth bg-white/10 backdrop-blur border-white/20">
              <Shield className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('secondOpinionTitle')}</h3>
              <p className="text-white/80 text-sm">{t('secondOpinionDesc')}</p>
            </Card>
            
            <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth bg-white/10 backdrop-blur border-white/20">
              <Users className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">{t('treatmentPlanTitle')}</h3>
              <p className="text-white/80 text-sm">{t('treatmentPlanDesc')}</p>
            </Card>
            
            <Card className="p-6 shadow-soft hover:shadow-medium transition-smooth bg-white/10 backdrop-blur border-white/20">
              <Globe className="h-8 w-8 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI Agents</h3>
              <p className="text-white/80 text-sm">Translation and communication management</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}