// ! COMMENT OUT FOR MEANTINME
// "use client";

// import { FC, useState, useEffect, useRef } from "react";
// import { Content, ImageField, RichTextField } from "@prismicio/client";
// import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
// import { PrismicNextImage } from "@prismicio/next";
// import { motion } from "framer-motion";
// import gsap from "gsap";

// // Define the type for chart items
// interface ChartItemData {
//   label: string;
//   investment: number;
// }

// interface ChartItem {
//   label: string;
//   investment: number;
//   percentage: number;
//   color: string;
// }

// // Define the primary fields for the InvestmentChart slice
// interface InvestmentChartPrimary {
//   heading: RichTextField;
//   title: RichTextField;
//   description: RichTextField;
//   background_image: ImageField<never>;
//   chart_items: ChartItemData[];
// }

// // Define the slice structure
// interface InvestmentChartSlice {
//   id: string;
//   primary: InvestmentChartPrimary;
//   slice_type: string;
//   variation: string;
//   items: Record<string, never>[];
// }

// // Extend the existing Content.InvestmentChartSlice type if available
// // For now, we'll use our custom type
// export type ExtendedInvestmentChartSlice = InvestmentChartSlice;

// /**
//  * Props for `InvestmentChart`.
//  */
// export type InvestmentChartProps = SliceComponentProps<ExtendedInvestmentChartSlice>;

// /**
//  * Component for "InvestmentChart" Slices.
//  */
// const InvestmentChart: FC<InvestmentChartProps> = ({ slice }) => {
//   const [activeIndex, setActiveIndex] = useState<number | null>(null);
//   const chartRef = useRef<SVGSVGElement>(null);
//   const segmentsRef = useRef<SVGPathElement[]>([]);

//   // State for showing the floating card
//   const [showFloatingCard, setShowFloatingCard] = useState<boolean>(false);
//   const [floatingCardPosition, setFloatingCardPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
//   const [floatingCardData, setFloatingCardData] = useState<{investment: number, label: string} | null>(null);
  
//   // Ref for the floating card
//   const floatingCardRef = useRef<HTMLDivElement>(null);

//   // Predefined vibrant colors
//   const vibrantColors = [
//     '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#1A936F',
//     '#118AB2', '#073B4C', '#EF476F', '#06D6A0', '#FF9A8B'
//   ];

//   // Extract chart items from slice data and assign colors
//   const chartItems: ChartItemData[] = slice.primary.chart_items.map((item, index) => ({
//     label: item.label || "",
//     investment: item.investment || 0,
//   }));

//   // Calculate total investment
//   const totalInvestment = chartItems.reduce((sum, item) => sum + item.investment, 0);

//   // Calculate percentages based on investment
//   const chartItemsWithPercentages: ChartItem[] = chartItems.map((item, index) => ({
//     ...item,
//     percentage: totalInvestment > 0 ? (item.investment / totalInvestment) * 100 : 0,
//     color: vibrantColors[index % vibrantColors.length],
//   }));

//   // Calculate cumulative percentages for pie chart segments
//   const cumulativePercentages = chartItemsWithPercentages.reduce((acc, item, index) => {
//     acc.push((acc[index - 1] || 0) + item.percentage);
//     return acc;
//   }, [] as number[]);

//   // Convert percentages to radians for SVG path calculations
//   const percentagesToRadians = (percentages: number[]) => {
//     return percentages.map(p => (p / 100) * 2 * Math.PI);
//   };

//   const cumulativeRadians = percentagesToRadians(cumulativePercentages);

//   // Calculate SVG path for each pie segment with fixed precision to prevent hydration issues
//   const calculateSegmentPath = (startAngle: number, endAngle: number, isActive: boolean = false) => {
//     const radius = 120;
//     const innerRadius = 60;
//     const centerX = 150;
//     const centerY = 150;
    
//     // Adjust for active segment (slightly larger)
//     const adjustedRadius = isActive ? radius + 10 : radius;
//     const adjustedInnerRadius = isActive ? innerRadius + 5 : innerRadius;
    
//     // Calculate start and end points for outer arc with fixed precision
//     const x1 = parseFloat((centerX + adjustedRadius * Math.sin(startAngle)).toFixed(2));
//     const y1 = parseFloat((centerY - adjustedRadius * Math.cos(startAngle)).toFixed(2));
//     const x2 = parseFloat((centerX + adjustedRadius * Math.sin(endAngle)).toFixed(2));
//     const y2 = parseFloat((centerY - adjustedRadius * Math.cos(endAngle)).toFixed(2));
    
//     // Calculate start and end points for inner arc with fixed precision
//     const ix1 = parseFloat((centerX + adjustedInnerRadius * Math.sin(startAngle)).toFixed(2));
//     const iy1 = parseFloat((centerY - adjustedInnerRadius * Math.cos(startAngle)).toFixed(2));
//     const ix2 = parseFloat((centerX + adjustedInnerRadius * Math.sin(endAngle)).toFixed(2));
//     const iy2 = parseFloat((centerY - adjustedInnerRadius * Math.cos(endAngle)).toFixed(2));
    
//     // Determine if this is a large arc (greater than 180 degrees)
//     const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
//     // Create the path data with fixed precision to ensure consistent rendering
//     return `
//       M ${ix1} ${iy1}
//       L ${x1} ${y1}
//       A ${adjustedRadius} ${adjustedRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
//       L ${ix2} ${iy2}
//       A ${adjustedInnerRadius} ${adjustedInnerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
//       Z
//     `.trim().replace(/\s+/g, ' ');
//   };

//   // Handle hover effects with GSAP and floating card
//   const handleHover = (index: number, event?: React.MouseEvent) => {
//     setActiveIndex(index);
    
//     // Show floating card with investment data
//     const item = chartItemsWithPercentages[index];
//     setFloatingCardData({
//       investment: item.investment,
//       label: item.label
//     });
    
//     // Position the floating card near the mouse
//     if (event) {
//       setFloatingCardPosition({
//         x: event.clientX,
//         y: event.clientY
//       });
//     }
    
//     setShowFloatingCard(true);
    
//     // Animate the hovered segment with GSAP
//     if (segmentsRef.current[index]) {
//       gsap.to(segmentsRef.current[index], {
//         scale: 1.05,
//         duration: 0.3,
//         ease: "power2.out"
//       });
//     }
    
//     // Dim other segments
//     segmentsRef.current.forEach((segment, i) => {
//       if (i !== index && segment) {
//         gsap.to(segment, {
//           opacity: 0.5,
//           duration: 0.3,
//           ease: "power2.out"
//         });
//       }
//     });
//   };

//   // Reset hover effects
//   const handleLeave = () => {
//     setActiveIndex(null);
//     setShowFloatingCard(false);
    
//     // Reset all segments
//     segmentsRef.current.forEach((segment) => {
//       if (segment) {
//         gsap.to(segment, {
//           scale: 1,
//           opacity: 1,
//           duration: 0.3,
//           ease: "power2.out"
//         });
//       }
//     });
//   };

//   // Update the center text to show total investment
//   const formatTotalInvestment = (amount: number) => {
//     if (amount >= 1000000) {
//       return `£${(amount / 1000000).toFixed(1)}M`;
//     } else if (amount >= 1000) {
//       return `£${(amount / 1000).toFixed(1)}K`;
//     } else {
//       return `£${amount}`;
//     }
//   };

//   // Initial animation when component mounts
//   useEffect(() => {
//     if (chartRef.current) {
//       gsap.fromTo(
//         chartRef.current.querySelectorAll(".chart-segment"),
//         { 
//           scale: 0,
//           opacity: 0,
//           rotate: -180
//         },
//         {
//           scale: 1,
//           opacity: 1,
//           rotate: 0,
//           duration: 1,
//           stagger: 0.1,
//           ease: "back.out(1.7)"
//         }
//       );
//     }
//   }, []);

//   // Pre-calculate all paths to ensure consistency
//   const precalculatedPaths = chartItemsWithPercentages.map((item, index) => {
//     // We're calculating these in the render method now to avoid hydration issues
//     return "";
//   });

//   return (
//     <section className="relative py-20 overflow-hidden">
//       {/* Background image */}
//       {slice.primary.background_image?.url && (
//         <div className="absolute inset-0 z-0">
//           <PrismicNextImage 
//             field={slice.primary.background_image} 
//             className="object-cover w-full h-full"
//             fill
//           />
//           <div className="absolute inset-0 bg-black/70"></div>
//         </div>
//       )}

