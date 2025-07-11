import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function ContactSection() {
  const { t } = useLanguage();

  return (
    <section id="contact" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t('contactTitle')}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('address')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Sebzor 52a<br />
                Tashkent, Uzbekistan
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">{t('phone')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                +998 97 156 09 60
              </p>
            </CardContent>
          </Card>

          <Card className="text-center shadow-soft hover:shadow-medium transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">{t('email')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                hello@onconect.org
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}