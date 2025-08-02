import { useState } from 'react';
import { supabaseClient } from '../services/supabaseClient';
import { quizService } from '../services/quizService';

const UploadForm = ({ onQuizResults }) => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await quizService.analyzeExam(image);
      if (error) {
        console.error('Errore durante l\'analisi dell\'esame:', error);
        alert('Si è verificato un errore durante l\'analisi dell\'esame. Riprova più tardi.');
      } else {
        onQuizResults(data.questions);
      }
    } catch (error) {
      console.error('Errore durante l\'analisi dell\'esame:', error);
      alert('Si è verificato un errore durante l\'analisi dell\'esame. Riprova più tardi.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="quiz-image">Carica la foto dell'esame</label>
        <input type="file" id="quiz-image" accept="image/*" required onChange={handleImageUpload} />
      </div>
      <button type="submit">Analizza Esame</button>
    </form>
  );
};

export default UploadForm;
