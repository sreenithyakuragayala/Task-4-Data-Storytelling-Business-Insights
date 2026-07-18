const pptxgen = require("pptxgenjs");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const {
  FaChartLine, FaExclamationTriangle, FaLightbulb, FaArrowRight,
  FaMobileAlt, FaCalendarAlt, FaUsers, FaFlask, FaCheckCircle,
  FaTimesCircle, FaShoppingCart, FaUndo
} = require("react-icons/fa");

function renderIconSvg(IconComponent, color, size = 256) {
  return ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconComponent, { color, size: String(size) })
  );
}
async function iconPng(IconComponent, color, size = 256) {
  const svg = renderIconSvg(IconComponent, color, size);
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ── Palette: "Ocean Gradient" ────────────────────────────────────────────
const NAVY   = "21295C";
const TEAL   = "1C7293";
const DEEPBLUE = "065A82";
const ICE    = "EAF4F8";
const WHITE  = "FFFFFF";
const CORAL  = "F96167";
const GOLD   = "F9E795";
const GREY   = "64748B";
const DARK   = "1E293B";

(async () => {
let pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5
pres.author = "Devi Sri";
pres.title = "Task 4 - Data Storytelling & Statistical Validation";

const W = 13.3, H = 7.5;

// preload icons
const icChart   = await iconPng(FaChartLine, WHITE, 256);
const icWarn    = await iconPng(FaExclamationTriangle, CORAL, 256);
const icBulb    = await iconPng(FaLightbulb, GOLD, 256);
const icArrow   = await iconPng(FaArrowRight, WHITE, 256);
const icMobile  = await iconPng(FaMobileAlt, TEAL, 256);
const icCal     = await iconPng(FaCalendarAlt, TEAL, 256);
const icUsers   = await iconPng(FaUsers, TEAL, 256);
const icFlask   = await iconPng(FaFlask, WHITE, 256);
const icCheck   = await iconPng(FaCheckCircle, "2E7D32", 256);
const icCross   = await iconPng(FaTimesCircle, GREY, 256);
const icCart    = await iconPng(FaShoppingCart, TEAL, 256);
const icReturn  = await iconPng(FaUndo, CORAL, 256);

// =====================================================================
// SLIDE 1 — TITLE
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.OVAL, {
    x: 9.3, y: -2.0, w: 6, h: 6, fill: { color: TEAL, transparency: 78 }
  });
  s.addShape(pres.shapes.OVAL, {
    x: -2.2, y: 4.8, w: 5, h: 5, fill: { color: DEEPBLUE, transparency: 70 }
  });

  s.addText("TASK 4", {
    x: 0.9, y: 1.5, w: 4, h: 0.5, fontSize: 16, color: GOLD,
    bold: true, charSpacing: 4, fontFace: "Calibri"
  });
  s.addText("Data Storytelling &\nStatistical Validation", {
    x: 0.9, y: 1.95, w: 9.5, h: 2.2, fontSize: 44, color: WHITE,
    bold: true, fontFace: "Cambria", lineSpacingMultiple: 1.05
  });
  s.addText("Turning analysis into a business narrative — and proving it with statistics", {
    x: 0.9, y: 4.05, w: 9, h: 0.6, fontSize: 16, color: ICE, italic: true, fontFace: "Calibri"
  });

  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.9, y: 5.1, w: 0.012*0+0, h: 0, fill: { color: NAVY } // placeholder no-op
  });

  // bottom info bar
  s.addText([
    { text: "ApexPlanet Software Pvt. Ltd.", options: { bold: true, breakLine: true } },
    { text: "60-Day Data Analytics Internship  |  Dataset: 5,000 Orders (2023-2024)", options: {} }
  ], {
    x: 0.9, y: 6.5, w: 10, h: 0.7, fontSize: 13, color: ICE, fontFace: "Calibri"
  });

  s.addText("Devi Sri", {
    x: 10.6, y: 6.55, w: 2.2, h: 0.5, fontSize: 16, color: GOLD,
    bold: true, align: "right", fontFace: "Calibri"
  });
}

