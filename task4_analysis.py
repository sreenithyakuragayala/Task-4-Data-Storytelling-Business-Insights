"""
Task 4 — Data Storytelling & Statistical Validation
ApexPlanet Software Pvt. Ltd. | Data Analytics Internship (60 Days)

Continues from Tasks 1, 2, 3.
Steps:
  1. Craft the Data Story (narrative from Tasks 1-3)
  2. Hypothesis Testing (T-test, Chi-squared)
  3. Generate story charts
  4. Export hypothesis testing summary
"""

import os
import warnings
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import seaborn as sns
from scipy import stats

warnings.filterwarnings("ignore")
os.makedirs("outputs", exist_ok=True)

# ── Palette (same as Task 2 & 3) ─────────────────────────────────────────────
PALETTE = ["#6C5CE7","#00CEC9","#FDCB6E","#E17055","#74B9FF","#A29BFE","#55EFC4"]
sns.set_theme(style="whitegrid", palette=PALETTE)
plt.rcParams.update({"figure.dpi": 120, "font.size": 10})

# ── Load Data ─────────────────────────────────────────────────────────────────
print("=" * 60)
print("TASK 4 — Data Storytelling & Statistical Validation")
print("=" * 60)

df = pd.read_csv("cleaned_ecommerce_orders.csv", parse_dates=["order_date"])
df["order_year"]  = df["order_date"].dt.year
df["order_month"] = df["order_date"].dt.month
if "is_cancelled" not in df.columns:
    df["is_cancelled"] = (df["order_status"] == "Cancelled").astype(int)
delivered = df[df["order_status"] == "Delivered"].copy()
print(f"Loaded: {len(df):,} rows x {df.shape[1]} cols")

# =============================================================================
# STEP 1 — CRAFT THE DATA STORY
# =============================================================================
print("\n" + "-"*50)
print("STEP 1 — Crafting the Data Story")
print("-"*50)

# Story Chart 1 — Revenue Journey (full narrative arc)
monthly = (delivered.groupby(["order_year","order_month"])["revenue"]
           .sum().reset_index().sort_values(["order_year","order_month"]))
monthly["label"] = (monthly["order_year"].astype(str) + "-" +
                    monthly["order_month"].astype(str).str.zfill(2))

fig, ax = plt.subplots(figsize=(14, 5))
ax.plot(monthly["label"], monthly["revenue"]/1e6,
        color=PALETTE[0], linewidth=2.5, marker="o", markersize=5)
ax.fill_between(monthly["label"], monthly["revenue"]/1e6,
                alpha=0.12, color=PALETTE[0])

# Annotate key story points
peak_idx = monthly["revenue"].idxmax()
ax.annotate(f"Peak: Rs.{monthly.loc[peak_idx,'revenue']/1e6:.1f}M\n(Oct - Festive Season)",
            xy=(monthly.loc[peak_idx,"label"], monthly.loc[peak_idx,"revenue"]/1e6),
            xytext=(peak_idx-4, monthly.loc[peak_idx,"revenue"]/1e6 + 0.3),
            arrowprops=dict(arrowstyle="->", color=PALETTE[3]),
            fontsize=8, color=PALETTE[3], fontweight="bold")

ax.set_title("Revenue Story — 24-Month Journey (2023–2024)",
             fontsize=13, fontweight="bold")
ax.set_xlabel("Month"); ax.set_ylabel("Revenue (Rs.M)")
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f"Rs.{x:.1f}M"))
plt.xticks(rotation=45, ha="right", fontsize=7)
ax.grid(alpha=0.4)
plt.tight_layout()
plt.savefig("outputs/story_revenue_journey.png", bbox_inches="tight")
plt.close()
print("Saved: outputs/story_revenue_journey.png")

# Story Chart 2 — The Customer Funnel
funnel_data = {
    "Total Orders":    len(df),
    "Delivered":       len(df[df["order_status"]=="Delivered"]),
    "Rated 4+ Stars":  len(df[df["customer_rating"] >= 4]),
    "Repeat Customers":len(df.groupby("customer_id").filter(lambda x: len(x)>1)),
}
fig, ax = plt.subplots(figsize=(10, 5))
colors_f = [PALETTE[0], PALETTE[1], PALETTE[2], PALETTE[4]]
bars = ax.barh(list(funnel_data.keys())[::-1],
               list(funnel_data.values())[::-1],
               color=colors_f, edgecolor="white", height=0.55)
