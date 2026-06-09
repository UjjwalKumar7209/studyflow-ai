import quizRepository from '../repositories/quiz.repository'
import quizAttemptRepository from '../repositories/quiz-attempt.repository'

interface Answer {
  quizId: number
  selectedAnswer: string
}

async function submitQuiz(userId: number, topicId: number, answers: Answer[]) {
  const quizzes = await quizRepository.findQuizzesByTopicId(topicId)

  if (quizzes.length === 0) {
    throw new Error('Quiz not found')
  }

  let correctAnswers = 0

  for (const answer of answers) {
    const quiz = quizzes.find((q) => q.id === answer.quizId)

    if (!quiz) continue

    if (quiz.correctAnswer.trim() === answer.selectedAnswer.trim()) {
      correctAnswers++
    }
  }

  const totalQuestions = quizzes.length

  const score = Math.round((correctAnswers / totalQuestions) * 100)

  const attempt = await quizAttemptRepository.createAttempt(
    userId,
    topicId,
    totalQuestions,
    correctAnswers,
    score
  )

  return {
    attempt,
    totalQuestions,
    correctAnswers,
    score
  }
}

async function getAttempts(userId: number) {
  return quizAttemptRepository.findAttemptsByUserId(userId)
}

export default {
  submitQuiz,
  getAttempts
}
