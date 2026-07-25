// Local-file fallback. GitHub Pages uses faqs.json; file:// previews cannot fetch it.
window.locustFaqs = [
  ["Where can I download the app?", "Download the Locust app from the App Store or Google Play.", ["download", "install", "app store", "apple", "iphone", "ios", "google play", "android"], "faq/download-app.html", "View download options"],
  ["Can I continue to use Locust on the web?", "Yes. Locust will continue to support the v2 module on the web.", ["web", "website", "browser", "desktop", "computer", "online", "locust v2"], "faq/use-locust-on-web.html", "Learn about web access"],
  ["How do I find the meeting for field service (MFS)?", "Use the video guide to find your upcoming meeting for field service, review its details, and get directions.", ["mfs", "meeting for field service", "field service", "service meeting", "meeting", "directions"], "#find-meeting", "Watch the meeting guide"],
  ["Where do I find emergency, parking, and other information for my shift?", "", ["emergency", "parking", "shift information", "shift details", "instructions", "safety", "notes"], "", ""],
  ["How do I map or navigate to the emergency locations on my shift?", "", ["map", "navigate", "navigation", "directions", "emergency location", "address", "route", "maps", "shift"], "", ""],
  ["Where do I view all my shifts?", "See where to find all your upcoming and previous shifts in one place.", ["shifts", "my shifts", "schedule", "calendar", "upcoming", "previous", "accepted shifts"], "faq/view-all-shifts.html", "View the shifts guide"],
  ["Where do I set time away?", "Use time away to mark dates when you are unavailable to volunteer.", ["time away", "away", "vacation", "unavailable", "absence", "dates", "leave"], "faq/set-time-away.html", "View the time away guide"],
  ["Where do I change my availability?", "Follow the guide to review and update your regular availability.", ["availability", "available", "schedule", "days", "times", "hours", "change availability"], "faq/change-availability.html", "View the availability guide"],
  ["I am a new volunteer. How do I access other locations in the app?", "", ["new volunteer", "other locations", "access location", "join location", "add location", "manage locations"], "#manage-location", "Watch the location guide"],
  ["I locked myself out of my Locust account. What should I do?", "Try the sign-in checks and password-reset steps in the sign-in guide.", ["locked out", "lockout", "cannot login", "sign in", "login", "password", "reset password", "account"], "faq/sign-in-help.html", "View sign-in help"],
  ["What is the difference between Assigned Locations and Favorite Locations?", "", ["assigned locations", "favorite locations", "favourite locations", "assigned", "favorite", "locations"], "", ""],
  ["Can I favorite locations where I frequently schedule shifts?", "", ["favorite", "favourite", "frequent locations", "save location", "bookmark", "preferred location", "schedule shifts"], "", ""],
  ["What do orange and blue shifts mean when key men are needed?", "", ["orange", "blue", "shift colors", "colours", "key men", "keyman", "color meaning", "legend"], "", ""],
  ["What will happen to shifts I accepted on the website after August 1?", "", ["august 1", "aug 1", "accepted shifts", "website shifts", "existing shifts", "migration", "transfer"], "", ""],
  ["Everything looks different. Is there a video explaining how to use the app?", "Start with the essential video guides on this page for short walkthroughs of common Locust tasks.", ["video", "tutorial", "walkthrough", "overview", "different", "new app", "overwhelmed", "how to use", "training"], "#video-guides-title", "Browse the video guides"],
  ["Who should I contact for help using the app?", "Contact support and include what you were trying to do, what happened, and the device you were using.", ["contact", "support", "help", "person", "assistance", "training", "problem", "issue", "email"], "faq/contact-support.html", "View support options"]
].map(([question, answer, keywords, url, linkLabel], index) => ({
  id: `local-${index}`,
  importance: [5, 5, 5, 5, 5, 4, 4, 4, 4, 5, 3, 3, 4, 5, 4, 5][index],
  order: index + 1,
  question,
  answer,
  keywords,
  url,
  linkLabel
}));
