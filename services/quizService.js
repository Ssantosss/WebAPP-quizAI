import { supabaseClient } from './supabaseClient';

export const quizService = {
  async analyzeExam(image) {
    const formData = new FormData();
    formData.append('image', image);

    const { data, error } = await supabaseClient.functions.invoke('analyze-exam', {
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return { data, error };
  },
};
