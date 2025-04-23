const tailwindColors = {
  // Reds
  'red-100': '#fee2e2',
  'red-200': '#fecaca',
  'red-300': '#fca5a5',
  'red-400': '#f87171',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'red-700': '#b91c1c',
  'red-800': '#991b1b',
  'red-900': '#7f1d1d',
  // Yellows
  'yellow-100': '#fef9c3',
  'yellow-200': '#fef08a',
  'yellow-300': '#fde047',
  'yellow-400': '#facc15',
  'yellow-500': '#eab308',
  'yellow-600': '#ca8a04',
  'yellow-700': '#a16207',
  'yellow-800': '#854d0e',
  'yellow-900': '#713f12',
  // Greens
  'green-100': '#dcfce7',
  'green-200': '#bbf7d0',
  'green-300': '#86efac',
  'green-400': '#4ade80',
  'green-500': '#22c55e',
  'green-600': '#16a34a',
  'green-700': '#15803d',
  'green-800': '#166534',
  'green-900': '#14532d',
  // Blues
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  'blue-300': '#93c5fd',
  'blue-400': '#60a5fa',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',
  'blue-800': '#1e40af',
  'blue-900': '#1e3a8a',
  // Indigos
  'indigo-100': '#e0e7ff',
  'indigo-200': '#c7d2fe',
  'indigo-300': '#a5b4fc',
  'indigo-400': '#818cf8',
  'indigo-500': '#6366f1',
  'indigo-600': '#4f46e5',
  'indigo-700': '#4338ca',
  'indigo-800': '#3730a3',
  'indigo-900': '#312e81',
  // Purples
  'purple-100': '#f3e8ff',
  'purple-200': '#e9d5ff',
  'purple-300': '#d8b4fe',
  'purple-400': '#c084fc',
  'purple-500': '#a855f7',
  'purple-600': '#9333ea',
  'purple-700': '#7e22ce',
  'purple-800': '#6b21a8',
  'purple-900': '#581c87',
  // Pinks
  'pink-100': '#fce7f3',
  'pink-200': '#fbcfe8',
  'pink-300': '#f9a8d4',
  'pink-400': '#f472b6',
  'pink-500': '#ec4899',
  'pink-600': '#db2777',
  'pink-700': '#be185d',
  'pink-800': '#9d174d',
  'pink-900': '#831843',
  // Fuchsia
  'fuchsia-100': '#fae8ff',
  'fuchsia-200': '#f5d0fe',
  'fuchsia-300': '#f0abfc',
  'fuchsia-400': '#e879f9',
  'fuchsia-500': '#d946ef',
  'fuchsia-600': '#c026d3',
  'fuchsia-700': '#a21caf',
  'fuchsia-800': '#86198f',
  'fuchsia-900': '#701a75',
};

// Function to calculate relative luminance
function getLuminance(hexColor) {
  const rgb = parseInt(hexColor.slice(1), 16); // Convert hex to integer
  const r = ((rgb >> 16) & 0xff) / 255;
  const g = ((rgb >> 8) & 0xff) / 255;
  const b = (rgb & 0xff) / 255;

  const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

// Function to calculate contrast ratio
function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);

  const lighterLum = Math.max(lum1, lum2);
  const darkerLum = Math.min(lum1, lum2);

  return (lighterLum + 0.05) / (darkerLum + 0.05);
}

// Helper function to get color family (e.g., 'red' from 'bg-red-500')
function getColorFamily(className) {
  const parts = className.split('-');
  if (parts.length >= 2) {
    return parts[1]; // Assumes format 'prefix-family-shade'
  }
  return null; 
}

// Helper function to get color shade (e.g., 500 from 'bg-red-500')
function getColorShade(className) {
  const parts = className.split('-');
  if (parts.length >= 3) {
    const shade = parseInt(parts[2], 10);
    return isNaN(shade) ? null : shade;
  }
  return null; 
}

