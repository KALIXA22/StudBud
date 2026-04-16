import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Loader, Clock } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { quizAPI, resultsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const QuizPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { subject, topic } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [timerEnabled, setTimerEnabled] = useState(true);

  useEffect(() => {
    if (!subject || !topic) {
      navigate('/dashboard');
      return;
    }
    fetchQuestions();
  }, [subject, topic]);

  useEffect(() => {
    if (!timerEnabled || timeRemaining <= 0 || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerEnabled, timeRemaining, questions]);

  const fetchQuestions = async () => {
    try {
      const { data } = await quizAPI.getQuestions(topic);
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Failed to load questions. Please try again.');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    const answeredCount = Object.keys(answers).length;
    if (answeredCount < questions.length) {
      const confirmSubmit = window.confirm(
        `You have only answered ${answeredCount} out of ${questions.length} questions. Do you want to submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    setSubmitting(true);

    try {
      // Format answers for submission
      const formattedAnswers = questions.map((q, index) => ({
        questionId: q._id,
        chosenAnswer: answers[index] || '',
      }));

      // Submit quiz to get score
      const { data: quizResult } = await quizAPI.submitQuiz(formattedAnswers);

      // Save result to database
      await resultsAPI.saveResult({
        subject,
        topic,
        score: quizResult.score,
        total: quizResult.total,
        answers: quizResult.results.map((r) => ({
          questionId: r.questionId,
          chosenAnswer: r.chosenAnswer,
          isCorrect: r.isCorrect,
        })),
      });

      // Navigate to results page with data
      navigate('/result-detail', {
        state: {
          result: quizResult,
          subject,
          topic,
        },
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Questions Available
          </h2>
          <p className="text-gray-600 mb-6">
            There are no questions available for this topic yet.
          </p>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{subject}</h1>
              <p className="text-gray-600">{topic}</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-xl font-bold text-primary-600">
                  {answeredCount}/{questions.length}
                </p>
              </div>
              {timerEnabled && (
                <div className="flex items-center space-x-2">
                  <Clock
                    className={`h-5 w-5 ${
                      timeRemaining < 60 ? 'text-red-600' : 'text-gray-600'
                    }`}
                  />
                  <span
                    className={`text-xl font-bold ${
                      timeRemaining < 60 ? 'text-red-600' : 'text-gray-900'
                    }`}
                  >
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswer={handleAnswer}
          selectedAnswer={answers[currentQuestionIndex]}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 mb-12">
          <button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            className="btn btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary flex items-center space-x-2"
            >
              <CheckCircle className="h-5 w-5" />
              <span>{submitting ? 'Submitting...' : 'Submit Quiz'}</span>
            </button>
          ) : (
            <button
              onClick={goToNext}
              className="btn btn-primary flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Question Navigator
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentQuestionIndex === index
                    ? 'bg-primary-600 text-white ring-2 ring-primary-300'
                    : answers[index]
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
