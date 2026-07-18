# 📊 ApexPlanet Internship - Data Analysis Project

## 🔍 Project Overview
This project is part of the ApexPlanet Internship and focuses on **data storytelling and statistical validation** using Python.
The goal is to synthesize all findings from Tasks 1-3 into a compelling business narrative and validate key findings using statistical tests.

---

## 📁 Dataset
- **Name:** E-Commerce Sales Dataset
- **Size:** 5,000 orders | 2023-2024
- Contains information about:
  - Revenue & Order Value
  - Product Categories
  - Customer Segments & Age Groups
  - Acquisition Channels
  - Order Status

---

## 🔬 Task 4: Data Storytelling & Statistical Validation (Python)

✅ Data Story Crafted:
- Chapter 1 — Setting the Scene (total revenue, order overview)
- Chapter 2 — The Problem (low retention, high returns, cancellations)
- Chapter 3 — The Opportunity (festive season, mobile app, premium segment)
- Chapter 4 — Recommendations (5 actionable business recommendations)
- Chapter 5 — Call to Action (retention is the #1 priority)

✅ Hypothesis Tests Performed:

| Hypothesis | Test | P-Value | Result |
|---|---|---|---|
| Mobile App AOV > Website AOV | T-Test | 0.0828 | Not Significant |
| 36-45 AOV > 18-25 AOV | T-Test | 0.2317 | Not Significant |
| Cancellation rate differs by channel | Chi-Squared | 0.7467 | Not Significant |
| October AOV > Other months | T-Test | 0.0075 | **Significant ✅** |

✅ Key Statistical Finding:
- **October revenue is statistically significantly higher** than other months (p=0.0075)
- This confirms the festive season effect is real and not due to random chance

---

## 🗂️ Data Dictionary
| Column | Description |
|---|---|
| customer_id | Unique customer ID |
| order_id | Unique order ID |
| revenue | Revenue per order |
| order_status | Delivered / Cancelled / Returned |
| age_group | Customer age group |
| acquisition_channel | How customer was acquired |
| customer_rating | Satisfaction score (1-5) |
| order_month | Month of order |
| is_cancelled | Whether order was cancelled |

---

## 🛠️ Tools Used
- Python (Pandas, Matplotlib, Seaborn, SciPy)
- VS Code
- GitHub

---

## 🖥️ Output Charts

### Revenue Journey
![Revenue Journey](outputs/story_revenue_journey.png)

### Hypothesis Testing
![Hypothesis Testing](outputs/hypothesis_testing_charts.png)

### Story Summary
![Story Summary](outputs/story_summary_chart.png)

---

## 🚀 Key Insights
- October revenue is statistically significantly higher (p=0.0075) — festive season is real
- Month-1 retention is only 6% — biggest growth opportunity
- Mobile App drives highest revenue (Rs.2.14Cr)
- 36-45 age group has highest AOV (Rs.20,641)
- Beauty has highest return rate (10.4%)

---

## 🔗 Conclusion
This task demonstrates how data findings can be structured into a compelling business narrative and validated using statistical hypothesis testing.

---

## 👩‍💻 Author
Devi Sri
ApexPlanet Data Analytics Internship
