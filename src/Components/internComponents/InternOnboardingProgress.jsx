import "./InternOnboardingProgress.scss";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const InternOnboardingProgress = ({ checklist, onToggle }) => {
  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="internOnboardingProgress">
      <div className="progressHeader">
        <h3>Onboarding Progress</h3>
        <div className="progressStats">
          <span className="progressCount">
            {completedCount} / {totalCount}
          </span>
          <span className="progressPercentage">{progressPercentage}%</span>
        </div>
      </div>

      <div className="progressBarContainer">
        <div className="progressBar">
          <div
            className="progressFill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="checklistItems">
        {checklist.map((item, index) => (
          <div
            key={index}
            className={`checklistItem ${item.completed ? 'completed' : ''}`}
            onClick={() => onToggle && onToggle(index)}
            style={{ cursor: onToggle ? 'pointer' : 'default' }}
          >
            <div className="checkIcon">
              {item.completed ? (
                <CheckCircleIcon />
              ) : (
                <RadioButtonUncheckedIcon />
              )}
            </div>
            <span className="itemText">{item.item}</span>
          </div>
        ))}
      </div>

      {progressPercentage === 100 && (
        <div className="completionBadge">
          <CheckCircleIcon />
          <span>Onboarding Complete!</span>
        </div>
      )}
    </div>
  );
};

export default InternOnboardingProgress;
