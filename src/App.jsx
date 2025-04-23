import PodcastCard from './components/PodcastCard';
import { getValidColorCombinations } from './colorUtils';
import { bookSummaries } from './bookData'; // Import book data
import './App.css'

function App() {
  const colorCombinations = getValidColorCombinations();
  const numBooks = bookSummaries.length;

  return (
    // Use flex column layout centered
    <div className="min-h-screen w-full p-8 bg-white flex flex-col items-center">
      
      {/* Container for the single column list with gap */}
      <div className="flex flex-col gap-8 items-center">
        {colorCombinations.map((combo, index) => {
          // Cycle through book data using modulo operator
          const bookIndex = index % numBooks;
          const book = bookSummaries[bookIndex];
          
          return (
            <PodcastCard 
              key={`${book.id}-${index}`} // More unique key
              bgClass={combo.bgClass} 
              textClass={combo.textClass} 
              title={book.title}
              author={book.author}
              tagline={book.tagline}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