// =====================================================================
// SLIDE 2 — THE BUSINESS STORY (Chapters overview)
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("The Business Story", {
    x: 0.7, y: 0.45, w: 8, h: 0.7, fontSize: 32, bold: true, color: NAVY, fontFace: "Cambria"
  });
  s.addText("Five chapters connecting Tasks 1-3 into one narrative", {
    x: 0.7, y: 1.05, w: 8, h: 0.4, fontSize: 14, color: GREY, italic: true, fontFace: "Calibri"
  });

  const chapters = [
    { num: "1", title: "Setting the Scene", body: "5,000 orders analysed across 2023-2024, generating Rs.6.29 Cr in total revenue from delivered orders." },
    { num: "2", title: "The Problem", body: "Month-1 retention is only 6%. Beauty has a 10.4% return rate. Cancellation rate sits at 10.1%." },
    { num: "3", title: "The Opportunity", body: "October consistently spikes (festive season). Mobile App leads revenue. 36-45 age group has the highest AOV." },
    { num: "4", title: "The Recommendations", body: "Post-purchase email flows, review Beauty listings, invest in Mobile App UX, plan festive campaigns early, target premium segment." },
    { num: "5", title: "The Call to Action", body: "Fix retention first - raising Month-1 retention from 6% to 12% would roughly double repeat revenue." }
  ];

  const startY = 1.65;
  const rowH = 1.12;
  chapters.forEach((c, i) => {
    const y = startY + i * rowH;
    s.addShape(pres.shapes.OVAL, {
      x: 0.7, y: y, w: 0.55, h: 0.55, fill: { color: i % 2 === 0 ? TEAL : DEEPBLUE }
    });
    s.addText(c.num, {
      x: 0.7, y: y, w: 0.55, h: 0.55, fontSize: 20, bold: true, color: WHITE,
      align: "center", valign: "middle", fontFace: "Calibri", margin: 0
    });
    s.addText(c.title, {
      x: 1.45, y: y - 0.05, w: 2.6, h: 0.6, fontSize: 16, bold: true, color: NAVY,
      valign: "middle", fontFace: "Calibri"
    });
    s.addText(c.body, {
      x: 4.15, y: y - 0.05, w: 8.5, h: 0.95, fontSize: 13, color: DARK,
      valign: "middle", fontFace: "Calibri"
    });
  });
}

// =====================================================================
// SLIDE 3 — REVENUE JOURNEY (chart image)
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Chapter 1: The Revenue Journey", {
    x: 0.7, y: 0.4, w: 9, h: 0.65, fontSize: 28, bold: true, color: NAVY, fontFace: "Cambria"
  });
  s.addText("24 months of revenue tell a clear seasonal story", {
    x: 0.7, y: 1.0, w: 8, h: 0.4, fontSize: 14, color: GREY, italic: true, fontFace: "Calibri"
  });

  s.addImage({
    path: "outputs/story_revenue_journey.png",
    x: 0.7, y: 1.55, w: 8.1, h: 2.9, sizing: { type: "contain", w: 8.1, h: 2.9 }
  });

  // right side stat callouts
  const stats = [
    { label: "Total Revenue", val: "Rs.6.29 Cr", color: TEAL },
    { label: "Peak Month", val: "October", color: CORAL },
    { label: "Total Orders", val: "5,000", color: DEEPBLUE },
  ];
  stats.forEach((st, i) => {
    const y = 1.6 + i * 1.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 9.1, y: y, w: 3.5, h: 0.85, rectRadius: 0.08,
      fill: { color: ICE },
      shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 45, opacity: 0.10 }
    });
    s.addText(st.val, {
      x: 9.35, y: y + 0.08, w: 3.1, h: 0.45, fontSize: 22, bold: true, color: st.color, fontFace: "Calibri"
    });
    s.addText(st.label, {
      x: 9.35, y: y + 0.5, w: 3.1, h: 0.3, fontSize: 11, color: GREY, fontFace: "Calibri"
    });
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.75, w: 11.9, h: 2.1, rectRadius: 0.08,
    fill: { color: ICE }
  });
  s.addImage({ data: icCal, x: 1.0, y: 5.05, w: 0.5, h: 0.5 });
  s.addText([
    { text: "What the data shows: ", options: { bold: true, color: NAVY } },
    { text: "Revenue rises through the year with a sharp spike in October, driven by festive-season demand (Diwali/Dussehra). This pattern repeats in both 2023 and 2024, suggesting a reliable seasonal trend that can be planned for in advance.", options: { color: DARK } }
  ], { x: 1.7, y: 4.9, w: 10.6, h: 1.8, fontSize: 14, valign: "top", fontFace: "Calibri", paraSpaceAfter: 6 });
}

