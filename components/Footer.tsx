
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const Footer: React.FC = () => {
    const { t } = useLocalization();
  return (
    <footer className="bg-nile-blue text-papyrus-beige p-4 text-center">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} {t('appTitle')} - cairoeg.online</p>
      </div>
    </footer>
  );
};

export default Footer;
