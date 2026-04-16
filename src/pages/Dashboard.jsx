import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, ChevronDown, Play, Loader } from 'lucide-react';
import { quizAPI } from '../services/api';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectTopics, setSubjectTopics] = useState({});
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingTopics, setLoadingTopics] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const { data } = await quizAPI.getSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = async (subject) => {
    if (expandedSubject === subject) {
      setExpandedSubject(null);
      return;
    }

    setExpandedSubject(subject);

    // Fetch topics if not already loaded
    if (!subjectTopics[subject]) {
      setLoadingTopics({ ...loadingTopics, [subject]: true });
      try {
        const { data } = await quizAPI.getTopics(subject);
        setSubjectTopics({ ...subjectTopics, [subject]: data });
      } catch (error) {
        console.error('Error fetching topics:', error);
      } finally {
        setLoadingTopics({ ...loadingTopics, [subject]: false });
      }
    }
  };

  const startQuiz = (subject, topic) => {
    navigate('/quiz', { state: { subject, topic } });
  };

  const subjectColors = {
    Mathematics: 'from-blue-500 to-blue-600',
    Science: 'from-green-500 to-green-600',
    English: 'from-purple-500 to-purple-600',
    History: 'from-yellow-500 to-yellow-600',
    Geography: 'from-red-500 to-red-600',
  };

  const subjectIcons = {
    Mathematics: '🔢',
    Science: '🔬',
    English: '📚',
    History: '📜',
    Geography: '🌍',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-gray-600">
            Choose a subject and topic to start your quiz
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Subjects Available
            </h3>
            <p className="text-gray-600">
              Questions will be added soon. Please check back later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject} className="card overflow-hidden">
                <button
                  onClick={() => toggleSubject(subject)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-16 h-16 rounded-xl bg-gradient-to-br ${
                        subjectColors[subject] || 'from-gray-500 to-gray-600'
                      } flex items-center justify-center text-3xl shadow-lg`}
                    >
                      {subjectIcons[subject] || '📖'}
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {subject}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Click to view topics
                      </p>
                    </div>
                  </div>
                  {expandedSubject === subject ? (
                    <ChevronDown className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-6 w-6 text-gray-400" />
                  )}
                </button>

                {expandedSubject === subject && (
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    {loadingTopics[subject] ? (
                      <div className="flex justify-center py-8">
                        <Loader className="h-6 w-6 animate-spin text-primary-600" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {subjectTopics[subject]?.map((topic) => (
                          <button
                            key={topic}
                            onClick={() => startQuiz(subject, topic)}
                            className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all group"
                          >
                            <span className="font-medium text-gray-900">
                              {topic}
                            </span>
                            <div className="flex items-center space-x-2 text-primary-600 group-hover:translate-x-1 transition-transform">
                              <Play className="h-5 w-5" />
                              <span className="text-sm font-medium">Start Quiz</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
