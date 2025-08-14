import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../../hooks/useTheme';
import MarkingScheme from '../../constants/MarkingScheme';

const MatchingQuestion = ({ selectedQuestion, option, setOption }) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [activeLeft, setActiveLeft] = useState(null); // for keyboard/click pairing
  const dragLeftRef = useRef(null);

  // Normalize incoming response to an object map { leftText: rightText }
  useEffect(() => {
    if (selectedQuestion) {
      setOption(
        selectedQuestion.response && typeof selectedQuestion.response === 'object'
          ? selectedQuestion.response
          : {}
      );
      setIsLoading(false);
      setActiveLeft(null);
    }
  }, [selectedQuestion, setOption]);

  // Shuffle right items once per question (stable across re-renders)
  const shuffledRightItems = useMemo(() => {
    const src = Array.isArray(selectedQuestion?.right_items)
      ? [...selectedQuestion.right_items]
      : [];
    for (let i = src.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [src[i], src[j]] = [src[j], src[i]];
    }
    return src;
  }, [selectedQuestion?.id]);

  if (isLoading || !selectedQuestion) return <div>Loading...</div>;

  // Helpers
  const isRightUsed = (rightText) =>
    Object.values(option || {}).includes(rightText);

  const handleAssign = (leftText, rightText) => {
    if (!leftText || !rightText) return;
    // Remove any existing mapping that already used this rightText
    const cleaned = Object.fromEntries(
      Object.entries(option || {}).filter(([, r]) => r !== rightText)
    );
    setOption({
      ...cleaned,
      [leftText]: rightText,
    });
  };

  const handleDropOnRight = (e, rightText) => {
    e.preventDefault();
    const leftText = e.dataTransfer.getData('text/plain');
    if (!leftText) return;
    handleAssign(leftText, rightText);
    setActiveLeft(null);
  };

  const handleDragStartLeft = (e, leftText) => {
    e.dataTransfer.setData('text/plain', leftText);
    dragLeftRef.current = leftText;
  };

  const handleDragEndLeft = () => {
    dragLeftRef.current = null;
  };

  const handleRightDragOver = (e) => {
    e.preventDefault(); // allow drop
  };

  const handleClickLeft = (leftText) => {
    setActiveLeft((prev) => (prev === leftText ? null : leftText));
  };

  const handleClickRight = (rightText) => {
    if (activeLeft) {
      handleAssign(activeLeft, rightText);
      setActiveLeft(null);
    }
  };

  const removePair = (leftText) => {
    const newMap = { ...(option || {}) };
    delete newMap[leftText];
    setOption(newMap);
  };

  const resetAll = () => {
    setOption({});
    setActiveLeft(null);
  };

  const containerBG =
    theme === 'light' ? 'bg-white text-gray-900' : 'bg-gray-900 text-white';

  const panelBG =
    theme === 'light'
      ? 'bg-gray-50 border-gray-200'
      : 'bg-gray-800 border-gray-700';

  const leftCard =
    theme === 'light'
      ? 'bg-white border-gray-300 hover:border-indigo-400'
      : 'bg-gray-800 border-gray-600 hover:border-indigo-500';

  const rightCard =
    theme === 'light'
      ? 'bg-white border-gray-300'
      : 'bg-gray-800 border-gray-600';

  const rightHighlight =
    theme === 'light'
      ? 'ring-2 ring-indigo-400'
      : 'ring-2 ring-indigo-500';

  const usedBadge =
    theme === 'light'
      ? 'bg-green-100 text-green-700 border-green-300'
      : 'bg-green-900/30 text-green-300 border-green-700';

  const activeLeftClass =
    theme === 'light'
      ? 'ring-2 ring-indigo-400'
      : 'ring-2 ring-indigo-500';

  return (
    <div className={`space-y-6 px-6 transition-all duration-300 ${containerBG}`}>
      <MarkingScheme selectedQuestion={selectedQuestion} theme={theme} />

      <div>
        <h3 className="font-bold text-xl leading-relaxed">
          Q{selectedQuestion.index}. Match the Following
        </h3>

        {/* Boards */}
        <div
          className={`mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-xl ${panelBG}`}
        >
          {/* LEFT: Draggable items */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Left Items</h4>
            <div className="space-y-3">
              {selectedQuestion.left_items.map((leftText, i) => {
                const matchedRight = (option || {})[leftText];
                const isActive = activeLeft === leftText;

                return (
                  <button
                    key={`left-${i}-${selectedQuestion.id}`}
                    draggable
                    onDragStart={(e) => handleDragStartLeft(e, leftText)}
                    onDragEnd={handleDragEndLeft}
                    onClick={() => handleClickLeft(leftText)}
                    className={[
                      'w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 cursor-grab active:cursor-grabbing',
                      leftCard,
                      isActive ? activeLeftClass : '',
                    ].join(' ')}
                    aria-pressed={isActive}
                    title="Drag me to a right item or click then click a right item"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{leftText}</span>
                      {matchedRight && (
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${usedBadge}`}
                          title={`Current: ${matchedRight}`}
                        >
                          ↦ {matchedRight}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Drop targets */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Right Items</h4>
            <div className="space-y-3">
              {shuffledRightItems.map((rightText, j) => {
                const isUsed = isRightUsed(rightText);
                const isHot = Boolean(activeLeft); // show highlight when in pairing mode
                return (
                  <div
                    key={`right-${j}-${selectedQuestion.id}`}
                    onDrop={(e) => handleDropOnRight(e, rightText)}
                    onDragOver={handleRightDragOver}
                    onClick={() => handleClickRight(rightText)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClickRight(rightText);
                      }
                    }}
                    className={[
                      'px-4 py-3 rounded-lg border transition-all duration-150 outline-none',
                      rightCard,
                      isHot ? 'hover:shadow-md' : '',
                      isHot ? rightHighlight : '',
                      isUsed
                        ? theme === 'light'
                          ? 'opacity-90'
                          : 'opacity-95'
                        : '',
                    ].join(' ')}
                    title={isUsed ? 'Already matched (dropping will reassign)' : 'Drop here or click to match'}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{rightText}</span>
                      {isUsed && (
                        <span
                          className={`ml-auto text-xs px-2 py-0.5 rounded-full border ${usedBadge}`}
                        >
                          used
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Your Matches Summary */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-lg font-semibold">Your Matches</h4>
            <button
              type="button"
              onClick={resetAll}
              className={`text-sm px-3 py-1.5 rounded-md border ${
                theme === 'light'
                  ? 'border-gray-300 hover:bg-gray-100'
                  : 'border-gray-600 hover:bg-gray-800'
              }`}
            >
              Reset
            </button>
          </div>

          {Object.keys(option || {}).length === 0 ? (
            <div className={theme === 'light' ? 'text-gray-600' : 'text-gray-400'}>
              No matches yet. Drag a left item onto a right item (or click left, then click right).
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className={theme === 'light' ? 'text-gray-700' : 'text-gray-300'}>
                    <th className="text-left py-2 pr-4">Left</th>
                    <th className="text-left py-2 pr-4">Right</th>
                    <th className="py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(option || {}).map(([left, right]) => (
                    <tr key={`pair-${left}-${selectedQuestion.id}`} className="border-t border-gray-500/20">
                      <td className="py-2 pr-4">{left}</td>
                      <td className="py-2 pr-4">{right}</td>
                      <td className="py-2">
                        <button
                          type="button"
                          onClick={() => removePair(left)}
                          className={`text-xs px-2 py-1 rounded border ${
                            theme === 'light'
                              ? 'border-red-300 text-red-700 hover:bg-red-50'
                              : 'border-red-700 text-red-300 hover:bg-red-900/30'
                          }`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MatchingQuestion;
