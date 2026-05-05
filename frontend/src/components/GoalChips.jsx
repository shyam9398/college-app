import React from 'react';

const GOAL_OPTIONS = [
  { value: 'All', label: 'All Goals' },
  { value: 'Engineering', label: 'Engineering' },
  { value: 'Medicine', label: 'Medicine' },
  { value: 'Law', label: 'Law' },
  { value: 'MBA', label: 'MBA' },
  { value: 'Design', label: 'Design' },
  { value: 'Science', label: 'Science' }
];

const GOAL_TO_COURSE_MAP = {
  Engineering: 'B.Tech',
  Medicine: 'MBBS',
  Law: 'LLB',
  MBA: 'MBA',
  Design: 'B.Des',
  Science: 'B.Sc'
};

function GoalChips({ goal, onGoalChange }) {
  return (
    <div className="goal-chips">
      <div className="goal-chips__scroll">
        {GOAL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`goal-chip ${goal === option.value ? 'goal-chip--active' : ''}`}
            onClick={() => onGoalChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { GOAL_OPTIONS, GOAL_TO_COURSE_MAP };
export default React.memo(GoalChips);

