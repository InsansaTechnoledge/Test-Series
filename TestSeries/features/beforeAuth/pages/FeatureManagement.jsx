import React, { useState } from 'react';
import { 
  Users, UserPlus, Shield, Database, Calendar, FileText, 
  Award, Eye, Clock, Mail, Video, BarChart3, Code, 
  Settings, Target, Brain, CheckCircle, AlertTriangle,
  Camera, Smartphone, Monitor, ArrowRight, Sparkles,
  GraduationCap, Building, Play, Cloud, Youtube,
  TrendingUp, PieChart, Activity, Bell, Zap, Bot,
  LineChart, Download, Filter, Upload, Table, Search,
  Wifi, Globe, MessageSquare, Star, Bookmark
} from 'lucide-react';

import { allFeatures, categories } from '../data/FeaturesData';

const FeaturesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  

  const filteredFeatures = allFeatures.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || feature.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Basic': return 'bg-green-100 text-green-700 border-green-200';
      case 'Pro': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Enterprise': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category) => {
    const categoryMap = {
      'Organization': 'from-indigo-600 to-blue-600',
      'Examination': 'from-gray-700 to-gray-800',
      'Student Experience': 'from-indigo-600 to-blue-600',
      'Analytics': 'from-emerald-600 to-teal-600',
      'Security': 'from-red-600 to-pink-600',
      'Integration': 'from-purple-600 to-violet-600'
    };
    return categoryMap[category] || 'from-gray-600 to-gray-700';
  };

  return (
    <div className="min-h-screen ">
      <div className="px-16 mx-auto sm:px-6 lg:px-18 py-12">
        
        {/* Compact Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-7xl font-bold text-gray-800 mb-4">
            Complete Feature{' '}
            <span className="bg-blue-600 bg-clip-text text-transparent">
              Suite
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto">
            Discover all powerful features in our comprehensive examination and learning management platform.
          </p>
        </div>

        {/* Compact Controls */}
        <div className="backdrop-blur-sm rounded-2xl p-4 mb-8 ">
          <div className="flex justify-center gap-4">
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.title}
                  onClick={() => setSelectedCategory(category.title)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === category.title
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mb-8">
          {filteredFeatures.map((feature, index) => {
        
          
            return (
              <div 
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2.5 rounded-lg bg-gradient-to-r ${getCategoryColor(feature.category)} shadow-lg group-hover:scale-110 transition-transform`}>
                   
                    <img src={feature.icon} width={20}></img>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getTierColor(feature.tier)}`}>
                    {feature.tier}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-sm font-bold text-violet-900 mb-2 line-clamp-1">
                  {feature.title}
                </h3>
                
                <p className="text-gray-700 text-xs leading-relaxed mb-3 line-clamp-2">
                  {feature.description}
                </p>

                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {feature.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-600">Available</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredFeatures.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No features found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default FeaturesPage;