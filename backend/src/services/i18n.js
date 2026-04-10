export const TEXTS = {
  en: {
    greet: "Hi, I am your Waste AI Assistant. You can ask about schedules, segregation, complaints, and tracking.",
    askLocation: "Please share the exact pickup location for the complaint.",
    askImage: "Please upload an image for better resolution, or type skip.",
    ticketCreated: (ticketId) => `Complaint registered successfully. Your ticket is ${ticketId}.`,
    trackNeedTicket: "Please share your complaint ticket ID, for example CMP-20260325-0001.",
    noTicketFound: "I could not find a complaint with that ticket ID.",
    schedule: "Pickup schedule simulation: Wet waste daily 7am-10am, dry waste Tue/Thu/Sat 10am-2pm, e-waste every Friday 3pm-6pm.",
    segregation: "Segregation guide: Green bin for wet waste, blue bin for dry recyclables, red bin for hazardous items, separate e-waste from household waste.",
    help: "Quick options: Track complaint, Register complaint, Pickup schedule, Segregation help."
  },
  hi: {
    greet: "Namaste, main aapka Waste AI Assistant hoon. Aap schedule, segregation, complaint aur tracking puch sakte hain.",
    askLocation: "Kripya complaint ke liye sahi location batayein.",
    askImage: "Behtar resolution ke liye image upload karein, ya skip likhein.",
    ticketCreated: (ticketId) => `Complaint register ho gayi. Aapka ticket ${ticketId} hai.`,
    trackNeedTicket: "Kripya complaint ticket ID bhejein, jaise CMP-20260325-0001.",
    noTicketFound: "Is ticket ID ki complaint nahi mili.",
    schedule: "Pickup schedule simulation: geela kachra daily 7am-10am, sukha kachra Tue/Thu/Sat 10am-2pm, e-waste Friday 3pm-6pm.",
    segregation: "Segregation guide: geela kachra green bin, dry recyclable blue bin, hazardous red bin, e-waste alag rakhein.",
    help: "Quick options: Track complaint, Register complaint, Pickup schedule, Segregation help."
  },
  kn: {
    greet: "Namaskara, nanu nimma Waste AI Assistant. Nivu schedule, segregation, complaint mattu tracking kelabahudu.",
    askLocation: "Dayavittu complaint ge nikhara location kodi.",
    askImage: "Uttama resolution ge image upload madi, illa skip endu type madi.",
    ticketCreated: (ticketId) => `Complaint register aayitu. Nimma ticket ${ticketId}.`,
    trackNeedTicket: "Dayavittu complaint ticket ID kodi, udaharane CMP-20260325-0001.",
    noTicketFound: "Aa ticket ID ge complaint sigalilla.",
    schedule: "Pickup schedule simulation: wet waste daily 7am-10am, dry waste Tue/Thu/Sat 10am-2pm, e-waste Friday 3pm-6pm.",
    segregation: "Segregation guide: wet waste green bin, dry recyclable blue bin, hazardous red bin, e-waste bereyaagi ittkolli.",
    help: "Quick options: Track complaint, Register complaint, Pickup schedule, Segregation help."
  }
};

export function getText(language = "en") {
  return TEXTS[language] || TEXTS.en;
}