ax.set_title("Customer Journey Funnel", fontsize=13, fontweight="bold")
ax.set_xlabel("Number of Customers / Orders")
ax.grid(axis="x", alpha=0.4)
for b, v in zip(bars, list(funnel_data.values())[::-1]):
    pct = v / len(df) * 100
    ax.text(b.get_width()+20, b.get_y()+b.get_height()/2,
            f"{v:,}  ({pct:.1f}%)", va="center", fontsize=9)
plt.tight_layout()
plt.savefig("outputs/story_customer_funnel.png", bbox_inches="tight")
plt.close()
print("Saved: outputs/story_customer_funnel.png")

# Story Chart 3 — Business Opportunity Matrix
opp_data = pd.DataFrame({
    "Segment":      ["18-25","26-35","36-45","46-55","56+"],
    "AOV":          [19150, 20270, 20641, 19660, 18064],
    "Orders":       [470,   550,   715,   637,   859],
    "Churn_Rate":   [34,    32,    28,    30,    29],
})
fig, ax = plt.subplots(figsize=(10, 6))
scatter = ax.scatter(opp_data["AOV"], opp_data["Orders"],
                     s=opp_data["Churn_Rate"]*20,
                     c=PALETTE[:5], alpha=0.85, edgecolors="white", linewidth=1.5)
for _, row in opp_data.iterrows():
    ax.annotate(row["Segment"],
                (row["AOV"], row["Orders"]),
                textcoords="offset points", xytext=(8, 4), fontsize=9)
ax.set_title("Opportunity Matrix — AOV vs Orders (bubble = churn rate)",
             fontsize=12, fontweight="bold")
ax.set_xlabel("Average Order Value (Rs.)")
ax.set_ylabel("Number of Orders")
ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f"Rs.{x:,.0f}"))
ax.grid(alpha=0.4)
plt.tight_layout()
plt.savefig("outputs/story_opportunity_matrix.png", bbox_inches="tight")
plt.close()
print("Saved: outputs/story_opportunity_matrix.png")

# =============================================================================
# STEP 2 — HYPOTHESIS TESTING
# =============================================================================
print("\n" + "-"*50)
print("STEP 2 — Hypothesis Testing")
print("-"*50)

results = []

# ── Hypothesis 1: T-Test ─────────────────────────────────────────────────────
print("\nH1: Mobile App AOV > Website AOV")
app_rev     = df[df["acquisition_channel"]=="Mobile App"]["revenue"].dropna()
website_rev = df[df["acquisition_channel"]=="Website"]["revenue"].dropna()
t_stat, p_val = stats.ttest_ind(app_rev, website_rev, alternative="greater")
conclusion = "REJECT H0 — Mobile App AOV is significantly higher" if p_val < 0.05 \
             else "FAIL TO REJECT H0 — No significant difference"
print(f"  Mobile App AOV  : Rs.{app_rev.mean():,.2f}")
print(f"  Website AOV     : Rs.{website_rev.mean():,.2f}")
print(f"  T-statistic     : {t_stat:.4f}")
print(f"  P-value         : {p_val:.4f}")
print(f"  Conclusion      : {conclusion}")
results.append({
    "Hypothesis": "H1: Mobile App AOV > Website AOV",
    "Test": "Independent T-Test (one-tailed)",
    "Group A": f"Mobile App (n={len(app_rev)}, mean=Rs.{app_rev.mean():,.2f})",
    "Group B": f"Website (n={len(website_rev)}, mean=Rs.{website_rev.mean():,.2f})",
    "T-Statistic": round(t_stat, 4),
    "P-Value": round(p_val, 4),
    "Alpha": 0.05,
    "Result": "Significant" if p_val < 0.05 else "Not Significant",
    "Conclusion": conclusion
})

# ── Hypothesis 2: T-Test ─────────────────────────────────────────────────────
print("\nH2: 36-45 age group AOV > 18-25 age group AOV")
grp_3645 = delivered[delivered["age_group"]=="36-45"]["revenue"].dropna()
grp_1825 = delivered[delivered["age_group"]=="18-25"]["revenue"].dropna()
t2, p2   = stats.ttest_ind(grp_3645, grp_1825, alternative="greater")
conclusion2 = "REJECT H0 — 36-45 has significantly higher AOV" if p2 < 0.05 \
              else "FAIL TO REJECT H0 — No significant difference"
