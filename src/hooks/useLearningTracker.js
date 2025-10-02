import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trackLearningInteraction, updateProgressIndicator } from '../services/learningContextService';

// Custom hook to track learning interactions
export const useLearningTracker = (topic, category, options = {}) => {
  const { user } = useAuth();
  const startTimeRef = useRef(Date.now());
  const trackedRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
    trackedRef.current = false;

    return () => {
      if (user && !trackedRef.current) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        
        // Track the interaction
        trackLearningInteraction(user.id, topic, category, timeSpent);
        
        // Update progress indicator if specified
        if (options.trackProgress) {
          updateProgressIndicator(user.id, category, {
            topic,
            contentConsumed: options.contentConsumed || false,
            questionAsked: options.questionAsked || false,
            questionAnswered: options.questionAnswered || false,
            resourceViewed: options.resourceViewed || false
          });
        }
        
        trackedRef.current = true;
      }
    };
  }, [user, topic, category, options]);

  // Function to manually track specific actions
  const trackAction = async (action) => {
    if (!user) return;

    const updateOptions = {
      topic,
      [action]: true
    };

    await updateProgressIndicator(user.id, category, updateOptions);
  };

  return { trackAction };
};

// Hook to track time spent on a page
export const usePageTimeTracker = (pageName, category) => {
  const { user } = useAuth();
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    startTimeRef.current = Date.now();

    return () => {
      if (user) {
        const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
        if (timeSpent > 5) { // Only track if spent more than 5 seconds
          trackLearningInteraction(user.id, pageName, category, timeSpent);
        }
      }
    };
  }, [user, pageName, category]);
};
