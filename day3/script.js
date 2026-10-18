// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

/**
 * 1. searchNotes(word)
 * Uses filter, toLowerCase, and includes.
 */
function searchNotes(word) {
  const searchTerm = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
}

/**
 * 2. longestNote()
 * Handles empty array check first, then compares lengths via loop.
 */
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];
  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }
  return longest;
}

/**
 * 3. countByCategory()
 * Loops over notes and increments counters inside an object.
 */
function countByCategory() {
  const counts = {};

  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}

/**
 * 4. getSummary()
 * Uses countByCategory, a template literal, and pluralizes "note" vs "notes".
 */
function getSummary() {
  const total = notes.length;
  const noteWord = total === 1 ? "note" : "notes";
  const counts = countByCategory();

  const breakdowns = Object.entries(counts).map(
    ([category, count]) => `${count} ${category}`
  );

  return `${total} ${noteWord}: ${breakdowns.join(", ")}.`;
}

/**
 * 5. isDuplicate(text)
 * Uses some(), comparing trimmed, lower-case text.
 */
function isDuplicate(text) {
  const normalized = text.trim().toLowerCase();
  return notes.some(
    (note) => note.text.trim().toLowerCase() === normalized
  );
}

/**
 * 6. addNote(text, category)
 * Validates length (1-200), category validity, and duplicates (via isDuplicate).
 * Returns true if added, false otherwise while logging the reason.
 */
function addNote(text, category) {
  const validCategories = ["personal", "work", "study"];
  const trimmed = typeof text === "string" ? text.trim() : "";

  if (trimmed.length < 1 || trimmed.length > 200) {
    console.warn("Failed: Note text must be between 1 and 200 characters.");
    return false;
  }

  if (!validCategories.includes(category)) {
    console.warn(`Failed: "${category}" is not a valid category (personal, work, study).`);
    return false;
  }

  if (isDuplicate(trimmed)) {
    console.warn(`Failed: A note with the text "${trimmed}" already exists.`);
    return false;
  }

  const nextId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1;
  const newNote = {
    id: nextId,
    text: trimmed,
    category: category,
  };

  notes.push(newNote);
  return true;
}

// ==========================================
// Tests & Expected Outputs
// ==========================================

console.log("=== 1. searchNotes tests ===");
// Normal case: matches one or more notes
console.log(searchNotes("report")); 
// Expected output: [ { id: 3, text: 'Email the project report to Grace', category: 'work' } ]

// Edge case: word not present in any note
console.log(searchNotes("python")); 
// Expected output: []


console.log("\n=== 2. longestNote tests ===");
// Normal case: returns the object with the longest text
console.log(longestNote()); 
// Expected output: { id: 3, text: 'Email the project report to Grace', category: 'work' }

// Edge case: handling an empty array
const savedNotes = notes;
notes = [];
console.log(longestNote()); 
// Expected output: null
notes = savedNotes; // Restore original data


console.log("\n=== 3. countByCategory tests ===");
// Normal case: counts the categories across our starting array
console.log(countByCategory()); 
// Expected output: { personal: 2, study: 2, work: 1 }

// Edge case: counting categories when array has single item
const tempNotes = notes;
notes = [{ id: 99, text: "Solo task", category: "work" }];
console.log(countByCategory()); 
// Expected output: { work: 1 }
notes = tempNotes; // Restore original data


console.log("\n=== 4. getSummary tests ===");
// Normal case: multiple notes (plural "notes")
console.log(getSummary()); 
// Expected output: "5 notes: 2 personal, 2 study, 1 work."

// Edge case: exactly 1 note (singular "note")
const backupNotes = notes;
notes = [{ id: 10, text: "Just one thing", category: "personal" }];
console.log(getSummary()); 
// Expected output: "1 note: 1 personal."
notes = backupNotes; // Restore original data


console.log("\n=== 5. isDuplicate tests ===");
// Normal case: exact duplicate match with different case and leading/trailing whitespace
console.log(isDuplicate("   CALL MUM   ")); 
// Expected output: true

// Edge case: novel text that does not exist
console.log(isDuplicate("Go grocery shopping")); 
// Expected output: false


console.log("\n=== 6. addNote tests ===");
// Normal case: adding a valid, unique note
console.log(addNote("Book dental checkup", "personal")); 
// Expected output: true

// Edge case 1: duplicate check failure
console.log(addNote("Call mum", "personal")); 
// Expected output: Failed: A note with the text "Call mum" already exists. -> false

// Edge case 2: invalid category failure
console.log(addNote("Fix leaking tap", "home")); 
// Expected output: Failed: "home" is not a valid category (personal, work, study). -> false

// Edge case 3: empty text failure (0 characters after trimming)
console.log(addNote("     ", "work")); 
// Expected output: Failed: Note text must be between 1 and 200 characters. -> false