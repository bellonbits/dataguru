# Data Science

Source: *Data Analysis Made Easy*, pp. 246–254.

## Chapter 1: Introduction to data science

Data science is an interdisciplinary field. It extracts insight from data using statistics, mathematics, computing and domain expertise.

| # | Component | Key points | Tools |
|---|---|---|---|
| 1 | Data collection | Gather raw data from databases, APIs, web scraping, sensors, logs and surveys | SQL, `requests`, BeautifulSoup, Selenium, ETL tools |
| 2 | Data cleaning | Handle missing values (`fillna`, `dropna`), remove duplicates, detect outliers (boxplots, z-scores), standardize formats | Pandas |
| 3 | Exploratory data analysis | Descriptive stats (mean, median, mode, variance), visualization, correlation | Matplotlib, Seaborn, Pandas, Excel |
| 4 | Feature engineering | Extraction, transformation (log scaling, normalization), encoding (one-hot, label), feature selection | Scikit-learn, Pandas |
| 5 | Statistical analysis | Distributions (Normal, Binomial, Poisson), hypothesis tests (t-test, chi-square), ANOVA, regression | — |
| 6 | Data visualization | Line, bar, pie, scatter, heatmap, treemap, word cloud | Matplotlib, Seaborn, Plotly, Tableau, Power BI |
| 7 | Machine learning | See below | Scikit-learn, TensorFlow, PyTorch |
| 8 | Deep learning | Multi-layer neural networks: CNNs for images, RNNs for sequences. Used for image recognition, NLP and autonomous vehicles. | TensorFlow, Keras, PyTorch |
| 9 | Big data | Datasets too large for traditional tools. Distributed computing and batch or real-time processing. | Hadoop, Spark |
| 10 | NLP | Tokenization, lemmatization, stemming, sentiment analysis, named-entity recognition, language models (BERT, GPT) | NLTK, spaCy, Transformers |
| 11 | Model evaluation | See below | — |
| 12 | Deployment | Serialize models (pickle, joblib), expose APIs (Flask, FastAPI), monitor and update | — |
| 13 | Domain knowledge | Finance, healthcare, marketing, e-commerce. It makes the results relevant. | — |
| 14 | Soft skills | Communication, collaboration with engineers and analysts, problem-solving, critical thinking | — |

**Machine-learning types**
- **Supervised** learns from labeled data. It covers regression and classification. Algorithms: linear regression, decision trees, random forests, SVM, neural networks.
- **Unsupervised** finds patterns in unlabeled data. It covers clustering and dimensionality reduction. Algorithms: K-Means, PCA, autoencoders.
- **Reinforcement** learns by interacting with an environment and getting feedback. Examples: game AI, robotics.

**Model evaluation**
- Classification metrics: accuracy, precision, recall, F1, ROC-AUC.
- Regression metrics: RMSE, MAE, R².
- Techniques: cross-validation, and hyperparameter tuning with grid search or random search.

## Chapter 2: Data science workflow

1. **Define the problem.** Understand the business question.
2. **Collect data** from internal or external sources.
3. **Explore and prepare data.** Clean and preprocess.
4. **Build models** with statistical or ML techniques.
5. **Evaluate models** and refine them.
6. **Communicate insights** through visuals and reports.
7. **Deploy and monitor** in production.

## Chapter 3: Tools and technologies

- **Languages:** Python, R, SQL.
- **Libraries:** NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow, PyTorch.
- **Visualization:** Power BI, Tableau, Plotly.
- **Big data:** Hadoop, Spark.
- **Cloud:** AWS, Google Cloud, Microsoft Azure.

**Applications**

| Field | Uses |
|---|---|
| Business intelligence | Sales forecasting, customer segmentation |
| Healthcare | Disease prediction, treatment optimization |
| Finance | Fraud detection, credit scoring |
| Marketing | Campaign optimization, customer lifetime value |
| E-commerce | Recommendations, dynamic pricing |
| Social media | Sentiment analysis, trend detection |

## Chapter 4: Challenges

1. **Data quality:** incomplete or noisy data.
2. **Scalability:** handling large datasets efficiently.
3. **Interpretability:** explaining complex models to non-technical stakeholders.
4. **Ethics:** privacy and algorithmic bias.

## Roadmap to learn data science

1. Master programming fundamentals (Python, SQL).
2. Learn data manipulation (Pandas, NumPy).
3. Study statistics and ML concepts.
4. Practice EDA and visualization.
5. Explore advanced topics (NLP, deep learning).
6. Build real projects.
7. Build a portfolio and seek internships or certifications.