// =====================================================================
// SLIDE 4 — CUSTOMER FUNNEL & OPPORTUNITY MATRIX
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Chapter 2 & 3: The Problem and The Opportunity", {
    x: 0.7, y: 0.4, w: 11, h: 0.65, fontSize: 28, bold: true, color: NAVY, fontFace: "Cambria"
  });

  // Left: funnel
  s.addText("Customer Journey Funnel", {
    x: 0.7, y: 1.15, w: 6, h: 0.4, fontSize: 16, bold: true, color: TEAL, fontFace: "Calibri"
  });
  s.addImage({
    path: "outputs/story_customer_funnel.png",
    x: 0.7, y: 1.6, w: 6.0, h: 2.6, sizing: { type: "contain", w: 6.0, h: 2.6 }
  });

  // Right: opportunity matrix
  s.addText("Segment Opportunity Matrix", {
    x: 6.9, y: 1.15, w: 6, h: 0.4, fontSize: 16, bold: true, color: TEAL, fontFace: "Calibri"
  });
  s.addImage({
    path: "outputs/story_opportunity_matrix.png",
    x: 6.9, y: 1.6, w: 6.0, h: 2.6, sizing: { type: "contain", w: 6.0, h: 2.6 }
  });

  // bottom: 3 problem callouts
  const problems = [
    { icon: icWarn, title: "6% Month-1 Retention", body: "94% of customers never reorder the next month" },
    { icon: icReturn, title: "10.4% Return Rate", body: "Beauty category has the highest returns" },
    { icon: icCross, title: "10.1% Cancellation Rate", body: "1 in 10 orders is cancelled before delivery" },
  ];
  problems.forEach((p, i) => {
    const x = 0.7 + i * 4.05;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: x, y: 4.5, w: 3.85, h: 1.35, rectRadius: 0.08,
      fill: { color: ICE },
      shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 45, opacity: 0.10 }
    });
    s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: 4.75, w: 0.5, h: 0.5, fill: { color: WHITE } });
    s.addImage({ data: p.icon, x: x + 0.35, y: 4.85, w: 0.3, h: 0.3 });
    s.addText(p.title, {
      x: x + 0.95, y: 4.65, w: 2.8, h: 0.4, fontSize: 15, bold: true, color: NAVY, fontFace: "Calibri"
    });
    s.addText(p.body, {
      x: x + 0.95, y: 5.05, w: 2.8, h: 0.7, fontSize: 11.5, color: DARK, fontFace: "Calibri"
    });
  });

  s.addText("Insight: the highest-revenue segments (Mobile App, 36-45 age group, October) are also where the biggest gaps (retention, returns, cancellations) sit - fixing these gaps compounds the existing strengths.", {
    x: 0.7, y: 6.05, w: 11.9, h: 0.7, fontSize: 13, italic: true, color: GREY, fontFace: "Calibri"
  });
}

// =====================================================================
// SLIDE 5 — HYPOTHESIS TESTING INTRO + RESULTS TABLE
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.OVAL, { x: 11.3, y: -1.5, w: 4, h: 4, fill: { color: TEAL, transparency: 80 } });

  s.addImage({ data: icFlask, x: 0.7, y: 0.55, w: 0.55, h: 0.55 });
  s.addText("Hypothesis Testing - Validating the Story with Statistics", {
    x: 1.4, y: 0.5, w: 11.2, h: 0.7, fontSize: 26, bold: true, color: WHITE, fontFace: "Cambria"
  });
  s.addText("Four business hypotheses were tested using T-Tests and a Chi-Squared test (alpha = 0.05)", {
    x: 1.4, y: 1.15, w: 11, h: 0.4, fontSize: 14, color: ICE, italic: true, fontFace: "Calibri"
  });

  const rows = [
    ["Hypothesis", "Test", "P-Value", "Result"],
    ["H1: Mobile App AOV > Website AOV", "T-Test", "0.0828", "Not Significant"],
    ["H2: 36-45 AOV > 18-25 AOV", "T-Test", "0.2317", "Not Significant"],
    ["H3: Cancellation rate differs by channel", "Chi-Squared", "0.7467", "Not Significant"],
    ["H4: October AOV > Other months", "T-Test", "0.0075", "Significant"],
  ];

  const tableRows = rows.map((r, ri) => {
    if (ri === 0) {
      return r.map(c => ({ text: c, options: { fill: { color: DEEPBLUE }, color: WHITE, bold: true, fontFace: "Calibri", fontSize: 13, align: ri===0 ? "left" : "left" } }));
    }
    const sig = r[3] === "Significant";
    return r.map((c, ci) => ({
      text: c,
      options: {
        fill: { color: ri % 2 === 0 ? "2C3768" : "263166" },
        color: ci === 3 ? (sig ? "8BE28B" : "C7CEDD") : WHITE,
        bold: ci === 3,
        fontFace: "Calibri", fontSize: 12.5
      }
    }));
  });

  s.addTable(tableRows, {
    x: 0.7, y: 1.85, w: 11.9, h: 2.6,
    colW: [5.6, 2.0, 1.6, 2.7],
    border: { pt: 0.5, color: "3D4B8C" },
    rowH: 0.5,
    valign: "middle",
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 4.75, w: 11.9, h: 2.1, rectRadius: 0.08, fill: { color: "2C3768" }
  });
  s.addImage({ data: icCheck, x: 1.0, y: 5.05, w: 0.5, h: 0.5 });
  s.addText([
    { text: "Key statistical finding: ", options: { bold: true, color: GOLD } },
    { text: "Only H4 is statistically significant (p = 0.0075 < 0.05). This proves the October revenue spike is a real, repeatable seasonal pattern - not random variation - and justifies investing in festive-season campaigns ahead of time. The other three hypotheses (channel AOV, age-group AOV, channel cancellation) show differences in the raw numbers, but those differences are not statistically significant at the 5% level - meaning they could be due to chance.", options: { color: ICE } }
  ], { x: 1.7, y: 4.9, w: 10.6, h: 1.85, fontSize: 13, valign: "top", fontFace: "Calibri", paraSpaceAfter: 4 });
}

