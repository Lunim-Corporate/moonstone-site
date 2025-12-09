"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

interface CardData {
  id: number;
  background: string;
  title: string;
  description: string;
  color: string;
}

interface CardSelectorProps {
  cards: CardData[];
}

const CardSelector: React.FC<CardSelectorProps> = ({ cards }) => {
  const [activeCard, setActiveCard] = useState<number>(0);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const charRefs = useRef<{ [key: number]: (HTMLElement | null)[] }>({});

  const handleCardClick = (cardId: number) => {
    setActiveCard(cardId);
  };

  // Set up character refs for each card
  const setCharRef = (cardId: number, index: number, el: HTMLElement | null) => {
    if (!charRefs.current[cardId]) {
      charRefs.current[cardId] = [];
    }
    charRefs.current[cardId][index] = el;
  };

  // Animate title characters when card becomes active
  useEffect(() => {
    // Reset all non-active cards to vertical
    cards.forEach(card => {
      if (card.id !== activeCard && charRefs.current[card.id]) {
        const chars = charRefs.current[card.id];
        gsap.set(chars, {
          x: 0,
          y: 0,
          rotation: 180,
          transformOrigin: "center"
        });
      }
    });

    // Animate active card characters to horizontal
    if (charRefs.current[activeCard]) {
      const chars = charRefs.current[activeCard];
      
      // Animate each character to horizontal position
      gsap.to(chars, {
        duration: 0.6,
        x: (index) => index * 25, // Spread characters horizontally
        y: 0,
        rotation: 0,
        stagger: 0.05,
        ease: "back.out(1.3)"
      });
    }
  }, [activeCard, cards]);

  // Render title either vertically or horizontally based on active state
  const renderTitle = (title: string, cardId: number) => {
    const chars = Array.from(title);

    return (
      <div 
        ref={(el) => { titleRefs.current[cardId] = el; }}
        className="transition-all duration-500 flex"
        style={{
          flexDirection: 'row',
        }}
      >
        {chars.map((char, index) => (
          <span
            key={index}
            ref={(el) => setCharRef(cardId, index, el)}
            className="char inline-block transition-all duration-300"
            style={{
              transform: cardId === activeCard ? 'none' : 'rotate(180deg)',
              transformOrigin: "center",
              width: cardId === activeCard ? 'auto' : '20px',
              height: cardId === activeCard ? 'auto' : '20px',
              lineHeight: cardId === activeCard ? 'normal' : '20px',
              textAlign: 'center'
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      <style jsx>{`
        .options-container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          min-height: 100vh;
          font-family: 'Roboto', sans-serif;
          transition: 0.25s;
          background: #f5f5f5;
          padding: 20px 0;
        }
        
        .options-wrapper {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          overflow: hidden;
          min-width: 600px;
          max-width: 900px;
          width: calc(100% - 100px);
          height: 400px;
        }
        
        .option-item {
          position: relative;
          overflow: hidden;
          min-width: 60px;
          margin: 10px;
          background-size: auto 120%;
          background-position: center;
          cursor: pointer;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
          border-radius: 30px;
          flex-grow: 1;
        }
        
        .option-item.active {
          flex-grow: 10000;
          transform: scale(1);
          max-width: 600px;
          margin: 0px;
          border-radius: 40px;
          background-size: auto 100%;
        }
        
        .option-item.active .option-shadow {
          box-shadow: inset 0 -120px 120px -120px black, inset 0 -120px 120px -100px black;
        }
        
        .option-item:not(.active) .option-shadow {
          bottom: -40px;
          box-shadow: inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
        }
        
        .option-item.active .option-label {
          bottom: 20px;
          left: 20px;
        }
        
        .option-item:not(.active) .option-label {
          bottom: 10px;
          left: 10px;
        }
        
        .option-item.active .option-info > div {
          left: 0px;
          opacity: 1;
        }
        
        .option-item:not(.active) .option-info > div {
          left: 20px;
          opacity: 0;
        }
        
        .option-shadow {
          position: absolute;
          bottom: 0px;
          left: 0px;
          right: 0px;
          height: 120px;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
        }
        
        .option-label {
          display: flex;
          position: absolute;
          right: 0px;
          height: 40px;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95);
        }
        
        .option-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 10px;
          color: white;
          white-space: pre;
        }
        
        .option-info > div {
          position: relative;
          transition: 0.5s cubic-bezier(0.05, 0.61, 0.41, 0.95), opacity 0.5s ease-out;
        }
        
        .option-main {
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .option-sub {
          transition-delay: 0.1s;
        }
        
        .inactive-options {
          display: none;
        }
        
        /* Tablet and Mobile Responsive Styles */
        @media screen and (max-width: 1024px) {
          .options-container {
            padding: 20px;
            height: auto;
            min-height: 100vh;
            flex-direction: column;
          }
          
          .options-wrapper {
            display: flex;
            flex-direction: column;
            min-width: auto;
            max-width: none;
            width: 100%;
            height: auto;
            align-items: center;
          }
          
          /* Active option takes full width and proper height */
          .option-item.active {
            display: block;
            width: 100%;
            max-width: 500px;
            height: 300px;
            margin: 0 0 30px 0;
            border-radius: 25px;
            background-size: cover;
            flex-grow: 0;
            transform: none;
          }
          
          /* Ensure content is in bottom left */
          .option-item.active .option-label {
            bottom: 25px;
            left: 25px;
            right: auto;
            height: 40px;
          }
          
          .option-item.active .option-info > div {
            left: 0px;
            opacity: 1;
          }
          
          /* Hide inactive options from normal flow and show as icons */
          .option-item:not(.active) {
            display: none;
          }
          
          /* Show inactive options as circular icons */
          .inactive-options {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 15px;
            width: 100%;
            max-width: 500px;
          }
          
          .inactive-option {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            position: relative;
            cursor: pointer;
            transition: transform 0.3s ease;
            overflow: hidden;
          }
          
          .inactive-option::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
          }
          
          .inactive-option-inner {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            z-index: 1;
          }
        }
        
        /* Mobile specific adjustments */
        @media screen and (max-width: 768px) {
          .option-item.active {
            height: 250px;
            border-radius: 20px;
            max-width: 400px;
          }
          
          .option-item.active .option-label {
            bottom: 20px;
            left: 20px;
          }
          
          .inactive-option {
            width: 60px;
            height: 60px;
          }
          
          .inactive-option-inner {
            width: 35px;
            height: 35px;
            font-size: 16px;
          }
        }
        
        /* Small mobile adjustments */
        @media screen and (max-width: 480px) {
          .option-item.active {
            height: 220px;
            border-radius: 18px;
          }
          
          .option-item.active .option-label {
            bottom: 18px;
            left: 18px;
          }
          
          .option-main {
            font-size: 1.1rem;
          }
          
          .inactive-option {
            width: 50px;
            height: 50px;
          }
          
          .inactive-option-inner {
            width: 30px;
            height: 30px;
            font-size: 14px;
          }
        }
      `}</style>
      
      <div className="options-container">
        <div className="options-wrapper">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`option-item ${activeCard === card.id ? 'active' : ''}`}
              style={{
                backgroundImage: `url(${card.background})`,
                '--defaultBackground': card.color
              } as React.CSSProperties}
              onClick={() => handleCardClick(card.id)}
            >
              <div className="option-shadow"></div>
              <div className="option-label">
                <div className="option-info">
                  <div className="option-main">
                    {renderTitle(card.title, card.id)}
                  </div>
                  <AnimatePresence>
                    {activeCard === card.id && (
                      <motion.div
                        className="option-sub"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      >
                        {card.description}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))}
          
          <div className="inactive-options">
            {cards.map((card) => (
              activeCard !== card.id && (
                <div
                  key={card.id}
                  className="inactive-option"
                  style={{
                    backgroundImage: `url(${card.background})`
                  }}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div 
                    className="inactive-option-inner"
                    style={{ color: card.color }}
                  >
                    {card.title.charAt(0)}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CardSelector;