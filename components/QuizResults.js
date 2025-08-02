const QuizResults = ({ questions }) => {
  return (
    <div>
      <h4>Risultati Esame:</h4>
      <ol>
        {questions.map((question, index) => (
          <li key={index}>{`Domanda ${index + 1}: ${question.text}`}</li>
        ))}
      </ol>
    </div>
  );
};

export default QuizResults;
