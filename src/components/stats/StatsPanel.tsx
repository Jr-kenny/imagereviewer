import React from 'react';
import { BarChart3, TrendingUp, Image as ImageIcon, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageRecord } from '../../types';
import { Badge } from '../shared/Badge';

interface StatsPanelProps {
  images: ImageRecord[];
}

export function StatsPanel({ images }: StatsPanelProps) {
  if (!images || images.length === 0) return null;

  const totalImages = images.length;
  const averageRating = images.reduce((sum, img) => sum + img.analysis.rating, 0) / totalImages;

  const rarityCount = images.reduce(
    (acc, img) => {
      acc[img.analysis.rarity] = (acc[img.analysis.rarity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const tagCount = images.reduce((acc, img) => {
    img.analysis.style_tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topTags = Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const statCards = [
    {
      icon: ImageIcon,
      label: 'Total Images',
      value: totalImages.toString(),
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Star,
      label: 'Average Rating',
      value: averageRating.toFixed(1),
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: TrendingUp,
      label: 'Unique Images',
      value: (rarityCount['unique'] || 0).toString(),
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Rarity Distribution</h3>
          </div>
          <div className="space-y-3">
            {(['unique', 'rare', 'common'] as const).map((rarity) => {
              const count = rarityCount[rarity] || 0;
              const percentage = (count / totalImages) * 100;
              return (
                <div key={rarity}>
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="rarity" rarity={rarity}>
                      {rarity}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${
                        rarity === 'unique'
                          ? 'from-amber-400 to-orange-600'
                          : rarity === 'rare'
                          ? 'from-blue-400 to-purple-600'
                          : 'from-gray-400 to-gray-600'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Top Style Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {topTags.map(([tag, count]) => (
              <div
                key={tag}
                className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-2"
              >
                <Badge variant="tag">{tag}</Badge>
                <span className="text-xs text-gray-400">{count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