//       <div className="container mx-auto px-6 relative z-10">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Left content - Moved higher and increased font size */}
//           <div className="text-white pt-8">
//             <div className="mb-8">
//               <PrismicRichText 
//                 field={slice.primary.heading}
//                 components={{
//                   heading2: ({ children }) => (
//                     <h2 className="text-4xl md:text-5xl font-bold mb-6">{children}</h2>
//                   )
//                 }}
//               />
              
//               <PrismicRichText 
//                 field={slice.primary.title}
//                 components={{
//                   heading3: ({ children }) => (
//                     <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-[#03ECF2]">{children}</h3>
//                   )
//                 }}
//               />
              
//               <PrismicRichText 
//                 field={slice.primary.description}
//                 components={{
//                   paragraph: ({ children }) => (
//                     <p className="text-xl text-gray-200 leading-relaxed">{children}</p>
//                   )
//                 }}
//               />
//             </div>
//           </div>

//           {/* Right content - Reorganized chart and list */}
//           <div className="flex flex-row items-center gap-8">
//             {/* Table of contents - Moved to the left of the chart */}
//             <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 min-w-[250px]">
//               <ul className="space-y-3">
//                 {chartItemsWithPercentages.map((item, index) => (
//                   <li 
//                     key={index}
//                     className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 cursor-pointer ${
//                       activeIndex === index 
//                         ? 'bg-white/20 scale-[1.02]' 
//                         : activeIndex !== null
//                           ? 'opacity-50 hover:opacity-100 hover:bg-white/10' 
//                           : 'hover:bg-white/10'
//                     }`}
//                     onMouseEnter={(e) => handleHover(index, e)}
//                     onMouseLeave={handleLeave}
//                   >
//                     <div className="flex items-center">
//                       <div 
//                         className="w-4 h-4 rounded-full mr-3" 
//                         style={{ backgroundColor: item.color }}
//                       ></div>
//                       <span className="text-white font-medium">{item.label}</span>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             </div>
            
//             {/* Pie chart - Back to 400x400 */}
//             <div className="relative">
//               <svg 
//                 width="400" 
//                 height="400" 
//                 viewBox="0 0 300 300"
//                 className="drop-shadow-2xl"
//                 ref={chartRef}
//               >
//                 {chartItemsWithPercentages.map((item, index) => {
//                   const startAngle = index === 0 ? 0 : cumulativeRadians[index - 1];
//                   const endAngle = cumulativeRadians[index];
                  
//                   return (
//                     <motion.path
//                       key={index}
//                       ref={(el) => {
//                         if (el) segmentsRef.current[index] = el;
//                       }}
//                       d={calculateSegmentPath(startAngle, endAngle, activeIndex === index)}
//                       fill={item.color}
//                       className="chart-segment cursor-pointer"
//                       initial={{ pathLength: 0 }}
//                       animate={{ pathLength: 1 }}
//                       transition={{ duration: 1, delay: index * 0.1 }}
//                       onMouseEnter={(e) => handleHover(index, e)}
//                       onMouseLeave={handleLeave}
//                       // Add elevation effect on hover
//                       style={{
//                         filter: activeIndex === index ? 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' : 'none',
//                         transform: activeIndex === index ? 'translate(-2px, -2px) scale(1.02)' : 'none',
//                         transformOrigin: 'center',
//                         transition: 'transform 0.3s ease, filter 0.3s ease'
//                       }}
//                     />
//                   );
//                 })}
                
//                 {/* Center circle with total */}
//                 <circle cx="150" cy="150" r="40" fill="#0a0a0a" />
//                 <text 
//                   x="150" 
//                   y="150" 
//                   textAnchor="middle" 
//                   dominantBaseline="middle" 
//                   className="text-lg font-bold fill-white"
//                 >
//                   {formatTotalInvestment(totalInvestment)}
//                 </text>
//               </svg>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Floating card for investment details - Positioned away from the chart */}
//       {showFloatingCard && floatingCardData && (
//         <div
//           ref={floatingCardRef}
//           className="fixed bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white z-50 pointer-events-none border border-white/20 shadow-2xl"
//           style={{
//             left: `${floatingCardPosition.x + 20}px`,
//             top: `${floatingCardPosition.y - 20}px`,
//             transform: 'translate(-50%, -100%)',
//             minWidth: '200px'
//           }}
//         >
//           <div className="font-bold text-xl mb-1">
//             £{floatingCardData.investment.toLocaleString()}
//           </div>
//           <div className="text-sm opacity-80">
//             {floatingCardData.label}
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default InvestmentChart;