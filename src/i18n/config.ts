import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Stay Connected, Stay Prepared',
      subtitle: 'Join your local community in sharing resources, preparing for emergencies, and building resilience together.',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      search: 'Search resources, alerts, or locations...',
      createAlert: 'Create Alert',
      joinGroup: 'Join Group'
    }
  },
  hi: {
    translation: {
      welcome: 'जुड़े रहें, तैयार रहें',
      subtitle: 'संसाधनों को साझा करने, आपातकालीन तैयारी और एकजुटता बनाने के लिए अपने स्थानीय समुदाय से जुड़ें।',
      signIn: 'साइन इन करें',
      signUp: 'साइन अप करें',
      search: 'संसाधन, अलर्ट या स्थान खोजें...',
      createAlert: 'अलर्ट बनाएं',
      joinGroup: 'समूह में शामिल हों'
    }
  },
  ta: {
    translation: {
      welcome: 'இணைந்திருங்கள், தயாராக இருங்கள்',
      subtitle: 'வளங்களைப் பகிர்ந்து கொள்ள, அவசரநிலைகளுக்குத் தயாராக, உங்கள் உள்ளூர் சமூகத்துடன் இணையுங்கள்.',
      signIn: 'உள்நுழைக',
      signUp: 'பதிவு செய்க',
      search: 'வளங்கள், எச்சரிக்கைகள் அல்லது இடங்களைத் தேடுங்கள்...',
      createAlert: 'எச்சரிக்கை உருவாக்கு',
      joinGroup: 'குழுவில் சேர்'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;