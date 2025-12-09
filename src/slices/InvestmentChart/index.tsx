"use client";

import { FC, useState, useEffect, useRef } from "react";
import { Content, ImageField, RichTextField } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import { motion } from "framer-motion";
import gsap from "gsap";

// Define the type for chart items
interface ChartItemData {
  label: string;
  percentage: number;
}

interface ChartItem {
  label: string;
  percentage: number;
  color: string;
}

// Define the primary fields for the InvestmentChart slice
interface InvestmentChartPrimary {
  heading: RichTextField;
  title: RichTextField;
  description: RichTextField;
  background_image: ImageField<never>;
  chart_items: ChartItemData[];
}

// Define the slice structure
interface InvestmentChartSlice {
  id: string;
  primary: InvestmentChartPrimary;
  slice_type: string;
  variation: string;
  items: Record<string, never>[];
}

// Extend the existing Content.InvestmentChartSlice type if available
// For now, we'll use our custom type
export type ExtendedInvestmentChartSlice = InvestmentChartSlice;

/**
 * Props for `InvestmentChart`.
 */
export type InvestmentChartProps = SliceComponentProps<ExtendedInvestmentChartSlice>;

/**
 * Component for "InvestmentChart" Slices.
 */
const InvestmentChart: FC<InvestmentChartProps> = ({ slice }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement>(null);
  const segmentsRef = useRef<SVGPathElement[]>([]);

  // Predefined vibrant colors
  const vibrantColors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#1A936F',
    '#118AB2', '#073B4C', '#EF476F', '#06D6A0', '#FF9A8B'
  ];

  // Extract chart items from slice data and assign colors
  const chartItems: ChartItem[] = slice.primary.chart_items.map((item, index) => ({
    label: item.label || "",
    percentage: item.percentage || 0,
    color: vibrantColors[index % vibrantColors.length],
  }));

  // Calculate cumulative percentages for pie chart segments
  const cumulativePercentages = chartItems.reduce((acc, item, index) => {
    acc.push((acc[index - 1] || 0) + item.percentage);
    return acc;
  }, [] as number[]);

  // Convert percentages to radians for SVG path calculations
  const percentagesToRadians = (percentages: number[]) => {
    return percentages.map(p => (p / 100) * 2 * Math.PI);
  };

  const cumulativeRadians = percentagesToRadians(cumulativePercentages);

  // Calculate SVG path for each pie segment
  const calculateSegmentPath = (startAngle: number, endAngle: number, isActive: boolean = false) => {
    const radius = 120;
    const innerRadius = 60;
    const centerX = 150;
    const centerY = 150;
    
    // Adjust for active segment (slightly larger)
    const adjustedRadius = isActive ? radius + 10 : radius;
    const adjustedInnerRadius = isActive ? innerRadius + 5 : innerRadius;
    
    // Calculate start and end points for outer arc
    const x1 = centerX + adjustedRadius * Math.sin(startAngle);
    const y1 = centerY - adjustedRadius * Math.cos(startAngle);
    const x2 = centerX + adjustedRadius * Math.sin(endAngle);
    const y2 = centerY - adjustedRadius * Math.cos(endAngle);
    
    // Calculate start and end points for inner arc
    const ix1 = centerX + adjustedInnerRadius * Math.sin(startAngle);
    const iy1 = centerY - adjustedInnerRadius * Math.cos(startAngle);
    const ix2 = centerX + adjustedInnerRadius * Math.sin(endAngle);
    const iy2 = centerY - adjustedInnerRadius * Math.cos(endAngle);
    
    // Determine if this is a large arc (greater than 180 degrees)
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    // Create the path data
    return `
      M ${ix1} ${iy1}
      L ${x1} ${y1}
      A ${adjustedRadius} ${adjustedRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${ix2} ${iy2}
      A ${adjustedInnerRadius} ${adjustedInnerRadius} 0 ${largeArcFlag} 0 ${ix1} ${iy1}
      Z
    `;
  };

  // Handle hover effects with GSAP
  const handleHover = (index: number) => {
    setActiveIndex(index);
    
    // Animate the hovered segment with GSAP
    if (segmentsRef.current[index]) {
      gsap.to(segmentsRef.current[index], {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out"
      });
    }
    
    // Dim other segments
    segmentsRef.current.forEach((segment, i) => {
      if (i !== index && segment) {
        gsap.to(segment, {
          opacity: 0.5,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  };

  // Reset hover effects
  const handleLeave = () => {
    setActiveIndex(null);
    
    // Reset all segments
    segmentsRef.current.forEach((segment) => {
      if (segment) {
        gsap.to(segment, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    });
  };

  // Initial animation when component mounts
  useEffect(() => {
    if (chartRef.current) {
      gsap.fromTo(
        chartRef.current.querySelectorAll(".chart-segment"),
        { 
          scale: 0,
          opacity: 0,
          rotate: -180
        },
        {
          scale: 1,
          opacity: 1,
          rotate: 0,
          duration: 1,
          stagger: 0.1,
          ease: "back.out(1.7)"
        }
      );
    }
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background image */}
      {slice.primary.background_image?.url && (
        <div className="absolute inset-0 z-0">
          <PrismicNextImage 
            field={slice.primary.background_image} 
            className="object-cover w-full h-full"
            fill
          />
          <div className="absolute inset-0 bg-black/70"></div>
        </div>
      )}

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <div className="mb-8">
              <PrismicRichText 
                field={slice.primary.heading}
                components={{
                  heading2: ({ children }) => (
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{children}</h2>
                  )
                }}
              />
              
              <PrismicRichText 
                field={slice.primary.title}
                components={{
                  heading3: ({ children }) => (
                    <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-[#03ECF2]">{children}</h3>
                  )
                }}
              />
              
              <PrismicRichText 
                field={slice.primary.description}
                components={{
                  paragraph: ({ children }) => (
                    <p className="text-lg text-gray-200 leading-relaxed">{children}</p>
                  )
                }}
              />
            </div>
          </div>

          {/* Right content - Pie chart with table of contents */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Pie chart */}
            <div className="relative">
              <svg 
                width="300" 
                height="300" 
                viewBox="0 0 300 300"
                className="drop-shadow-2xl"
                ref={chartRef}
              >
                {chartItems.map((item, index) => {
                  const startAngle = index === 0 ? 0 : cumulativeRadians[index - 1];
                  const endAngle = cumulativeRadians[index];
                  
                  return (
                    <motion.path
                      key={index}
                      ref={(el) => {
                        if (el) segmentsRef.current[index] = el;
                      }}
                      d={calculateSegmentPath(startAngle, endAngle, activeIndex === index)}
                      fill={item.color}
                      className="chart-segment cursor-pointer"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      onMouseEnter={() => handleHover(index)}
                      onMouseLeave={handleLeave}
                    />
                  );
                })}
                
                {/* Center circle with total */}
                <circle cx="150" cy="150" r="40" fill="#0a0a0a" />
                <text 
                  x="150" 
                  y="150" 
                  textAnchor="middle" 
                  dominantBaseline="middle" 
                  className="text-lg font-bold fill-white"
                >
                  £119K
                </text>
              </svg>
            </div>

            {/* Table of contents */}
            <div className="bg-black/30 backdrop-blur-sm rounded-xl p-6 min-w-[250px]">
              <h3 className="text-xl font-bold text-white mb-4">Investment Breakdown</h3>
              <ul className="space-y-3">
                {chartItems.map((item, index) => (
                  <li 
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 cursor-pointer ${
                      activeIndex === index 
                        ? 'bg-white/10 scale-[1.02]' 
                        : 'hover:bg-white/5'
                    }`}
                    onMouseEnter={() => handleHover(index)}
                    onMouseLeave={handleLeave}
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-white font-medium">{item.label}</span>
                    </div>
                    <span className="text-gray-300 font-semibold">{item.percentage}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentChart;