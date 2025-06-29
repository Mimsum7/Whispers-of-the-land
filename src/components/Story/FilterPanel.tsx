import React from 'react';
import { Search, Filter } from 'lucide-react';
import { FilterOptions, LANGUAGES, COUNTRIES, THEMES } from '../../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ language: '', country: '', theme: '', search: '' });
  };

  return (
    <div className="bg-cream-50 border-2 border-ochre-200 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-forest-700 flex items-center">
          <Filter className="h-5 w-5 mr-2 text-ochre-500" />
          Filter Stories
        </h2>
        <button
          onClick={clearFilters}
          className="text-sm text-clay-600 hover:text-clay-700 underline transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-forest-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search stories..."
              className="w-full pl-10 pr-4 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">Language</label>
          <select
            value={filters.language}
            onChange={(e) => updateFilter('language', e.target.value)}
            className="w-full px-3 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
          >
            <option value="">All Languages</option>
            {LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">Country</label>
          <select
            value={filters.country}
            onChange={(e) => updateFilter('country', e.target.value)}
            className="w-full px-3 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
          >
            <option value="">All Countries</option>
            {COUNTRIES.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-forest-700 mb-2">Theme</label>
          <select
            value={filters.theme}
            onChange={(e) => updateFilter('theme', e.target.value)}
            className="w-full px-3 py-2 border border-ochre-300 rounded-lg focus:ring-2 focus:ring-ochre-400 focus:border-transparent"
          >
            <option value="">All Themes</option>
            {THEMES.map(theme => (
              <option key={theme} value={theme}>{theme}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;