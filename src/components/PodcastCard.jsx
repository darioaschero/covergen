import React from 'react';
import Balancer from 'react-wrap-balancer';

function PodcastCard({ bgClass, textClass, title, author, tagline }) {
  const validBgClass = bgClass || 'bg-gray-200';
  const validTextClass = textClass || 'text-black';
  const displayTitle = title || 'Podcast Title';
  const displayAuthor = author || 'Author Name';
  const displayTagline = tagline || 'Podcast tagline or description';

  return (
    <div className={`w-80 h-80 ${validBgClass} p-4 rounded-lg flex flex-col justify-between gap-4`}>
      <div className="text-left flex flex-col gap-1">
        <div className={`font-bold text-5xl ${validTextClass} leading-none tracking-tight`}>
          <Balancer>{displayTitle}</Balancer>
        </div>
        <p className={`${validTextClass} text-base font-medium`}>
          by {displayAuthor}
        </p>
      </div>
      <p className={`${validTextClass} text-base self-end text-right leading-tight font-medium`}>
        <Balancer>{displayTagline}</Balancer>
      </p>
    </div>
  );
}

export default PodcastCard; 