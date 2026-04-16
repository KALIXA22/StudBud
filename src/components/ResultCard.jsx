import { CheckCircle, XCircle, Calendar } from 'lucide-react';

const ResultCard = ({ result, onClick }) => {
  const percentage = ((result.score / result.total) * 100).toFixed(0);
  const passed = percentage >= 60;

  const getGrade = (percent) => {
    if (percent >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percent >= 80) return { grade: 'A', color: 'text-green-500' };
    if (percent >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percent >= 60) return { grade: 'C', color: 'text-yellow-600' };
    if (percent >= 50) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getGrade(percentage);

  return (
    <div
      onClick={onClick}
      className="card hover:shadow-xl transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{result.subject}</h3>
          <p className="text-sm text-gray-600">{result.topic}</p>
        </div>
        <div className={`text-3xl font-bold ${color}`}>
          {grade}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {passed ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className={`font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
            {percentage}%
          </span>
        </div>
        <span className="text-sm font-medium text-gray-700">
          {result.score}/{result.total} Correct
        </span>
      </div>

      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className={`h-full transition-all ${
            passed ? 'bg-green-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex items-center text-xs text-gray-500">
        <Calendar className="h-4 w-4 mr-1" />
        {new Date(result.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  );
};

export default ResultCard;
