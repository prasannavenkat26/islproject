export interface Sign {
  id: string;
  name: string;
  category: 'alphabet' | 'number' | 'word';
  emoji: string;
  description: string;
  tips?: string;
}

export const SIGNS: Sign[] = [
  // Alphabets A-Z
  { id: 'a', name: 'A', category: 'alphabet', emoji: '🅰️', description: 'Make a fist with your thumb resting on the side of your index finger.', tips: 'Keep fingers tight together.' },
  { id: 'b', name: 'B', category: 'alphabet', emoji: '🅱️', description: 'Hold up four fingers straight, thumb folded across the palm.', tips: 'Fingers should be straight and tight.' },
  { id: 'c', name: 'C', category: 'alphabet', emoji: '©️', description: 'Curve all fingers and thumb to form the letter C shape.', tips: 'Shape should look like an open C.' },
  { id: 'd', name: 'D', category: 'alphabet', emoji: '🇩', description: 'Raise index finger straight up, touch thumb to other three fingers forming a circle.', tips: 'The circle should be clearly visible.' },
  { id: 'e', name: 'E', category: 'alphabet', emoji: '🇪', description: 'Curl all fingers into the palm with thumb resting across them.', tips: 'Similar to A but with fingers bent more.' },
  { id: 'f', name: 'F', category: 'alphabet', emoji: '🇫', description: 'Touch thumb and index finger to form a circle, raise the other three fingers.', tips: 'Circle should be tight.' },
  { id: 'g', name: 'G', category: 'alphabet', emoji: '🇬', description: 'Extend index finger to the side, thumb above it pointing the same direction.', tips: 'Like a gun shape pointing sideways.' },
  { id: 'h', name: 'H', category: 'alphabet', emoji: '🇭', description: 'Extend index and middle finger to the side, thumb underneath.', tips: 'Two fingers parallel to the ground.' },
  { id: 'i', name: 'I', category: 'alphabet', emoji: '🇮', description: 'Raise pinky finger, fold other fingers and thumb into palm.', tips: 'Only the smallest finger is up.' },
  { id: 'j', name: 'J', category: 'alphabet', emoji: '🇯', description: 'Same as I, but trace the letter J in the air with your pinky.', tips: 'Move in a J shape motion.' },
  { id: 'k', name: 'K', category: 'alphabet', emoji: '🇰', description: 'Raise index and middle finger in a V, place thumb between them.', tips: 'Like a peace sign with thumb between fingers.' },
  { id: 'l', name: 'L', category: 'alphabet', emoji: '🇱', description: 'Raise index finger straight up, thumb out to the side forming an L.', tips: 'Clear L shape.' },
  { id: 'm', name: 'M', category: 'alphabet', emoji: '🇲', description: 'Fold thumb under three fingers (index, middle, ring).', tips: 'Three fingers over the thumb.' },
  { id: 'n', name: 'N', category: 'alphabet', emoji: '🇳', description: 'Fold thumb under two fingers (index and middle).', tips: 'Two fingers over the thumb.' },
  { id: 'o', name: 'O', category: 'alphabet', emoji: '🇴', description: 'Touch all fingertips together to form a circle.', tips: 'All fingers form a round O shape.' },
  { id: 'p', name: 'P', category: 'alphabet', emoji: '🇵', description: 'Like K but pointing downward.', tips: 'Fingers point toward the floor.' },
  { id: 'q', name: 'Q', category: 'alphabet', emoji: '🇶', description: 'Like G but pointing downward.', tips: 'Index and thumb point toward the floor.' },
  { id: 'r', name: 'R', category: 'alphabet', emoji: '🇷', description: 'Cross index and middle finger, fold the rest.', tips: 'Classic crossed fingers sign.' },
  { id: 's', name: 'S', category: 'alphabet', emoji: '🇸', description: 'Make a fist with thumb across the front of the fingers.', tips: 'Tight fist, thumb visible.' },
  { id: 't', name: 'T', category: 'alphabet', emoji: '🇹', description: 'Make a fist, thumb stuck up between index and middle fingers.', tips: 'Thumb pokes through the fingers.' },
  { id: 'u', name: 'U', category: 'alphabet', emoji: '🇺', description: 'Raise index and middle finger together, held tight.', tips: 'Two fingers straight up together.' },
  { id: 'v', name: 'V', category: 'alphabet', emoji: '🇻', description: 'Raise index and middle finger in a V shape, like a peace sign.', tips: 'Fingers spread apart in V.' },
  { id: 'w', name: 'W', category: 'alphabet', emoji: '🇼', description: 'Raise index, middle, and ring finger, fold pinky and thumb.', tips: 'Three fingers spread apart.' },
  { id: 'x', name: 'X', category: 'alphabet', emoji: '🇽', description: 'Bend index finger like a hook, fold the rest.', tips: 'Hook shape with index finger.' },
  { id: 'y', name: 'Y', category: 'alphabet', emoji: '🇾', description: 'Extend thumb and pinky, fold the three middle fingers.', tips: 'Like a hang loose sign.' },
  { id: 'z', name: 'Z', category: 'alphabet', emoji: '🇿', description: 'Raise index finger and trace the letter Z in the air.', tips: 'Trace a Z motion with the finger.' },
  // Numbers 0-9
  { id: 'n0', name: '0', category: 'number', emoji: '0️⃣', description: 'Form an O shape with all fingertips touching.', tips: 'Same as letter O.' },
  { id: 'n1', name: '1', category: 'number', emoji: '1️⃣', description: 'Raise only index finger, fold the rest.', tips: 'Single finger up.' },
  { id: 'n2', name: '2', category: 'number', emoji: '2️⃣', description: 'Raise index and middle finger together.', tips: 'Two fingers up.' },
  { id: 'n3', name: '3', category: 'number', emoji: '3️⃣', description: 'Raise thumb, index, and middle finger.', tips: 'Three fingers including thumb.' },
  { id: 'n4', name: '4', category: 'number', emoji: '4️⃣', description: 'Raise all four fingers, fold thumb.', tips: 'Four fingers straight up.' },
  { id: 'n5', name: '5', category: 'number', emoji: '5️⃣', description: 'Open palm with all five fingers spread.', tips: 'Full open hand.' },
  { id: 'n6', name: '6', category: 'number', emoji: '6️⃣', description: 'Touch thumb and pinky, raise other fingers.', tips: 'Like a phone shape.' },
  { id: 'n7', name: '7', category: 'number', emoji: '7️⃣', description: 'Touch thumb and index finger, raise others.', tips: 'Similar to F but looser.' },
  { id: 'n8', name: '8', category: 'number', emoji: '8️⃣', description: 'Touch thumb and middle finger, raise others.', tips: 'Spread remaining fingers.' },
  { id: 'n9', name: '9', category: 'number', emoji: '9️⃣', description: 'Touch thumb and ring finger, raise others.', tips: 'Fingers spread open.' },
  // Common words
  { id: 'hello', name: 'Hello', category: 'word', emoji: '👋', description: 'Open palm, wave side to side near your forehead.', tips: 'Like a friendly wave.' },
  { id: 'thankyou', name: 'Thank You', category: 'word', emoji: '🙏', description: 'Touch chin with fingertips of flat hand, move hand forward and down.', tips: 'Move from chin toward the person.' },
  { id: 'please', name: 'Please', category: 'word', emoji: '🤲', description: 'Place flat palm on chest, move in a small circle.', tips: 'Circular motion on chest.' },
  { id: 'sorry', name: 'Sorry', category: 'word', emoji: '😔', description: 'Make a fist, place on chest, rotate in circles.', tips: 'A-S-L motion on chest.' },
  { id: 'yes', name: 'Yes', category: 'word', emoji: '✅', description: 'Make a fist, move up and down like nodding.', tips: 'Like a head nod but with your fist.' },
  { id: 'no', name: 'No', category: 'word', emoji: '❌', description: 'Touch index and middle finger to thumb, then snap apart.', tips: 'Like a mouth snapping shut.' },
  { id: 'help', name: 'Help', category: 'word', emoji: '🆘', description: 'Make a fist with thumb up, place on flat palm of other hand, lift both up.', tips: 'Both hands move up together.' },
  { id: 'water', name: 'Water', category: 'word', emoji: '💧', description: 'Make a W shape, touch chin, then move forward slightly.', tips: 'W handshape near the mouth.' },
  { id: 'food', name: 'Food', category: 'word', emoji: '🍽️', description: 'Touch fingertips to lips, move hand down and repeat.', tips: 'Like bringing food to mouth.' },
  { id: 'good', name: 'Good', category: 'word', emoji: '👍', description: 'Thumbs up gesture, move hand forward slightly.', tips: 'Classic thumbs up.' },
  { id: 'bad', name: 'Bad', category: 'word', emoji: '👎', description: 'Flat hand, fingertips on chin, flip hand downward.', tips: 'Hand flips down from chin.' },
  { id: 'family', name: 'Family', category: 'word', emoji: '👨‍👩‍👧‍👦', description: 'Make two F handshapes, form a circle, then move forward.', tips: 'Fingers interlock to form family circle.' },
  { id: 'friend', name: 'Friend', category: 'word', emoji: '🤝', description: 'Hook index fingers together, reverse, and hook again.', tips: 'Two hands with hooked index fingers.' },
  { id: 'doctor', name: 'Doctor', category: 'word', emoji: '🩺', description: 'Make a D shape, touch wrist like taking a pulse.', tips: 'D handshape on inner wrist.' },
  { id: 'emergency', name: 'Emergency', category: 'word', emoji: '🚨', description: 'Make an E handshape, move in a circular motion on your chest.', tips: 'Urgent circular motion.' },
];

export const CATEGORIES = [
  { id: 'all', label: 'All', icon: '📋' },
  { id: 'alphabet', label: 'Alphabets', icon: '🔤' },
  { id: 'number', label: 'Numbers', icon: '🔢' },
  { id: 'word', label: 'Words', icon: '💬' },
] as const;

// Demo mode signs (rule-based gesture recognition)
export const DEMO_SIGNS = [
  { name: 'Hello', gesture: 'open_palm', emoji: '👋' },
  { name: 'Yes', gesture: 'fist', emoji: '✊' },
  { name: 'Good', gesture: 'thumbs_up', emoji: '👍' },
  { name: 'You', gesture: 'point', emoji: '👉' },
  { name: 'Peace', gesture: 'victory', emoji: '✌️' },
];