print(f"  36-45 AOV       : Rs.{grp_3645.mean():,.2f}")
print(f"  18-25 AOV       : Rs.{grp_1825.mean():,.2f}")
print(f"  T-statistic     : {t2:.4f}")
print(f"  P-value         : {p2:.4f}")
print(f"  Conclusion      : {conclusion2}")
results.append({
    "Hypothesis": "H2: 36-45 age group AOV > 18-25 age group AOV",
    "Test": "Independent T-Test (one-tailed)",
    "Group A": f"36-45 (n={len(grp_3645)}, mean=Rs.{grp_3645.mean():,.2f})",
    "Group B": f"18-25 (n={len(grp_1825)}, mean=Rs.{grp_1825.mean():,.2f})",
    "T-Statistic": round(t2, 4),
    "P-Value": round(p2, 4),
    "Alpha": 0.05,
    "Result": "Significant" if p2 < 0.05 else "Not Significant",
    "Conclusion": conclusion2
})

# ── Hypothesis 3: Chi-Squared ─────────────────────────────────────────────────
print("\nH3: Cancellation rate differs across acquisition channels")
contingency = pd.crosstab(df["acquisition_channel"], df["is_cancelled"])
chi2, p3, dof, expected = stats.chi2_contingency(contingency)
conclusion3 = "REJECT H0 — Cancellation rate differs significantly by channel" \
              if p3 < 0.05 else "FAIL TO REJECT H0 — No significant difference"
print(f"  Chi2-statistic  : {chi2:.4f}")
print(f"  P-value         : {p3:.4f}")
print(f"  Degrees of freedom: {dof}")
print(f"  Conclusion      : {conclusion3}")
results.append({
    "Hypothesis": "H3: Cancellation rate differs across acquisition channels",
    "Test": "Chi-Squared Test of Independence",
    "Group A": "All acquisition channels",
    "Group B": "is_cancelled (0/1)",
    "T-Statistic": round(chi2, 4),
    "P-Value": round(p3, 4),
    "Alpha": 0.05,
    "Result": "Significant" if p3 < 0.05 else "Not Significant",
    "Conclusion": conclusion3
})

# ── Hypothesis 4: T-Test Oct vs other months ─────────────────────────────────
print("\nH4: October revenue is significantly higher than other months")
oct_rev   = delivered[delivered["order_month"]==10]["revenue"].dropna()
other_rev = delivered[delivered["order_month"]!=10]["revenue"].dropna()
t4, p4    = stats.ttest_ind(oct_rev, other_rev, alternative="greater")
conclusion4 = "REJECT H0 — October revenue is significantly higher" if p4 < 0.05 \
              else "FAIL TO REJECT H0 — No significant difference"
print(f"  October AOV     : Rs.{oct_rev.mean():,.2f}")
print(f"  Other months AOV: Rs.{other_rev.mean():,.2f}")
print(f"  T-statistic     : {t4:.4f}")
print(f"  P-value         : {p4:.4f}")
print(f"  Conclusion      : {conclusion4}")
results.append({
    "Hypothesis": "H4: October AOV > Other months AOV (Festive Season Effect)",
    "Test": "Independent T-Test (one-tailed)",
    "Group A": f"October (n={len(oct_rev)}, mean=Rs.{oct_rev.mean():,.2f})",
    "Group B": f"Other months (n={len(other_rev)}, mean=Rs.{other_rev.mean():,.2f})",
    "T-Statistic": round(t4, 4),
    "P-Value": round(p4, 4),
    "Alpha": 0.05,
    "Result": "Significant" if p4 < 0.05 else "Not Significant",
    "Conclusion": conclusion4
})

# Save results
results_df = pd.DataFrame(results)
results_df.to_csv("outputs/hypothesis_testing_summary.csv", index=False)
print("\nSaved: outputs/hypothesis_testing_summary.csv")

# ── Hypothesis chart ──────────────────────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# T-test visualization H1
ax = axes[0]
means = [app_rev.mean(), website_rev.mean()]
sems  = [app_rev.sem(),  website_rev.sem()]
bars  = ax.bar(["Mobile App","Website"], means,
               yerr=sems, color=[PALETTE[0], PALETTE[3]],
               capsize=6, edgecolor="white", width=0.5)
ax.set_title(f"H1: Mobile App vs Website AOV\n(p={p_val:.4f} — {'Significant ✓' if p_val<0.05 else 'Not Significant'})",
             fontsize=10, fontweight="bold")
ax.set_ylabel("Avg Order Value (Rs.)")
ax.yaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f"Rs.{x:,.0f}"))
ax.grid(axis="y", alpha=0.4)
for b, v in zip(bars, means):
    ax.text(b.get_x()+b.get_width()/2, v+100,
            f"Rs.{v:,.0f}", ha="center", fontsize=9, fontweight="bold")

