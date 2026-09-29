import { q } from './helpers.js';

export default {
  overview: { quiz: [q('Which best describes data science?', ['An interdisciplinary field extracting insight from data using statistics, computing and domain knowledge', 'Only machine learning', 'Only databases', 'Only charts'], 0, 'It spans collection, cleaning, analysis, modelling, communication and deployment.')] },
  ch1: {
    labs: [{ type: 'widget', name: 'regression', title: 'Regression playground' }, { type: 'widget', name: 'confusion', title: 'Model evaluation: precision, recall, F1' }],
    quiz: [
      q('Which are supervised learning tasks?', ['Regression', 'Classification', 'Clustering', 'Dimensionality reduction'], [0, 1], 'Supervised = learn from labelled data. Clustering and PCA are unsupervised.'),
      q('EDA stands for…', ['Exploratory data analysis', 'Extract data automatically', 'Encoded data array', 'Evaluated decision algorithm'], 0, 'Summary statistics and plots before modelling.'),
      q('Precision measures…', ['Of predicted positives, how many are correct', 'Of real positives, how many were found', 'Overall accuracy', 'Training speed'], 0, 'Recall is the second one.'),
      q('Feature engineering includes…', ['Encoding categorical variables', 'Log-scaling', 'Feature selection', 'Drawing pie charts'], [0, 1, 2], 'It creates or transforms variables to help a model learn.'),
      q('K-Means is…', ['An unsupervised clustering algorithm', 'A supervised classifier', 'A database', 'A chart type'], 0, 'It groups unlabelled points.'),
      q('Cross-validation is used to…', ['Check a model generalises across several train/test splits', 'Speed up SQL', 'Clean data', 'Deploy an API'], 0, 'Together with hyperparameter tuning (grid or random search).'),
    ],
  },
  ch2: {
    labs: [{ type: 'widget', name: 'workflow', title: 'Order the workflow' }],
    quiz: [
      q('What comes FIRST in a data science project?', ['Define the problem', 'Build models', 'Deploy', 'Collect data'], 0, 'Understand the business question before touching data.'),
      q('Where does “Explore and prepare data” sit?', ['Between collecting data and building models', 'After deployment', 'Before defining the problem', 'It is optional'], 0, 'Clean data ensures accurate models.'),
    ],
  },
  ch3: {
    quiz: [
      q('Which are Python data science libraries?', ['NumPy', 'Pandas', 'Scikit-learn', 'Hadoop'], [0, 1, 2], 'Hadoop and Spark are big-data platforms.'),
      q('Which is a visualization tool?', ['Tableau', 'Spark', 'AWS', 'Flask'], 0, 'Also Power BI and Plotly.'),
      q('Fraud detection and credit scoring belong to which application area?', ['Finance', 'Healthcare', 'Marketing', 'Social media'], 0, 'Healthcare: disease prediction; Marketing: campaign optimisation.'),
    ],
  },
  ch4: {
    quiz: [
      q('“Interpretability” is the challenge of…', ['Explaining complex models to non-technical stakeholders', 'Cleaning data', 'Storing big data', 'Choosing colours'], 0, 'Privacy and bias fall under ethics.'),
      q('Which are ethical concerns?', ['Privacy', 'Bias in algorithms', 'Chart colours', 'Data quality only'], [0, 1], 'Data quality and scalability are technical challenges.'),
    ],
  },
  'roadmap-to-learn-data-science': {
    labs: [{ type: 'widget', name: 'roadmap', title: 'Your data science roadmap' }],
    quiz: [q('Which step comes right after mastering Python and SQL in the roadmap?', ['Learn data manipulation (Pandas, NumPy)', 'Deep learning', 'Build a portfolio', 'NLP'], 0, 'Then statistics/ML, EDA, advanced topics, projects and a portfolio.')],
  },
};