// =====================================================================
// SLIDE 6 — HYPOTHESIS CHARTS (visuals)
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Hypothesis Testing - Visual Comparison", {
    x: 0.7, y: 0.4, w: 11, h: 0.65, fontSize: 28, bold: true, color: NAVY, fontFace: "Cambria"
  });
  s.addText("H1 (Mobile App vs Website AOV) and H3 (Cancellation rate by channel)", {
    x: 0.7, y: 1.0, w: 10, h: 0.4, fontSize: 14, color: GREY, italic: true, fontFace: "Calibri"
  });

  s.addImage({
    path: "outputs/hypothesis_testing_charts.png",
    x: 0.9, y: 1.55, w: 11.5, h: 4.3, sizing: { type: "contain", w: 11.5, h: 4.3 }
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.7, y: 6.1, w: 11.9, h: 1.0, rectRadius: 0.08, fill: { color: ICE }
  });
  s.addImage({ data: icMobile, x: 1.0, y: 6.35, w: 0.45, h: 0.45 });
  s.addText([
    { text: "Reading the charts: ", options: { bold: true, color: NAVY } },
    { text: "Mobile App's average order value (Rs.20,332) is visibly higher than Website's (Rs.18,513), and Mobile App also shows the highest cancellation rate (11.0%) among channels - but neither difference clears the p < 0.05 bar, so larger sample sizes or longer time windows would be needed to confirm these patterns.", options: { color: DARK } }
  ], { x: 1.65, y: 6.2, w: 10.7, h: 0.85, fontSize: 12.5, valign: "middle", fontFace: "Calibri" });
}

// =====================================================================
// SLIDE 7 — RECOMMENDATIONS (Chapter 4)
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: WHITE };

  s.addText("Chapter 4: Recommendations", {
    x: 0.7, y: 0.4, w: 9, h: 0.65, fontSize: 28, bold: true, color: NAVY, fontFace: "Cambria"
  });
  s.addText("Five actions to convert insight into business impact", {
    x: 0.7, y: 1.0, w: 8, h: 0.4, fontSize: 14, color: GREY, italic: true, fontFace: "Calibri"
  });

  const recs = [
    { icon: icUsers, title: "Boost Month-1 Retention", body: "Launch a 30-day post-purchase email sequence with personalised recommendations to lift retention from 6% toward 12-15%." },
    { icon: icReturn, title: "Reduce Beauty Returns", body: "Review product descriptions, sizing guides and images for the Beauty category to bring the 10.4% return rate down." },
    { icon: icMobile, title: "Invest in Mobile App", body: "Mobile App drives the most revenue (Rs.2.14 Cr) - prioritise app UX improvements and push-notification campaigns." },
    { icon: icCal, title: "Plan Festive Campaigns Early", body: "October's spike is statistically proven (p=0.0075) - prepare inventory and marketing 4 weeks ahead of the festive season." },
    { icon: icCart, title: "Target the Premium Segment", body: "The 36-45 age group has the highest AOV (Rs.20,641) - create premium product bundles aimed at this group." },
  ];

  // 2-column card grid (3 + 2)
  const positions = [
    {x:0.7, y:1.6}, {x:6.95,y:1.6},
    {x:0.7, y:3.55}, {x:6.95,y:3.55},
    {x:0.7, y:5.5}
  ];
  recs.forEach((r, i) => {
    const p = positions[i];
    const w = 5.95, h = 1.75;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: p.x, y: p.y, w: w, h: h, rectRadius: 0.08,
      fill: { color: ICE },
      shadow: { type: "outer", color: "000000", blur: 6, offset: 2, angle: 45, opacity: 0.10 }
    });
    s.addShape(pres.shapes.OVAL, { x: p.x + 0.25, y: p.y + 0.25, w: 0.6, h: 0.6, fill: { color: WHITE } });
    s.addImage({ data: r.icon, x: p.x + 0.38, y: p.y + 0.38, w: 0.34, h: 0.34 });
    s.addText(r.title, {
      x: p.x + 1.05, y: p.y + 0.18, w: w - 1.2, h: 0.45, fontSize: 15, bold: true, color: NAVY, fontFace: "Calibri"
    });
    s.addText(r.body, {
      x: p.x + 1.05, y: p.y + 0.6, w: w - 1.2, h: h - 0.7, fontSize: 12, color: DARK, fontFace: "Calibri", valign: "top"
    });
  });

  // 5th card spans wider on right for balance - add a "priority" note instead
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 6.95, y: 5.5, w: 5.95, h: 1.75, rectRadius: 0.08, fill: { color: DEEPBLUE }
  });
  s.addImage({ data: icArrow, x: 7.2, y: 5.75, w: 0.5, h: 0.5 });
  s.addText("Highest priority: Fix retention first", {
    x: 7.9, y: 5.68, w: 4.8, h: 0.45, fontSize: 15, bold: true, color: WHITE, fontFace: "Calibri"
  });
  s.addText("Of all five actions, improving Month-1 retention has the largest compounding effect on long-term revenue.", {
    x: 7.9, y: 6.12, w: 4.85, h: 1.0, fontSize: 12, color: ICE, fontFace: "Calibri", valign: "top"
  });
}

