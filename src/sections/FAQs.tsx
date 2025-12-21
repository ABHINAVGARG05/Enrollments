import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import BoundingBox from '../components/BoundingBox';
import '../components/FaqItem.css';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // ref for the scrollable FAQ container
  const faqRef = useRef<HTMLDivElement | null>(null);

  const faqData = [
    {
      category: 'APPLICATION',
      question: 'What kinds of roles or positions are available within the club?',
      answer:
        'Role of Core Committee member is available for Technical, Management and Design domain.',
      icon: '/fox-avatar.png',  
    },
    {
      category: 'APPLICATION',
      question: 'Can I apply for multiple roles simultaneously?',
      answer: 'Yes, one can apply for multiple domains.',
      icon: '/fox-avatar.png',  
    },
    {
      category: 'DEADLINE',
      question: 'Is there a deadline for submitting applications?',
      answer:
        'The deadline will be informed in advanced based on the domain you choose to apply in.',
      icon: '/fox-avatar.png', 
    },
    {
      category: 'SUBMISSION',
      question: 'How can I edit or update my application after submission?',
      answer: 'Submissions cannot be edited once uploaded.',
      icon: '/fox-avatar.png', 
    },
    {
      category: 'GENERAL',
      question: 'What is the selection process?',
      answer:
        'Recruitment task will be followed by an interview conducted by the Core Committee.',
      icon: '/fox-avatar.png', 
    },
  ];
  const toggleFaq = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const filteredFaqs = faqData; 

  // Track scroll on the internal FAQ container (faqRef)
  useEffect(() => {
    const el = faqRef.current;
    if (!el) return;

    const handleScroll = () => {
      const scrollTop = el.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    // Attach to element scroll
    el.addEventListener('scroll', handleScroll, { passive: true });

    // Initialize once (in case element already scrolled)
    handleScroll();

    // Cleanup
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, []); // run once on mount

  return (
    <div className="w-full min-h-screen h-full flex flex-col md:flex-row justify-center items-center pt-0 px-4 overflow-auto">
      <Navbar />
      <BoundingBox className="relative overflow-hidden">
        <div className="faq-page-container h-full custom-scroll overflow-y-auto" ref={faqRef}>
          {/* Scroll Progress Indicator (now reflects faqRef scroll) */}
          <div className="scroll-indicator" aria-hidden>
            <div
              className="scroll-progress"
              style={{ height: `${scrollProgress}%` }}
            />
          </div>

          {/* scrollable container (faqRef) */}
          <div className="faq-content-wrapper">
            {/* Header */}
            <div className="faq-header">
              <h1 className="faq-title">FAQs</h1>
              <p className="faq-subtitle">
                Everything you need to know about Mozilla Firefox Recruitment
              </p>
            </div>

            {/* FAQ Grid */}
            <div className="faq-grid">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  onClick={() => toggleFaq(index)}
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  {/* Category Tag */}
                  <span className="category-tag">{faq.category}</span>

                  {/* Question Section */}
                  <div className="question-section">
                    <div className="avatar">
                      <img src={faq.icon} alt="Fox avatar" className="avatar-img" />
                    </div>
                    <div className="question-text">{faq.question}</div>
                  </div>

                  {/* Answer Section */}
                  <div
                    className={`answer-section ${activeIndex === index ? 'active' : ''
                      }`}
                  >
                    {/* <div className="avatar avatar-bg">
                      <img src="/target-avatar.png" alt="Target avatar" className="avatar-img" />
                    </div> */}
                    <div className="answer-text">{faq.answer}</div>
                  </div>

                  {/* Toggle Icon */}
                  <div className="toggle-icon">+</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </BoundingBox>
    </div>
  );
};

export default FAQs;
