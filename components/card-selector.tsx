// ! COMMENT OUT - THIS COMPONENT IS NOT IN USE CURRENTLY
// "use client";

// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// interface CardData {
//   id: number;
//   background: string;
//   title: string;
//   description: string;
//   color: string;
// }

// interface CardSelectorProps {
//   cards: CardData[];
// }

// const CardSelector: React.FC<CardSelectorProps> = ({ cards }) => {
//   const [activeCard, setActiveCard] = useState<number>(0);

//   const handleCardClick = (cardId: number) => {
//     setActiveCard(cardId);
//   };

//   // Render title either vertically or horizontally based on active state
//   const renderTitle = (title: string, cardId: number) => {
//     return (
//       <div 
//         className="transition-all duration-500 flex"
//         style={{
//           flexDirection: cardId === activeCard ? 'row' : 'column',
//           alignItems: cardId === activeCard ? 'flex-start' : 'center',
//           justifyContent: 'flex-start',
//           gap: cardId === activeCard ? '8px' : '0',
//           textAlign: 'left',
//         }}
//       >
//         {title.split('').map((char, index) => (
//           <span
//             key={index}
//             className="char inline-block font-bold"
//             style={{
//               transform: cardId === activeCard ? 'none' : 'rotate(0deg)',
//               transformOrigin: "center",
//               width: 'auto',
//               height: 'auto',
//               lineHeight: 'normal',
//               fontSize: cardId === activeCard ? '2rem' : '1.2rem',
//               opacity: cardId === activeCard ? 1 : 0.9,
//               margin: cardId === activeCard ? '0' : '1px 0',
//               color: 'white',
//               textShadow: '0 0 10px rgba(0,0,0,0.8)',
//               transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
//               whiteSpace: 'pre',
//               fontWeight: '700',
//             }}
//           >
//             {char === " " ? "\u00A0" : char}
//           </span>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <>
//       <style jsx>{`
//         .options-container {
//           display: flex;
//           flex-direction: row;
//           justify-content: center;
//           align-items: center;
//           overflow: hidden;
//           font-family: 'Roboto', sans-serif;
//           transition: 0.25s;
//           padding: 20px 0;
//         }
        
//         .options-wrapper {
//           display: flex;
//           flex-direction: row;
//           align-items: stretch;
//           overflow: hidden;
//           min-width: 600px;
//           max-width: 900px;
//           width: calc(100% - 100px);
//           height: 400px;
//         }
        
//         .option-item {
//           position: relative;
//           overflow: hidden;
//           min-width: 60px;
//           margin: 10px;
//           background-size: cover; /* Full width and height */
//           background-position: center;
//           background-repeat: no-repeat;
//           cursor: pointer;
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//           border-radius: 30px;
//           flex-grow: 1;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
//           transform: scale(1);
//         }
        
//         .option-item:hover:not(.active) {
//           transform: scale(1.03);
//           box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
//         }
        
//         .option-item.active {
//           flex-grow: 10000;
//           transform: scale(1);
//           max-width: 600px;
//           margin: 0px;
//           border-radius: 40px;
//           background-size: cover; /* Full width and height */
//           background-repeat: no-repeat;
//           box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
//           z-index: 10;
//         }
        
//         .option-item.active .option-shadow {
//           box-shadow: inset 0 -120px 120px -120px black, inset 0 -120px 120px -100px black;
//         }
        
//         .option-item:not(.active) .option-shadow {
//           bottom: -40px;
//           box-shadow: inset 0 -120px 0px -120px black, inset 0 -120px 0px -100px black;
//         }
        
//         .option-item.active .option-label {
//           bottom: 30px;
//           left: 30px;
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//         }
        
//         .option-item:not(.active) .option-label {
//           bottom: 15px;
//           left: 15px;
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//         }
        
//         .option-item.active .option-info > div {
//           left: 0px;
//           opacity: 1;
//         }
        
//         .option-item:not(.active) .option-info > div {
//           left: 20px;
//           opacity: 0;
//         }
        
//         .option-shadow {
//           position: absolute;
//           bottom: 0px;
//           left: 0px;
//           right: 0px;
//           height: 120px;
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//         }
        
//         .option-label {
//           display: flex;
//           position: absolute;
//           left: 0;
//           bottom: 0;
//           width: 100%;
//           padding: 20px;
//           box-sizing: border-box;
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
//         }
        
//         .option-info {
//           display: flex;
//           flex-direction: column;
//           justify-content: flex-end;
//           color: white;
//           width: 100%;
//         }
        
//         .option-info > div {
//           position: relative;
//           transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease-out;
//         }
        
//         .option-main {
//           font-weight: bold;
//           font-size: 1.2rem;
//           margin-bottom: 10px;
//         }
        
//         .option-sub {
//           transition-delay: 0.2s;
//           font-size: 1rem;
//           max-width: 80%;
//           line-height: 1.4;
//         }
        
//         .inactive-options {
//           display: none;
//         }
        
//         /* Tablet and Mobile Responsive Styles */
//         @media screen and (max-width: 1024px) {
//           .options-container {
//             padding: 20px;
//             height: auto;
//             flex-direction: column;
//           }
          
//           .options-wrapper {
//             display: flex;
//             flex-direction: column;
//             min-width: auto;
//             max-width: none;
//             width: 100%;
//             height: auto;
//             align-items: center;
//           }
          
//           /* Active option takes full width and proper height */
//           .option-item.active {
//             display: block;
//             width: 100%;
//             max-width: 500px;
//             height: 300px;
//             margin: 0 0 30px 0;
//             border-radius: 25px;
//             background-size: cover;
//             background-repeat: no-repeat;
//             flex-grow: 0;
//             transform: none;
//           }
          
//           /* Ensure content is in bottom left */
//           .option-item.active .option-label {
//             bottom: 25px;
//             left: 25px;
//             right: auto;
//             height: auto;
//           }
          
//           .option-item.active .option-info > div {
//             left: 0px;
//             opacity: 1;
//           }
          
//           /* Hide inactive options from normal flow and show as icons */
//           .option-item:not(.active) {
//             display: none;
//           }
          
//           /* Show inactive options as circular icons */
//           .inactive-options {
//             display: flex;
//             justify-content: center;
//             flex-wrap: wrap;
//             gap: 15px;
//             width: 100%;
//             max-width: 500px;
//           }
          
//           .inactive-option {
//             width: 70px;
//             height: 70px;
//             border-radius: 50%;
//             background-size: cover;
//             background-position: center;
//             position: relative;
//             cursor: pointer;
//             transition: transform 0.3s ease;
//             overflow: hidden;
//           }
          
//           .inactive-option::before {
//             content: '';
//             position: absolute;
//             top: 0;
//             left: 0;
//             right: 0;
//             bottom: 0;
//             background: rgba(0, 0, 0, 0.3);
//             border-radius: 50%;
//           }
          
//           .inactive-option-inner {
//             position: absolute;
//             top: 50%;
//             left: 50%;
//             transform: translate(-50%, -50%);
//             background: white;
//             width: 40px;
//             height: 40px;
//             border-radius: 50%;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-size: 18px;
//             z-index: 1;
//           }
//         }
        
//         /* Mobile specific adjustments */
//         @media screen and (max-width: 768px) {
//           .option-item.active {
//             height: 250px;
//             border-radius: 20px;
//             max-width: 400px;
//           }
          
//           .option-item.active .option-label {
//             bottom: 20px;
//             left: 20px;
//           }
          
//           .inactive-option {
//             width: 60px;
//             height: 60px;
//           }
          
//           .inactive-option-inner {
//             width: 35px;
//             height: 35px;
//             font-size: 16px;
//           }
//         }
        
//         /* Small mobile adjustments */
//         @media screen and (max-width: 480px) {
//           .option-item.active {
//             height: 220px;
//             border-radius: 18px;
//           }
          
//           .option-item.active .option-label {
//             bottom: 18px;
//             left: 18px;
//           }
          
//           .option-main {
//             font-size: 1.1rem;
//           }
          
//           .inactive-option {
//             width: 50px;
//             height: 50px;
//           }
          
//           .inactive-option-inner {
//             width: 30px;
//             height: 30px;
//             font-size: 14px;
//           }
//         }
//       `}</style>
      
//       <div className="options-container">
//         <div className="options-wrapper">
//           {cards.map((card) => (
//             <div
//               key={card.id}
//               className={`option-item ${activeCard === card.id ? 'active' : ''}`}
//               style={{
//                 backgroundImage: `url(${card.background})`,
//                 '--defaultBackground': card.color,
//                 transform: activeCard === card.id ? 'scale(1)' : 'scale(1)',
//               } as React.CSSProperties}
//               onClick={() => handleCardClick(card.id)}
//               onMouseDown={(e) => {
//                 e.currentTarget.style.transform = 'scale(0.95)';
//               }}
//               onMouseUp={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.transform = 'scale(1)';
//               }}
//             >
//               <div className="option-shadow"></div>
//               <div className="option-label">
//                 <div className="option-info">
//                   <div className="option-main">
//                     {renderTitle(card.title, card.id)}
//                   </div>
//                   <AnimatePresence>
//                     {activeCard === card.id && (
//                       <motion.div
//                         className="option-sub"
//                         initial={{ opacity: 0, y: 30, scale: 0.9 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: 30, scale: 0.9 }}
//                         transition={{ 
//                           duration: 0.4, 
//                           delay: 0.2,
//                           ease: "anticipate"
//                         }}
//                       >
//                         {card.description}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </div>
//             </div>
//           ))}
          
//           <div className="inactive-options">
//             {cards.map((card) => (
//               activeCard !== card.id && (
//                 <div
//                   key={card.id}
//                   className="inactive-option"
//                   style={{
//                     backgroundImage: `url(${card.background})`
//                   }}
//                   onClick={() => handleCardClick(card.id)}
//                 >
//                   <div 
//                     className="inactive-option-inner"
//                     style={{ color: card.color }}
//                   >
//                     {card.title.charAt(0)}
//                   </div>
//                 </div>
//               )
//             ))}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CardSelector;
