import { useState } from 'react';

const QuestionCard = ({ question, questionNumber, totalQuestions, onAnswer, selectedAnswer }) => {
  const [selected, setSelected] = useState(selectedAnswer || '');

  const handleSelect = (option) => {
    setSelected(option);
    onAnswer(option);
  };

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className="text-sm font-medium text-primary-600">
            {question.topic}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.questionText}
      </h2>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
              selected === option
                ? 'border-primary-600 bg-primary-50 shadow-md'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selected === option
                    ? 'border-primary-600 bg-primary-600'
                    : 'border-gray-400'
                }`}
              >
                {selected === option && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <span className="text-gray-800 font-medium">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
