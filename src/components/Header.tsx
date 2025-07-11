import { LanguageSelector } from "./LanguageSelector";
import { PartnershipForm } from "./PartnershipForm";
import { DemoForm } from "./DemoForm";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-primary">OnConect</div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#home" className="text-sm font-medium hover:text-primary transition-smooth">
              {t('home')}
            </a>
            <a href="#services" className="text-sm font-medium hover:text-primary transition-smooth">
              {t('services')}
            </a>
            <a href="#contact" className="text-sm font-medium hover:text-primary transition-smooth">
              {t('contact')}
            </a>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <LanguageSelector />
          <PartnershipForm />
          <DemoForm />
        </div>
      </div>
    </header>
  );
}