import React from 'react';

export const MatchContent = ({ question, userAnswer, theme }) => {
    const leftItems = (question.left_items || []).map((item, index) =>
        typeof item === "string" ? { id: index + 1, text: item } : item
    );

    const rightItems = (question.right_items || []).map((item, index) =>
        typeof item === "string" ? { id: index + 1, text: item } : item
    );

    return (
        <div className="space-y-4">
            <h5 className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                Items to Match:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}>
                        Left Items:
                    </h6>
                    <div className="space-y-2">
                        {leftItems.map((item, index) => (
                            <div key={index} className={`p-2 rounded ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                                <span className="font-medium">{item.id}.</span> {item.text}
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h6 className={`text-sm font-medium ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}>
                        Right Items:
                    </h6>
                    <div className="space-y-2">
                        {rightItems.map((item, index) => (
                            <div key={index} className={`p-2 rounded ${theme === "dark" ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
                                <span className="font-medium">{item.id}.</span> {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}