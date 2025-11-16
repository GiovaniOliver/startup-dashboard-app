import "./InternPerformanceChart.scss";
import StarIcon from '@mui/icons-material/Star';

const InternPerformanceChart = ({ evaluations }) => {
  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="internPerformanceChart">
        <div className="noData">
          <p>No performance evaluations yet</p>
        </div>
      </div>
    );
  }

  const latestEvaluation = evaluations[evaluations.length - 1];

  const performanceMetrics = [
    { label: "Technical Skills", value: latestEvaluation.technicalSkills, max: 5 },
    { label: "Communication", value: latestEvaluation.communication, max: 5 },
    { label: "Teamwork", value: latestEvaluation.teamwork, max: 5 },
    { label: "Initiative", value: latestEvaluation.initiative, max: 5 },
  ];

  const overallRating = latestEvaluation.overallRating;

  return (
    <div className="internPerformanceChart">
      <div className="chartHeader">
        <h3>Latest Performance Review</h3>
        <div className="overallRating">
          <StarIcon />
          <span>{overallRating.toFixed(1)}</span>
        </div>
      </div>

      <div className="metricsContainer">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="metricItem">
            <div className="metricLabel">
              <span>{metric.label}</span>
              <span className="metricValue">{metric.value.toFixed(1)}</span>
            </div>
            <div className="metricBar">
              <div
                className="metricFill"
                style={{ width: `${(metric.value / metric.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="evaluationDetails">
        <div className="evaluationMeta">
          <span className="evaluator">By: {latestEvaluation.evaluator}</span>
          <span className="evaluationDate">
            {new Date(latestEvaluation.date).toLocaleDateString()}
          </span>
        </div>
        {latestEvaluation.comments && (
          <div className="evaluationComments">
            <p>{latestEvaluation.comments}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternPerformanceChart;
