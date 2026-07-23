import React from 'react';

interface RoundReactionProps {
  subject: any;
  playerNick: string;
  wrongGuesses: number;
  totalPlayers: number;
}

export const RoundReaction: React.FC<RoundReactionProps> = ({ subject, playerNick, wrongGuesses, totalPlayers }) => {
  const isFactOwner = subject.nick === playerNick;
  
  // Calculate if majority got it wrong
  const guessersCount = totalPlayers - 1;
  const majorityWrong = wrongGuesses >= guessersCount / 2;

  let ownerMessage = "";
  if (wrongGuesses === 0) {
    ownerMessage = "They saw right through you!";
  } else if (wrongGuesses === guessersCount) {
    ownerMessage = "Hahaha, you fooled everyone!";
  } else if (majorityWrong) {
    ownerMessage = "You guys couldn't guess it!";
  } else {
    ownerMessage = "You got me!";
  }

  return (
    <div className="flex flex-col h-full lg:h-full w-full relative justify-center items-center px-5 py-8 animate-fade-in">
      <div className="w-full max-w-[400px] flex flex-col items-center bg-surface/80 backdrop-blur-md border border-border rounded-[24px] p-8 shadow-2xl">
        
        {isFactOwner ? (
          <>
            <div className="text-[48px] mb-4">🎭</div>
            <div className="text-[24px] lg:text-[28px] font-black text-center mb-2 text-coral">{ownerMessage}</div>
            <div className="text-[15px] text-muted text-center mb-4">
              {wrongGuesses} out of {guessersCount} people guessed wrong.
            </div>
            {wrongGuesses > 0 && (
              <div className="text-[18px] font-bold text-amber">
                +{Math.round(400 / totalPlayers) * wrongGuesses} points!
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-[48px] mb-4">🧐</div>
            <div className="text-[24px] lg:text-[28px] font-black text-center mb-2 text-amber">It was {subject.name}!</div>
            <div className="text-[15px] text-muted text-center italic mt-4 px-4 border-l-2 border-amber/30">
              "{subject.currentFact}"
            </div>
          </>
        )}
      </div>
    </div>
  );
};
