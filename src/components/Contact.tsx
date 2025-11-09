
import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../hooks/useLocalization';

const Contact: React.FC = () => {
    const { t } = useLocalization();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.2
            }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 20 }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-display font-bold text-gold">{t('contactTitle')}</h2>
                <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-3xl mx-auto">{t('contactDescription')}</p>
            </div>

            <div className="max-w-lg mx-auto bg-light-paper dark:bg-dark-paper p-8 rounded-lg shadow-xl border border-light-border dark:border-dark-border">
                <motion.form 
                    className="space-y-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">{t('contactFormName')}</label>
                        <input type="text" className="w-full p-3 rounded-md bg-white dark:bg-charcoal border border-light-border dark:border-dark-border focus:ring-2 focus:ring-gold focus:outline-none" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">{t('contactFormEmail')}</label>
                        <input type="email" className="w-full p-3 rounded-md bg-white dark:bg-charcoal border border-light-border dark:border-dark-border focus:ring-2 focus:ring-gold focus:outline-none" />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <label className="block text-sm font-bold text-light-text dark:text-dark-text mb-2">{t('contactFormMessage')}</label>
                        <textarea rows={4} className="w-full p-3 rounded-md bg-white dark:bg-charcoal border border-light-border dark:border-dark-border focus:ring-2 focus:ring-gold focus:outline-none"></textarea>
                    </motion.div>
                    <motion.button
                        variants={itemVariants}
                        className="w-full py-3 px-6 bg-gold text-black font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {t('sendMessage')}
                    </motion.button>
                </motion.form>
            </div>
            
            <motion.div 
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <a
                    href="https://wa.me/1234567890" // Replace with actual number
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 py-3 px-6 bg-green-500 text-white font-bold rounded-lg shadow-lg hover:bg-green-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.487 5.235 3.487 8.413 0 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.475l-6.351 1.688zm7.472-1.847c1.664.973 3.553 1.52 5.576 1.52 5.45 0 9.903-4.453 9.903-9.903s-4.453-9.903-9.903-9.903-9.903 4.453-9.903 9.903c0 2.22.75 4.354 2.127 6.062l-1.33 4.864 4.862-1.332z"/></svg>
                    {t('contactWhatsapp')}
                </a>
            </motion.div>
        </div>
    );
};

export default Contact;
