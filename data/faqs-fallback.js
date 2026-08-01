// Local-file fallback. GitHub Pages uses faqs.json; file:// previews cannot fetch it.
window.locustFaqs = [
  ["Where can I download the app?", "Choose the App Store for an iPhone or Google Play for an Android device. Use the download buttons below to visit the correct store and install Locust.", ["download", "install", "app store", "apple", "iphone", "ios", "google play", "android"], "", ""],
  ["Can I continue to use Locust on the web?", "Yes. Locust will continue to support the v2 module on the web.", ["web", "website", "browser", "desktop", "computer", "online", "locust v2"], "faq/use-locust-on-web.html", "Learn about web access"],
  ["How do I find the meeting for field service (MFS)?", "Use the video guide to find your upcoming meeting for field service, review its details, and get directions.", ["mfs", "meeting for field service", "field service", "service meeting", "meeting", "directions"], "#find-meeting", "Watch the meeting guide"],
  ["Where do I find emergency, parking, and other information for my shift?", "To find emergency locations, parking, and other important information for your shift, open the location schedule for your assigned shift and look for the \"Location Info & Resources\" option.", ["emergency", "parking", "shift information", "shift details", "instructions", "safety", "notes"], "", ""],
  ["How do I navigate to the emergency locations on my shift?", "", ["map", "navigate", "navigation", "directions", "emergency location", "address", "route", "maps", "shift"], "", ""],
  ["Where do I view all my shifts?", "", ["shifts", "my shifts", "schedule", "calendar", "upcoming", "previous", "accepted shifts"], "", ""],
  ["Where do I set time away?", "", ["time away", "away", "vacation", "unavailable", "absence", "dates", "leave"], "", ""],
  ["Where do I change my availability?", "", ["availability", "available", "schedule", "days", "times", "hours", "change availability"], "", ""],
  ["I am a new volunteer. How do I access other locations in the app?", "", ["new volunteer", "other locations", "access location", "join location", "add location", "manage locations"], "#manage-location", "Watch the location guide"],
  ["I locked myself out of my Locust account. What should I do?", "Try these steps to regain access to your Locust account:", ["locked out", "lockout", "cannot login", "sign in", "login", "password", "reset password", "account"], "faq/sign-in-help.html", "View sign-in help"],
  ["What is the difference between Assigned Locations and Favorite Locations?", "", ["assigned locations", "favorite locations", "favourite locations", "assigned", "favorite", "locations"], "", ""],
  ["Can I favorite locations where I frequently schedule shifts?", "", ["favorite", "favourite", "frequent locations", "save location", "bookmark", "preferred location", "schedule shifts"], "", ""],
  ["What do orange and blue shifts mean when key men are needed?", "", ["orange", "blue", "shift colors", "colours", "key men", "keyman", "color meaning", "legend"], "", ""],
  ["What will happen to shifts I accepted on the website after August 1?", "Shifts you already accepted will still be accepted on the Locust website and app. If you need to cancel a shift, you can still do so through the app or website.", ["august 1", "aug 1", "accepted shifts", "website shifts", "existing shifts", "migration", "transfer"], "", ""],
  ["Everything looks different. Is there a video explaining how to use the app?", "", ["video", "tutorial", "walkthrough", "overview", "different", "new app", "overwhelmed", "how to use", "training"], "", ""],
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

const lockedOutFaq = window.locustFaqs.find((faq) => faq.question.startsWith('I locked myself out'));
if (lockedOutFaq) {
  lockedOutFaq.steps = [
    'Check that you are using the email address connected to your volunteer account.',
    'Check for extra spaces and confirm that Caps Lock is off.',
    'Select Forgot password? and follow the account-recovery instructions at https://locustspw.org/v2/login-help.',
    'Open the reset email and follow its secure link.',
    'If the email does not arrive, check your spam folder before contacting support.'
  ];
  lockedOutFaq.tip = 'Security tip: Support should never ask you to share your password.';
}