// Function to generate and sort valid color combinations
export function getValidColorCombinations() {
  let allCombinations = [];
  const colorNames = Object.keys(tailwindColors);

  // 1. Generate valid combinations, filtering background shades
  for (const bgName of colorNames) {
    // *** Filter background colors: Skip shades 100 and 200 ***
    const bgShade = getColorShade(`bg-${bgName}`);
    if (bgShade !== null && bgShade < 300) {
        continue; // Skip if background shade is less than 300
    }

    for (const textName of colorNames) {
      if (bgName === textName) continue; 

      const bgColorHex = tailwindColors[bgName];
      const textColorHex = tailwindColors[textName];
      const contrast = getContrastRatio(bgColorHex, textColorHex);

      if (contrast >= 4.5) {
        const bgClass = `bg-${bgName}`;
        const textClass = `text-${textName}`;
        allCombinations.push({ 
          bgClass: bgClass,
          textClass: textClass,
          bgFamily: getColorFamily(bgClass),
          textFamily: getColorFamily(textClass),
          bgLuminance: getLuminance(bgColorHex),
        });
      }
    }
  }

  if (allCombinations.length <= 1) {
    return allCombinations.map(combo => ({ bgClass: combo.bgClass, textClass: combo.textClass }));
  }

  // 2. Sort with Penalties and Randomized Tie-breaker
  let availableCombinations = [...allCombinations];
  let sortedCombinations = [];
  let recentBgFamilies = [];
  let recentTextFamilies = [];
  const RECENT_LIST_SIZE = 5;
  const FAMILY_PENALTY = 2;

  const updateRecentList = (list, newItem) => {
    if (newItem) {
      list.unshift(newItem);
      if (list.length > RECENT_LIST_SIZE) list.pop();
    }
  };

  let firstCombo = availableCombinations.shift();
  sortedCombinations.push(firstCombo);
  updateRecentList(recentBgFamilies, firstCombo.bgFamily);
  updateRecentList(recentTextFamilies, firstCombo.textFamily);

  while (availableCombinations.length > 0) {
    const lastCombo = sortedCombinations[sortedCombinations.length - 1];
    
    let bestCandidateIndices = []; // Store indices of tied best candidates
    let bestScore = -Infinity;

    for (let i = 0; i < availableCombinations.length; i++) {
      const candidate = availableCombinations[i];
      let currentScore = 0;
      const bgFamilyChanged = candidate.bgFamily !== lastCombo.bgFamily;
      const textFamilyChanged = candidate.textFamily !== lastCombo.textFamily;

      // Base score
      if (bgFamilyChanged && textFamilyChanged) currentScore = 3;
      else if (bgFamilyChanged) currentScore = 2;
      else if (textFamilyChanged) currentScore = 1;

      // Penalties
      if (recentBgFamilies.includes(candidate.bgFamily)) currentScore -= FAMILY_PENALTY;
      if (recentTextFamilies.includes(candidate.textFamily)) currentScore -= FAMILY_PENALTY;

      // Check if this candidate is better than or equal to the current best
      if (currentScore > bestScore) {
        bestScore = currentScore;
        bestCandidateIndices = [i]; // New best, reset ties
      } else if (currentScore === bestScore) {
        bestCandidateIndices.push(i); // Tied with best, add to ties
      }
    }

    let finalChosenIndex;
    // If there was a tie, pick randomly from the tied candidates
    if (bestCandidateIndices.length > 1) {
      const randomIndex = Math.floor(Math.random() * bestCandidateIndices.length);
      finalChosenIndex = bestCandidateIndices[randomIndex];
    } else if (bestCandidateIndices.length === 1) {
        finalChosenIndex = bestCandidateIndices[0]; // Only one best candidate
    } else {
         // Fallback: Should not happen if availableCombinations > 0
         // If it does, just pick the first available to avoid error
         finalChosenIndex = 0; 
    }
     
    // Add the chosen combination and update recent lists
    let chosenCombo = availableCombinations[finalChosenIndex];
    sortedCombinations.push(chosenCombo);
    updateRecentList(recentBgFamilies, chosenCombo.bgFamily);
    updateRecentList(recentTextFamilies, chosenCombo.textFamily);
    availableCombinations.splice(finalChosenIndex, 1);
  }

  // Return only the class names
  return sortedCombinations.map(combo => ({ 
    bgClass: combo.bgClass, 
    textClass: combo.textClass 
  })); 
} 