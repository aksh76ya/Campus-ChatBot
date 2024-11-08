// Check if browser supports Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Your browser does not support voice recognition. Please use a compatible browser like Chrome.");
} else {
    // Voice recognition function using Web Speech API
    function startVoiceRecognition() {
        const recognition = new SpeechRecognition();
        recognition.interimResults = false;  // We only want final results
        recognition.lang = 'en-US';  // Set language

        recognition.start();

        recognition.onstart = function() {
            console.log("Voice recognition started. Please speak...");
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            console.log("You said: " + transcript);
            sendMessage(transcript);  // Send the recognized voice as a message
        };

        recognition.onerror = function(event) {
            console.error('Voice recognition error:', event.error);
            alert('Voice recognition error: ' + event.error);
        };

        recognition.onspeechend = function() {
            recognition.stop();
            console.log("Speech recognition stopped.");
        };
    }

    // Attach the startVoiceRecognition function to the microphone button
    document.getElementById('voice-btn').addEventListener('click', startVoiceRecognition);
}

// Function to send a message (triggered by text or voice input)
function sendMessage(message) {
    const userInput = message || document.getElementById('user-input').value.trim();

    if (userInput === '') return; // Prevent sending empty messages

    // Display user's message
    displayMessage(userInput, 'user-message');

    // Get bot response using fuzzy matching and synonyms mapping
    const botResponse = getBotResponse(userInput);

    // Display bot's response
    setTimeout(() => displayMessage(botResponse, 'bot-message'), 500);

    // Clear the input field
    document.getElementById('user-input').value = '';
}

// Function to display messages in the chatbox
function displayMessage(message, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = className;
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);

    // Auto-scroll to the bottom
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Bot responses and keywords
const responses = {
    
    "hello": "Hello! How can I assist you today?",
    "help": "Sure, what do you need help with?",
    "campus": " Sathyabama is a prestigious institution which excels in the fields of Engineering, Science and Technology for more than three successful decades.",
    "library": "The library is open from 9 AM to 3.15 PM on weekdays for DayScholors (9 AM to 7PM  for Hostelers).",
    "events": "Upcoming events include a tech talk and cultural fest!(https://www.sathyabama.ac.in/events)",
    "bus routes for chennai city": "Here are the bus routes available for Chennai city...(https://www.sathyabama.ac.in/campus-life/transport-facility).",
    "bus avaible for t nagar": "Yes, there is a bus service to T. Nagar. It runs daily.",
    "first bus from tambaram": "The first bus leaves from Tambaram at 6:00 AM.",
    "check the bus schedule": "You can check the bus schedule at the transport office or on the official app(https://www.sathyabama.ac.in/campus-life/transport-facility).",
    "buses available on sundays": "No, there are no  buses available on Sundays.",
    "bus from velachery": "You can take Route 7 from Velachery to reach the campus.",
    "bus route to anna nagar": "The bus route to Anna Nagar is Route 5.",
    "transportation from thiruvanmiyur": "Yes, transportation is available from Thiruvanmiyur.",
    "bus fare from mount road ": "The bus fare from Mount Road to the campus is ₹50.",
    "shuttle service within campus": "Yes, there is a shuttle service that runs between different blocks on campus.",
    "buses during exam weeks": "Yes, buses operate during exam weeks as well.",
    "what is bus  fee structure ": "Sathayabama Institute of Science and Technology provides free buses all over chennai  .",
    " Is Mess Avaible ": " Sathyabama provides free food for all students. In the mess hall near the canteen for boys and near block 18 for girls .",
    "bus transport available for chennai": "Yes, bus transport is available for all areas of Chennai.",
    "late buses from campus": "No, Late buses are avaible ",
    "find bus timings": "Bus timings can be found at the transport office or online Link:(https://www.sathyabama.ac.in/campus-life/transport-facility).",
    "private transport services": "No, there are no private transport services linked to the campus.",
    "bus service during holidays": "Bus services are not available on public holidays.",
    "transport complaints": "You can raise transport-related complaints at the transport office.",
    "lost and found on bus": "For lost and found on the campus bus, please contact the transport office.",
    "full name of the college": "The full name is Sathyabama Institute of Science and Technology.",
    "history of sathyabama institute": "Sathyabama Institute was founded in 1987 by Dr. Jeppiaar.",
    "branches of study available": "We offer courses in engineering, management, architecture, and more.",
    "departments in college": "We have 15 departments including cse, Mechanical, ECE, and more.",
    "founder of sathyabama university": "The founder is Dr. Jeppiaar.",
    "information about management": "The management team consists of the Chancellor, Vice Chancellor, and Deans.",
    "major events organized by the college": "The major events include cultural fest, tech fest, and sports day.",
    "helpdesk for new students": "Yes, there is a helpdesk for new students near the admissions office.",
    "courses offered": "You can find details about the courses on the official website (https://www.sathyabama.ac.in/).",
    "contact the administration": "You can contact the administration at admin@sathyabama.ac.in.",
    "distance education": "Yes, the college offers distance education programs.",
    "college working hours": "The working hours are from 9:00 AM to 3:15 PM.",
    "admissions office location": "The admissions office is located near Block 1.",
    "contact details of the college": "The contact number is 044-245011092.",
    "college ID card procedure": "You can get your ID card at the student services office near block 1.",
    "administration email id": "The email ID is admin@sathyabama.ac.in.",
    "visit campus before admissions": "Yes, campus visits are allowed before admissions with prior appointment.",
    "hostel facilities": "Yes, hostel facilities are available for boys and girls.",
    "upcoming cultural events": "You can find the list of upcoming events on the college website (https://www.sathyabama.ac.in/events).",
    "alumni association": "Yes, we have an active alumni association.",
    
    // Other categories of queries follow the same pattern...
};