// =====================================================================
// SLIDE 8 — CONCLUSION / CALL TO ACTION
// =====================================================================
{
  let s = pres.addSlide();
  s.background = { color: NAVY };

  s.addShape(pres.shapes.OVAL, { x: -2, y: -2, w: 6, h: 6, fill: { color: TEAL, transparency: 80 } });
  s.addShape(pres.shapes.OVAL, { x: 10, y: 4, w: 5, h: 5, fill: { color: DEEPBLUE, transparency: 70 } });

  s.addText("Chapter 5: Call to Action", {
    x: 0.9, y: 0.7, w: 10, h: 0.7, fontSize: 32, bold: true, color: WHITE, fontFace: "Cambria"
  });

  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: 0.9, y: 1.7, w: 11.5, h: 1.7, rectRadius: 0.1, fill: { color: "2C3768" }
  });
  s.addText([
    { text: "Increasing Month-1 retention from 6% to 12% would roughly ", options: { color: ICE } },
    { text: "double repeat revenue", options: { color: GOLD, bold: true } },
    { text: " - the single highest-impact action available from this analysis.", options: { color: ICE } }
  ], { x: 1.3, y: 1.85, w: 10.7, h: 1.4, fontSize: 20, valign: "middle", fontFace: "Cambria", italic: true });

  // summary stat row
  const finals = [
    { label: "Total Revenue", val: "Rs.6.29 Cr" },
    { label: "Month-1 Retention", val: "6%" },
    { label: "Statistically Proven Trend", val: "October Spike" },
    { label: "Target Segment", val: "Age 36-45" },
  ];
  finals.forEach((f, i) => {
    const x = 0.9 + i * 2.95;
    s.addText(f.val, {
      x: x, y: 3.8, w: 2.7, h: 0.7, fontSize: 26, bold: true, color: GOLD, align: "center", fontFace: "Calibri"
    });
    s.addText(f.label, {
      x: x, y: 4.5, w: 2.7, h: 0.4, fontSize: 12, color: ICE, align: "center", fontFace: "Calibri"
    });
  });

  s.addText([
    { text: "Tasks completed: ", options: { bold: true, color: GOLD, breakLine: true } },
    { text: "Task 1 - Data Wrangling   |   Task 2 - EDA & BI   |   Task 3 - Deep-Dive & Power BI Dashboard   |   Task 4 - Storytelling & Hypothesis Testing", options: { color: ICE } }
  ], { x: 0.9, y: 5.5, w: 11.5, h: 0.9, fontSize: 14, fontFace: "Calibri", paraSpaceAfter: 4 });

  s.addText("ApexPlanet Software Pvt. Ltd.  |  60-Day Data Analytics Internship  |  Devi Sri", {
    x: 0.9, y: 6.85, w: 11.5, h: 0.4, fontSize: 12, color: ICE, italic: true, fontFace: "Calibri"
  });
}

pres.writeFile({ fileName: "outputs/Task4_DataStorytelling_Presentation.pptx" })
  .then(() => console.log("DONE"));

})();
