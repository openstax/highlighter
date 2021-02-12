const messages = {
  en: {
    highlight: {
      end: (color: string) => `End ${color} highlight`,
      start: (color: string) => `Start ${color} highlight`,
    },
  },
};

export default function getMessages(language: keyof typeof messages = 'en') {
  return messages[language];
}
