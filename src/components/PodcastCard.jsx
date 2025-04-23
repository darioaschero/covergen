import React from 'react';

function PodcastCard() {
  return (
    <div className="w-96 h-96 bg-pink-900 px-5 py-4 rounded-lg flex flex-col justify-between">
      <div className="text-left">
        <div className="font-bold text-6xl mb-2 text-fuchsia-400 leading-none tracking-tight">Deep Work</div>
        <p className="text-fuchsia-400 text-lg">
          by Cal Newport
        </p>
      </div>
      <p className="text-fuchsia-400 text-lg self-end text-right leading-tight mb-1">
        Rules for Focused Success<br/>in a Distracted World
      </p>
    </div>
  );
}

export default PodcastCard; 