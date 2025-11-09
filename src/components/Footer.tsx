
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

const Footer: React.FC = () => {
    const { t } = useLocalization();
  return (
    <footer className="bg-black text-sand p-4 text-center mt-8">
      <div className="container mx-auto">
        <p>&copy; {new Date().getFullYear()} {t('appTitle')} - cairoeg.online</p>
      </div>
    </footer>
  );
};

export default Footer;