// Synonyms mapping for flexibility in word matching
const synonyms = {    "hi": "hello",
    "hey": "hello",
    "assist": "help",
    "support": "help",
    "school": "campus",
    "university": "campus",
    "fest": "events",
    "available bus routes for chennai": ["bus routes for chennai", "chennai bus routes", "bus services in chennai"],
    "bus service to t nagar": ["bus to t nagar", "route to t nagar", "t nagar bus"],
    "first bus from tambaram": ["early bus tambaram", "morning bus tambaram", "first bus tambaram"],
    "check the bus schedule": ["bus timings", "schedule of buses", "bus time"],
    "buses  on sundays": ["bus on sunday", "sunday bus availability", "sunday buses"],
    "bus from velachery": ["route from velachery", "velachery to campus", "bus velachery"],
    "bus route to anna nagar": ["anna nagar bus", "bus route anna nagar", "route to anna nagar"],
    "transportation from thiruvanmiyur": ["bus from thiruvanmiyur", "thiruvanmiyur transport", "thiruvanmiyur route"],
    "bus fare from mount road": ["mount road fare", "fare mount road", "mount road bus cost"],
    "shuttle service within campus": ["campus shuttle", "campus transport", "campus internal transport"],
    "buses during exam weeks": ["exam week bus", "bus during exams", "exam time buses"],
    "pay the bus fare online": ["online bus fare payment", "pay bus fare online"],
    "food mess": ["dining", "mess", "canteen", "lunch hall", "meal service"],
"food free for all": ["free food", "is food free", "mess food free", "food cost"],

// fixed closing quote
};



// Function to get the bot's response using fuzzy matching and synonyms
function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    const words = message.split(' ').map(word => synonyms[word] || word);
    const normalizedMessage = words.join(' ');

    let bestMatch = null;
    let bestDistance = Infinity;

    // Compare input with each keyword using Levenshtein Distance
    Object.keys(responses).forEach(keyword => {
        const distance = levenshteinDistance(keyword, normalizedMessage);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestMatch = keyword;
        }
    });

    // If the match is close enough, return the bot response
    if (bestDistance <= 3) {
        return responses[bestMatch];
    } else {
        return "Sorry, I don't understand that yet.";
    }
}

// Function to calculate Levenshtein Distance (fuzzy matching)
function levenshteinDistance(a, b) {
    const matrix = [];

    // Initialize the matrix
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,  // substitution
                    matrix[i][j - 1] + 1,      // insertion
                    matrix[i - 1][j] + 1       // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}
// Function to get the bot's response using substring matching and fuzzy matching
function getBotResponse(userMessage) {
  const message = userMessage.toLowerCase();
  const words = message.split(' ').map(word => synonyms[word] || word);
  const normalizedMessage = words.join(' ');

  // Check for exact substring match first
  let bestMatch = null;
  let bestDistance = Infinity;

  Object.keys(responses).forEach(keyword => {
      const normalizedKeyword = keyword.toLowerCase();
      
      // Check if user input is a substring of the keyword or vice versa
      if (normalizedKeyword.includes(normalizedMessage) || normalizedMessage.includes(normalizedKeyword)) {
          bestMatch = keyword;
          bestDistance = 0;  // We found a good match, so no need to check distance
      }
  });

  // If no good substring match, fallback to Levenshtein Distance (fuzzy matching)
  if (!bestMatch) {
      Object.keys(responses).forEach(keyword => {
          const distance = levenshteinDistance(keyword, normalizedMessage);
          if (distance < bestDistance) {
              bestDistance = distance;
              bestMatch = keyword;
          }
      });
  }

  // Return the response if the match is good enough
  if (bestDistance <= 3 || bestMatch) {
      return responses[bestMatch];
  } else {
      return "Sorry, I don't understand that yet.";
  }
}