# Chi-squared H3
ax = axes[1]
cancel_by_ch = df.groupby("acquisition_channel")["is_cancelled"].mean()*100
bars2 = ax.bar(cancel_by_ch.index, cancel_by_ch.values,
               color=PALETTE[:5], edgecolor="white", width=0.6)
ax.set_title(f"H3: Cancellation Rate by Channel\n(Chi2 p={p3:.4f} — {'Significant ✓' if p3<0.05 else 'Not Significant'})",
             fontsize=10, fontweight="bold")
ax.set_ylabel("Cancellation Rate (%)")
ax.tick_params(axis="x", rotation=15)
ax.grid(axis="y", alpha=0.4)
for b, v in zip(bars2, cancel_by_ch.values):
    ax.text(b.get_x()+b.get_width()/2, v+0.1,
            f"{v:.1f}%", ha="center", fontsize=9, fontweight="bold")

plt.suptitle("Hypothesis Testing Results", fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig("outputs/hypothesis_testing_charts.png", bbox_inches="tight")
plt.close()
print("Saved: outputs/hypothesis_testing_charts.png")

# =============================================================================
# STEP 3 — STORY SUMMARY CHART (all insights in one)
# =============================================================================
fig, axes = plt.subplots(2, 2, figsize=(16, 11))

# Top channel comparison
ch_rev = df.groupby("acquisition_channel")["revenue"].sum().sort_values(ascending=False)
axes[0,0].bar(ch_rev.index, ch_rev.values/1e7,
              color=PALETTE[:5], edgecolor="white", width=0.6)
axes[0,0].set_title("Revenue by Channel — Mobile App Leads", fontweight="bold")
axes[0,0].set_ylabel("Revenue (Rs.Cr)")
axes[0,0].tick_params(axis="x", rotation=15)
axes[0,0].grid(axis="y", alpha=0.4)
axes[0,0].yaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f"Rs.{x:.1f}Cr"))

# AOV by age group
age_o = ["18-25","26-35","36-45","46-55","56+"]
aov_age = delivered.groupby("age_group")["revenue"].mean().reindex(age_o)
axes[0,1].bar(age_o, aov_age.values, color=PALETTE[:5],
              edgecolor="white", width=0.6)
axes[0,1].set_title("AOV by Age Group — 36-45 Leads", fontweight="bold")
axes[0,1].set_ylabel("Avg Order Value (Rs.)")
axes[0,1].yaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f"Rs.{x:,.0f}"))
axes[0,1].grid(axis="y", alpha=0.4)
for i, (bar, v) in enumerate(zip(axes[0,1].patches, aov_age.values)):
    axes[0,1].text(bar.get_x()+bar.get_width()/2, v+50,
                   f"Rs.{v:,.0f}", ha="center", fontsize=8)

# Monthly AOV — Oct spike
monthly_aov = delivered.groupby("order_month")["revenue"].mean()
axes[1,0].plot(monthly_aov.index, monthly_aov.values,
               color=PALETTE[0], linewidth=2.2, marker="o", ms=5)
axes[1,0].axvline(10, color=PALETTE[3], linestyle="--", linewidth=1.5,
                  label="October peak")
axes[1,0].fill_between(monthly_aov.index, monthly_aov.values,
                        alpha=0.1, color=PALETTE[0])
axes[1,0].set_title("Monthly AOV — October Festive Spike", fontweight="bold")
axes[1,0].set_xlabel("Month"); axes[1,0].set_ylabel("AOV (Rs.)")
axes[1,0].set_xticks(range(1,13))
axes[1,0].set_xticklabels(["J","F","M","A","M","J","J","A","S","O","N","D"])
axes[1,0].yaxis.set_major_formatter(mticker.FuncFormatter(lambda x,_: f"Rs.{x:,.0f}"))
axes[1,0].legend(); axes[1,0].grid(alpha=0.4)

# Return rate by category
ret_cat = (df.groupby("category")
             .apply(lambda x: (x["order_status"]=="Returned").sum()/len(x)*100)
             .sort_values(ascending=False))
axes[1,1].barh(ret_cat.index, ret_cat.values,
               color=PALETTE[:7], edgecolor="white", height=0.6)
