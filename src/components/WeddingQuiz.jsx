import React, { useState } from 'react';
import { HelpCircle, CheckCircle, Sparkles, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function WeddingQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      q: "Where is Manzi & Nikita's official Civil Marriage Ceremony taking place on Oct 15?",
      options: ["Toronto Pearson Airport", "60 Queen Street West, Toronto", "King Street Airbnb", "CN Tower"],
      answer: 1, // 60 Queen Street West
    },
    {
      q: "How are Manzi & Nikita traveling to Toronto for their 3rd Anniversary trip?",
      options: ["First Class Flight", "Scenic Roadtrip Drive", "Train Ride", "Helicopter"],
      answer: 1, // Scenic Roadtrip
    },
    {
      q: "What is the official motto for the Friday night late-night celebration?",
      options: ["Early to bed early to rise", "In the club we all fam", "No music allowed", "Strict dress code only"],
      answer: 1, // In the club we all fam
    },
    {
      q: "Where is the Oct 10 traditional Irembo celebration hosted?",
      options: ["At Mum's Residence", "At a hotel lounge", "In Montreal", "At City Hall"],
      answer: 0, // Mum's
    },
  ];

  const handleSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
      confetti({ particleCount: 80, spread: 90, origin: { y: 0.6 } });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
  };

  const currentQ = questions[currentQuestion];

  return (
    <section id="quiz" style={{ marginBottom: '4rem' }}>
      <div className="container">
        
        <div className="glass-card vintage-frame" style={{ padding: '2.5rem' }}>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '1rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div className="badge badge-gold" style={{ marginBottom: '0.4rem' }}>
                <HelpCircle size={12} />
                <span>Wedding Guest Game</span>
              </div>
              <h2 style={{ fontSize: '2rem' }}>How Well Do You Know Manzi & Nikita?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Test your knowledge on their civil wedding & roadtrip trip details!
              </p>
            </div>

            {!showResult && (
              <span className="badge" style={{ fontSize: '0.8rem' }}>
                Question {currentQuestion + 1} of {questions.length}
              </span>
            )}
          </div>

          {!showResult ? (
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                {currentQ.q}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.75rem' }} className="grid-2">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={selectedOption === idx ? "btn-primary" : "btn-outline"}
                    style={{
                      padding: '1rem',
                      justifyContent: 'flex-start',
                      borderRadius: '12px',
                      textAlign: 'left',
                      fontSize: '0.95rem'
                    }}
                  >
                    <span style={{ fontWeight: '700', marginRight: '0.5rem', opacity: 0.7 }}>
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    {opt}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNext}
                  disabled={selectedOption === null}
                  className="btn-primary"
                  style={{ opacity: selectedOption === null ? 0.5 : 1, cursor: selectedOption === null ? 'not-allowed' : 'pointer' }}
                >
                  {currentQuestion + 1 === questions.length ? 'See Final Score' : 'Next Question'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--badge-bg)',
                border: '1px solid var(--text-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                color: 'var(--text-accent)'
              }}>
                <Award size={32} />
              </div>

              <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-serif)', marginBottom: '0.5rem' }}>
                Quiz Completed! Score: {score} / {questions.length}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem' }}>
                {score === questions.length 
                  ? "PERFECT SCORE! You are a true Manzi & Nikita superfan!" 
                  : "Nice try! You know Manzi & Nikita pretty well!"
                }
              </p>

              <button onClick={resetQuiz} className="btn-outline" style={{ gap: '0.5rem' }}>
                <RotateCcw size={15} /> Play Again
              </button>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
