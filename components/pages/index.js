import { useState } from 'react';
import UploadForm from '../components/UploadForm';
import QuizResults from '../components/QuizResults';

const Home = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);

  const handleQuizResults = (questions) => {
    setQuizQuestions(questions);
  };

  return (
    <div>
      <h1>ExamAI - Exam Companion</h1>
      <UploadForm onQuizResults={handleQuizResults} />
      {quizQuestions.length > 0 && <QuizResults questions={quizQuestions} />}
    </div>
  );
};

export default Home;