axes[1,1].set_title("Return Rate by Category — Beauty Highest", fontweight="bold")
axes[1,1].set_xlabel("Return Rate (%)")
axes[1,1].grid(axis="x", alpha=0.4)
for i, (bar, v) in enumerate(zip(axes[1,1].patches, ret_cat.values)):
    axes[1,1].text(v+0.05, bar.get_y()+bar.get_height()/2,
                   f"{v:.1f}%", va="center", fontsize=9)

plt.suptitle("Data Story — Key Business Insights Summary",
             fontsize=14, fontweight="bold")
plt.tight_layout()
plt.savefig("outputs/story_summary_chart.png", bbox_inches="tight")
plt.close()
print("Saved: outputs/story_summary_chart.png")

# =============================================================================
# STEP 4 — EXPORT STORY REPORT
# =============================================================================
story = f"""# Task 4 — Data Storytelling & Statistical Validation
**ApexPlanet Software Pvt. Ltd. | Data Analytics Internship (60 Days)**

---

## The Business Story

### Chapter 1 — Setting the Scene
We analysed 5,000 e-commerce orders across 2023-2024 generating a total revenue of Rs.6.29 Crore.
The data reveals a business with strong fundamentals but clear opportunities for growth.

### Chapter 2 — The Problem
- Month-1 customer retention is only 6% — most customers never reorder
- Beauty category has a 10.4% return rate — hurting net revenue
- Cancellation rate stands at 10.1% — revenue is being lost before delivery

### Chapter 3 — The Opportunity
- October shows a consistent revenue spike — festive season campaigns need investment
- Mobile App drives the most revenue (Rs.2.14Cr) — yet Website lags at Rs.1.76Cr
- 36-45 age group has the highest AOV (Rs.20,641) — premium segment to target

### Chapter 4 — The Recommendations
1. Launch a 30-day post-purchase email sequence to boost Month-1 retention from 6% to 15%
2. Review Beauty product descriptions to reduce 10.4% return rate
3. Invest in Mobile App UX and push notifications
4. Plan festive season campaigns 4 weeks before October
5. Create premium bundles targeting the 36-45 age group

### Chapter 5 — The Call to Action
Focus on retention first. Increasing Month-1 retention from 6% to 12% would double
repeat revenue — the single highest-impact action available.

---

## Hypothesis Testing Results

{results_df.to_markdown(index=False)}

---

## Statistical Interpretation

### H1 — Mobile App AOV vs Website AOV (T-Test)
- Mobile App mean: Rs.{app_rev.mean():,.2f} | Website mean: Rs.{website_rev.mean():,.2f}
- p-value: {p_val:.4f} | {'Statistically significant at alpha=0.05' if p_val<0.05 else 'Not statistically significant'}
- Business conclusion: {'Mobile App customers spend significantly more — prioritise app investment' if p_val<0.05 else 'No significant AOV difference between channels'}

### H2 — 36-45 vs 18-25 AOV (T-Test)
- 36-45 mean: Rs.{grp_3645.mean():,.2f} | 18-25 mean: Rs.{grp_1825.mean():,.2f}
- p-value: {p2:.4f} | {'Statistically significant' if p2<0.05 else 'Not statistically significant'}
- Business conclusion: {'36-45 age group genuinely spends more — target with premium products' if p2<0.05 else 'Age groups spend similarly on average'}

### H3 — Cancellation Rate by Channel (Chi-Squared)
- Chi2 statistic: {chi2:.4f} | p-value: {p3:.4f}
- {'Statistically significant — channel influences cancellation behaviour' if p3<0.05 else 'No significant difference in cancellation across channels'}

### H4 — October AOV vs Other Months (T-Test)
- October mean: Rs.{oct_rev.mean():,.2f} | Other months mean: Rs.{other_rev.mean():,.2f}
- p-value: {p4:.4f} | {'Statistically significant — October spike is real' if p4<0.05 else 'Not statistically significant'}

---

## Deliverables
- [x] outputs/story_revenue_journey.png
- [x] outputs/story_customer_funnel.png
- [x] outputs/story_opportunity_matrix.png
- [x] outputs/hypothesis_testing_charts.png
- [x] outputs/story_summary_chart.png
- [x] outputs/hypothesis_testing_summary.csv
- [x] outputs/task4_story_report.md

---

*ApexPlanet Software Pvt. Ltd. | www.apexplanet.in*
"""

with open("outputs/task4_story_report.md", "w", encoding="utf-8") as f:
    f.write(story)
print("Saved: outputs/task4_story_report.md")

print("\n" + "="*60)
print("TASK 4 COMPLETE! All outputs saved to ./outputs/")
print("="*60)
