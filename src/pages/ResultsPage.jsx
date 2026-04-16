import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar, Award, Target, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import ResultCard from '../components/ResultCard';
import { resultsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [resultsRes, summaryRes] = await Promise.all([
        resultsAPI.getUserResults(user._id),
        resultsAPI.getPerformanceSummary(user._id),
      ]);
      setResults(resultsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result) => {
    // Navigate to a detailed view (you can create a separate page for this)
    console.log('View result details:', result);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!summary || results.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Results</h1>
          <div className="card text-center py-12">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Take your first quiz to see your progress here
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Start a Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { overall, bySubject, byTopic } = summary;

  // Prepare chart data
  const subjectChartData = bySubject.map((item) => ({
    subject: item.subject,
    score: item.averageScore,
    quizzes: item.totalQuizzes,
  }));

  const recentResultsData = results.slice(0, 10).reverse().map((result, index) => ({
    quiz: `Quiz ${index + 1}`,
    score: ((result.score / result.total) * 100).toFixed(0),
  }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Results</h1>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Quiz History
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm mb-1">Total Quizzes</p>
                    <p className="text-3xl font-bold">{overall.totalQuizzes}</p>
                  </div>
                  <Calendar className="h-12 w-12 text-blue-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Average Score</p>
                    <p className="text-3xl font-bold">{overall.averageScore}%</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-green-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm mb-1">Total Questions</p>
                    <p className="text-3xl font-bold">{overall.totalQuestions}</p>
                  </div>
                  <Target className="h-12 w-12 text-purple-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm mb-1">Correct Answers</p>
                    <p className="text-3xl font-bold">{overall.totalCorrect}</p>
                  </div>
                  <Award className="h-12 w-12 text-orange-200" />
                </div>
              </div>
            </div>

            {/* Performance by Subject */}
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Performance by Subject
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={subjectChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#0ea5e9" name="Average Score %" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Results */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Recent Performance Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={recentResultsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="quiz" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Score %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <ResultCard
                key={result._id}
                result={result}
                onClick={() => handleResultClick(result)}
              />
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <>
            <div className="card mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Subject-wise Performance
              </h2>
              <div className="space-y-4">
                {bySubject.map((item) => {
                  const percentage = item.averageScore;
                  return (
                    <div key={item.subject}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-gray-900">
                          {item.subject}
                        </span>
                        <span className="text-sm text-gray-600">
                          {item.totalQuizzes} quizzes • {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            percentage >= 80
                              ? 'bg-green-500'
                              : percentage >= 60
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Topic-wise Performance
              </h2>
              <div className="space-y-3">
                {byTopic.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.topic}</p>
                      <p className="text-sm text-gray-600">{item.subject}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          item.averageScore >= 80
                            ? 'text-green-600'
                            : item.averageScore >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}
                      >
                        {item.averageScore.toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.totalQuizzes} quiz{item.totalQuizzes !== 1 ? 'zes' : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
