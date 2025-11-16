import React from 'react';
import './LoadingSpinner.scss';

const LoadingSpinner = ({
  size = 'medium',
  color = 'primary',
  fullScreen = false,
  text = null,
  overlay = false
}) => {
  const sizeClass = `spinner-${size}`;
  const colorClass = `spinner-${color}`;

  const spinner = (
    <div
      className={`loading-spinner ${sizeClass} ${colorClass}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="spinner-circle">
        <div className="spinner-inner"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
      <span className="sr-only">Loading...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        {spinner}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className="loading-overlay">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const SkeletonLoader = ({
  type = 'text',
  count = 1,
  width = '100%',
  height = null
}) => {
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={`skeleton skeleton-${type}`}
      style={{
        width: width,
        height: height || (type === 'text' ? '1em' : type === 'title' ? '2em' : 'auto')
      }}
      aria-hidden="true"
    />
  ));

  return <div className="skeleton-container">{skeletons}</div>;
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-avatar"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-text"></div>
        <div className="skeleton skeleton-text"></div>
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="skeleton-table" aria-hidden="true">
      <div className="skeleton-table-header">
        {Array.from({ length: columns }, (_, i) => (
          <div key={i} className="skeleton skeleton-text"></div>
        ))}
      </div>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="skeleton-table-row">
          {Array.from({ length: columns }, (_, j) => (
            <div key={j} className="skeleton skeleton-text"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const ProgressBar = ({
  progress = 0,
  showPercentage = true,
  color = 'primary',
  height = '8px'
}) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="progress-bar-container" role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
      <div
        className={`progress-bar progress-${color}`}
        style={{
          width: `${percentage}%`,
          height: height
        }}
      >
        {showPercentage && (
          <span className="progress-percentage">{percentage}%</span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
