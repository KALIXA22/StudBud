import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Home, RotateCcw, TrendingUp } from 'lucide-react';

const ResultDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, subject, topic } = location.state || {};

  if (!result) {
    navigate('/dashboard');
    return null;
  }

  const percentage = parseFloat(result.percentage);
  const passed = percentage >= 60;

  const getGrade = (percent) => {
    if (percent >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-50' };
    if (percent >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' };
    if (percent >= 70) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (percent >= 60) return { grade: 'C', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (percent >= 50) return { grade: 'D', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const { grade, color, bg } = getGrade(percentage);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Summary */}
        <div className="card text-center mb-8">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${bg} mb-6`}>
            {passed ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            You scored <span className={`font-bold ${color}`}>{percentage}%</span>
          </p>

          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className={`${bg} rounded-xl p-6`}>
              <p className={`text-5xl font-bold ${color} mb-2`}>{grade}</p>
              <p className="text-sm text-gray-600">Grade</p>
            </div>
            <div className="bg-gray-100 rounded-xl p-6">
              <p className="text-5xl font-bold text-gray-900 mb-2">
                {result.score}/{result.total}
              </p>
              <p className="text-sm text-gray-600">Correct Answers</p>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mb-6">
            <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  passed ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            <span className="font-medium">{subject}</span> • <span>{topic}</span>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-primary-600" />
            Detailed Results
          </h2>

          <div className="space-y-6">
            {result.results.map((item, index) => (
              <div
                key={index}
                className={`border-2 rounded-lg p-5 ${
                  item.isCorrect
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 flex-1">
                    Q{index + 1}. {item.questionText}
                  </h3>
                  {item.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 ml-3" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 ml-3" />
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <span className="font-medium text-gray-700 mr-2">Your Answer:</span>
                    <span
                      className={
                        item.isCorrect
                          ? 'text-green-700 font-medium'
                          : 'text-red-700 font-medium'
                      }
                    >
                      {item.chosenAnswer || 'Not answered'}
                    </span>
                  </div>

                  {!item.isCorrect && (
                    <div className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">Correct Answer:</span>
                      <span className="text-green-700 font-medium">
                        {item.correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-secondary flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <button
            onClick={() => navigate('/quiz', { state: { subject, topic } })}
            className="btn btn-primary flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Retake Quiz</span>
          </button>
          <button
            onClick={() => navigate('/results')}
            className="btn btn-primary flex items-center justify-center space-x-2"
          >
            <TrendingUp className="h-5 w-5" />
            <span>View All Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultDetailPage;
