import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, BookOpen, Tag } from 'lucide-react';
import { Story } from '../../types';
import PatternBorder from '../Common/PatternBorder';

interface StoryCardProps {
  story: Story;
}

const StoryCard: React.FC<StoryCardProps> = ({ story }) => {
  return (
    <Link to={`/story/${story.id}`} className="block group">
      <PatternBorder className="h-full">
        <div className="p-6 h-full flex flex-col transition-transform duration-200 group-hover:scale-105">
          {story.illustration_url && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img 
                src={story.illustration_url} 
                alt={story.title}
                className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          
          <h3 className="text-xl font-bold text-forest-700 mb-3 font-serif group-hover:text-forest-600 transition-colors">
            {story.title}
          </h3>
          
          <div className="space-y-2 mb-4 flex-grow">
            <div className="flex items-center text-sm text-forest-600">
              <MapPin className="h-4 w-4 mr-2 text-clay-500" />
              <span className="font-medium">{story.country}</span>
            </div>
            
            <div className="flex items-center text-sm text-forest-600">
              <Globe className="h-4 w-4 mr-2 text-clay-500" />
              <span>{story.language}</span>
            </div>
            
            <div className="flex items-center text-sm text-forest-600">
              <Tag className="h-4 w-4 mr-2 text-clay-500" />
              <span className="bg-ochre-100 text-ochre-800 px-2 py-1 rounded-full text-xs font-medium">
                {story.theme}
              </span>
            </div>
          </div>
          
          <div className="text-sm text-forest-500 border-t border-ochre-200 pt-3">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>By {story.contributor}</span>
            </div>
          </div>
        </div>
      </PatternBorder>
    </Link>
  );
};

export default StoryCard;