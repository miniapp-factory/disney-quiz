import React, { useState, useContext } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { MiniAppContext } from './context/miniapp-provider';

type Option = {
  text: string;
  princess: string;
};

type Question = {
  question: string;
  options: Option[];
};

const questions: Question[] = [
  {
    question: 'What is your favorite color?',
    options: [
      { text: 'Pink', princess: 'Aurora' },
      { text: 'Blue', princess: 'Belle' },
      { text: 'Red', princess: 'Mulan' },
    ],
  },
  {
    question: 'Which animal do you feel most connected to?',
    options: [
      { text: 'Horse', princess: 'Aurora' },
      { text: 'Cat', princess: 'Belle' },
      { text: 'Dragon', princess: 'Mulan' },
    ],
  },
  {
    question: 'What is your ideal vacation?',
    options: [
      { text: 'A royal ball', princess: 'Aurora' },
      { text: 'A library adventure', princess: 'Belle' },
      { text: 'A mountain trek', princess: 'Mulan' },
    ],
  },
  {
    question: 'Which trait describes you best?',
    options: [
      { text: 'Dreamy', princess: 'Aurora' },
      { text: 'Curious', princess: 'Belle' },
      { text: 'Brave', princess: 'Mulan' },
    ],
  },
  {
    question: 'What is your favorite dessert?',
    options: [
      { text: 'Chocolate cake', princess: 'Aurora' },
      { text: 'Apple pie', princess: 'Belle' },
      { text: 'Fruit tart', princess: 'Mulan' },
    ],
  },
];

export function DisneyQuiz() {
  const { sdk } = useContext(MiniAppContext);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Option[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [casting, setCasting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (option: Option) => {
    setAnswers((prev) => [...prev, option]);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      computeResult([...answers, option]);
    }
  };

  const computeResult = (allAnswers: Option[]) => {
    const score: Record<string, number> = {};
    allAnswers.forEach((a) => {
      score[a.princess] = (score[a.princess] || 0) + 1;
    });
    const best = Object.entries(score).reduce((a, b) => (b[1] > a[1] ? b : a), ['', 0])[0];
    setResult(best);
  };

  const handleCast = async () => {
    if (!sdk || !result) return;
    setCasting(true);
    setError(null);
    try {
      await sdk.publishPost({
        content: `I am most similar to ${result}!`,
      });
    } catch (e: any) {
      setError(e.message || 'Failed to cast');
    } finally {
      setCasting(false);
    }
  };

  if (result) {
    return (
      <Card className="p-6 max-w-md mx-auto mt-10">
        <h2 className="text-xl font-semibold mb-4">Your Disney Princess Match</h2>
        <p className="mb-6 text-lg">You are most similar to <span className="font-bold">{result}</span>!</p>
        <Button onClick={handleCast} disabled={casting} className="w-full">
          {casting ? 'Casting...' : 'Cast this on Farcaster'}
        </Button>
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </Card>
    );
  }

  const q = questions[current];
  return (
    <Card className="p-6 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Disney Princess Quiz</h2>
      <p className="mb-4">{q.question}</p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt) => (
          <Button
            key={opt.text}
            variant="outline"
            onClick={() => handleSelect(opt)}
            className="w-full justify-start"
          >
            {opt.text}
          </Button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Question {current + 1} of {questions.length}
      </p>
    </Card>
  );
}
