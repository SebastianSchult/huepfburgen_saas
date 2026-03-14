import i18n from "i18next";
import { initReactI18next } from "react-i18next";

void i18n.use(initReactI18next).init({
  lng: "de",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  },
  resources: {
    de: {
      translation: {
        app_title: "Huepfburgen SaaS",
        app_subtitle: "Mandantenfähige Vermietplattform",
        health_label: "API-Status",
        modules_label: "MVP-Module",
        module_equipment: "Equipment",
        module_customers: "Kunden",
        module_bookings: "Buchungen",
        module_availability: "Verfügbarkeit"
      }
    },
    en: {
      translation: {
        app_title: "Huepfburgen SaaS",
        app_subtitle: "Multi-tenant rental platform",
        health_label: "API status",
        modules_label: "MVP modules",
        module_equipment: "Equipment",
        module_customers: "Customers",
        module_bookings: "Bookings",
        module_availability: "Availability"
      }
    }
  }
});

export default i18n;
