'use client';

import React, { useMemo, useState } from 'react';
import quiz from '@/data/quizBank.json';
import { useMatrix } from '@/context/MatrixContext';
import type { QuizItem } from '@/lib/types';

export default function BodyMindQuiz() {
  const { nodes } = useMatrix();
  const items = quiz.items as QuizItem[];
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState('');
  const q = items[i % items.length];
  const choices = useMemo(() => {
    const ids = [q.answerId, ...q.distractorIds];
    return ids
      .map((id) => nodes.find((n) => n.id === id))
      .filter(Boolean)
      .sort(() => Math.random() - 0.5);
  }, [q, nodes]);

  return (
    <div>
      <div className="sub">
        Card {i + 1}/{items.length} · score {score}
      </div>
      <p>{q.prompt}</p>
      {choices.map((c) => (
        <button
          key={c!.id}
          className="btn quizopt"
          onClick={() => {
            const ok = c!.id === q.answerId;
            setScore((s) => s + (ok ? 1 : 0));
            setMsg(ok ? `Correct — ${c!.name}` : `Not ${c!.name}. Hint: ${q.hint}`);
            setI((n) => n + 1);
          }}
        >
          {c!.name} <span className="sub">({c!.domain})</span>
        </button>
      ))}
      {msg && <div className="tel">{msg}</div>}
    </div>
  );
}
