# FINANCIAL MASTERY REFERENCE GUIDE
## Goldman Sachs-Level Finance Knowledge Base

---

## TABLE OF CONTENTS
1. Valuation Methodologies
2. LBO Modeling Framework
3. M&A Transaction Structuring
4. Capital Markets & Securities
5. Trading Strategies & Analysis
6. Portfolio Management
7. Financial Modeling Best Practices
8. Quick Reference Formulas

---

## 1. VALUATION METHODOLOGIES

### A. DISCOUNTED CASH FLOW (DCF) ANALYSIS

**Core Formula:**
```
Enterprise Value = Σ [FCF_t / (1 + WACC)^t] + Terminal Value / (1 + WACC)^n

Where:
- FCF_t = Free Cash Flow in year t
- WACC = Weighted Average Cost of Capital
- Terminal Value = FCF_n+1 / (WACC - g)
- g = Perpetual growth rate (typically 2-3%)
```

**Step-by-Step DCF Process:**

**Step 1: Project Free Cash Flows (5-10 years)**
```
EBIT (Earnings Before Interest & Tax)
× (1 - Tax Rate)
= NOPAT (Net Operating Profit After Tax)
+ Depreciation & Amortization (non-cash)
- Capital Expenditures
- Change in Net Working Capital
= Unlevered Free Cash Flow
```

**Step 2: Calculate WACC**
```
WACC = (E/V × Re) + (D/V × Rd × (1-Tc))

Where:
- E = Market value of equity
- D = Market value of debt
- V = E + D (total firm value)
- Re = Cost of equity (CAPM)
- Rd = Cost of debt (YTM on bonds or interest rate)
- Tc = Corporate tax rate

Cost of Equity (CAPM):
Re = Rf + β × (Rm - Rf)
- Rf = Risk-free rate (10-year Treasury)
- β = Beta (stock volatility vs. market)
- Rm = Expected market return
- Market Risk Premium = Rm - Rf (historically ~7-8%)
```

**Step 3: Calculate Terminal Value (Two Methods)**

**Method 1: Perpetuity Growth**
```
Terminal Value = FCF_final year × (1 + g) / (WACC - g)

Typical perpetuity growth rates:
- Mature companies: 2-3%
- GDP growth rate: good benchmark
- Never exceed WACC (creates infinite value)
```

**Method 2: Exit Multiple**
```
Terminal Value = EBITDA_final year × Exit Multiple

Exit multiples by industry:
- Software/SaaS: 10-15x EBITDA
- Healthcare: 8-12x EBITDA
- Manufacturing: 6-8x EBITDA
- Retail: 5-7x EBITDA
- Real Estate: Cap Rate method
```

**Step 4: Sensitivity Analysis**
```
Create sensitivity table with:
- WACC range: ±2% (e.g., 8%, 9%, 10%, 11%, 12%)
- Growth rate range: ±1% (e.g., 1%, 2%, 3%, 4%)
- Revenue growth assumptions
- Margin assumptions
```

**DCF Sanity Checks:**
- Terminal value should be 60-80% of total EV (if higher, recheck assumptions)
- Implied exit multiple should align with industry comps
- Growth rate should not exceed GDP long-term
- WACC should be reasonable for industry/risk profile

---

### B. COMPARABLE COMPANY ANALYSIS (TRADING COMPS)

**Key Multiples:**

**Enterprise Value Multiples:**
```
EV/Revenue - Best for early-stage, high-growth companies
EV/EBITDA - Most common, adjusts for capital structure
EV/EBIT - When D&A varies significantly
EV/Unlevered FCF - Best for mature cash-generative businesses
```

**Equity Value Multiples:**
```
P/E (Price/Earnings) - Most widely used
P/B (Price/Book) - For asset-heavy businesses (banks, real estate)
P/S (Price/Sales) - For unprofitable high-growth companies
PEG (P/E to Growth) - Adjusts P/E for growth rate
```

**Calculating Enterprise Value:**
```
Market Cap (Equity Value)
+ Total Debt
+ Preferred Stock
+ Minority Interest
- Cash & Cash Equivalents
= Enterprise Value
```

**Comp Selection Criteria:**
1. Same industry/sector
2. Similar business model
3. Comparable size (revenue, market cap)
4. Similar growth profile
5. Similar geography/end markets
6. Similar margin profile

**Statistical Analysis:**
```
Calculate for each multiple:
- Mean
- Median (preferred - less affected by outliers)
- 25th percentile
- 75th percentile
- High/Low range

Apply to target company's metrics:
EV = Median EV/EBITDA × Target EBITDA
Equity Value = EV - Net Debt
```

---

### C. PRECEDENT TRANSACTION ANALYSIS

**Premium Analysis:**
```
Takeover Premium = (Offer Price - Unaffected Price) / Unaffected Price

Typical premiums by sector:
- Technology: 30-50%
- Healthcare: 25-40%
- Industrials: 20-35%
- Financial Services: 15-30%
```

**Control Premium Components:**
1. Synergies (revenue & cost)
2. Strategic value
3. Competitive dynamics
4. Market conditions
5. Buyer's cost of capital

**Transaction Multiples:**
```
Same as trading comps, but:
- Use transaction EV (price paid)
- Use LTM metrics at announcement
- Adjust for synergies if disclosed
- Consider form of consideration (cash, stock, earnout)
```

---

## 2. LBO MODELING FRAMEWORK

### LBO OVERVIEW
Private equity firms buy companies using significant debt, improve operations, and sell for profit in 3-7 years.

**Returns Drivers:**
1. Deleveraging (paying down debt)
2. EBITDA growth (operational improvement)
3. Multiple expansion (selling at higher multiple than purchase)

---

### LBO MODEL BUILD

**Step 1: Sources & Uses**

**USES (What money is spent on):**
```
Purchase Equity Value
+ Refinance/Repay Existing Debt
+ Transaction Fees (2-5%)
+ Financing Fees (2-3% of debt)
= Total Uses
```

**SOURCES (Where money comes from):**
```
Senior Debt (40-50% of purchase price)
+ Subordinated Debt / Mezzanine (10-20%)
+ Preferred Equity (optional, 5-10%)
+ Sponsor Equity (30-40%)
= Total Sources

Rule: Total Sources = Total Uses
```

**Step 2: Debt Structure**

**Typical LBO Capital Structure:**
```
Senior Secured Debt (Term Loan A):
- 2-3x EBITDA multiple
- LIBOR + 200-300 bps
- 5-7 year maturity
- Amortization: 5-15% annually

Term Loan B:
- 3-4x EBITDA
- LIBOR + 300-450 bps
- 7-8 year maturity
- Minimal amortization

Mezzanine Debt:
- 1-2x EBITDA
- 10-14% cash interest + PIK toggle
- 8-10 year maturity
- Equity kickers (warrants)

Revolver:
- 10-15% of purchase price
- LIBOR + 250-350 bps
- Undrawn unless needed
```

**Step 3: Operating Model**

**Revenue Build:**
```
Base Year Revenue
× (1 + Organic Growth %)
× (1 + Volume/Price %)
+ Acquisition Revenue
= Projected Revenue

Typical assumptions:
- Mature industries: 2-5% growth
- Growth industries: 8-15% growth
- Turnaround situations: negative to flat first 2 years, then inflection
```

**Margin Improvement:**
```
Year 1 EBITDA Margin
+ Cost reduction initiatives (typically 100-300 bps)
+ Operating leverage (50-100 bps)
= Exit EBITDA Margin

Value creation plan components:
- Procurement savings
- Headcount optimization
- Facility consolidation
- Sales force productivity
- Pricing power
```

**Step 4: Debt Paydown (Cash Flow Waterfall)**
```
EBITDA
- Cash Interest Expense
- Cash Taxes (on EBIT)
= After-Tax Cash Flow from Operations

+ Depreciation & Amortization (add back)
- Capital Expenditures (maintenance + growth)
- Change in Net Working Capital
= Free Cash Flow

Free Cash Flow allocation priority:
1. Mandatory debt amortization
2. Excess cash sweep (if required by credit agreement)
3. Optional debt paydown (to maximize IRR)
4. Dividend recaps (if covenant headroom exists)
```

**Step 5: Exit Assumptions**

**Exit Multiple Method:**
```
Exit Enterprise Value = Exit Year EBITDA × Exit Multiple

Exit multiple considerations:
- Entry multiple ± 0-1 turn (conservative)
- Industry median multiple
- Comparable transaction multiples
- Market conditions assumption

Sensitivity:
- Base case: Entry multiple
- Upside: Entry + 0.5-1.0x
- Downside: Entry - 0.5-1.0x
```

**Step 6: Returns Calculation**

**Money-on-Money (MOIC):**
```
MOIC = Exit Equity Value / Initial Equity Investment

Benchmarks:
- 2.0x = Acceptable
- 2.5x = Good
- 3.0x+ = Great
```

**Internal Rate of Return (IRR):**
```
IRR = [(Exit Value / Entry Value)^(1/Years)] - 1

Target IRRs by fund type:
- Mega funds (>$5B): 15-20%
- Large cap ($1-5B): 20-25%
- Middle market ($250M-$1B): 25-30%
- Lower middle market (<$250M): 30%+
```

**Gross vs. Net IRR:**
```
Gross IRR (to fund, before fees)
- Management fees (1.5-2% annually)
- Carry/Promote (20% of profits above hurdle)
= Net IRR (to LPs)
```

---

## 3. M&A TRANSACTION STRUCTURING

### DEAL STRUCTURE OPTIONS

**A. Stock Purchase vs. Asset Purchase**

**Stock Purchase:**
```
Buyer acquires stock from shareholders

Advantages:
+ Simpler transaction (one agreement)
+ Contracts/licenses typically transfer automatically
+ Minority shareholders can be forced out (if >90% acquired)

Disadvantages:
- Assumes ALL liabilities (including unknown/contingent)
- No step-up in tax basis
- Shareholder approval required

Tax treatment:
- Sellers: Capital gains tax on sale proceeds
- Buyer: No immediate tax benefit (no basis step-up)
```

**Asset Purchase:**
```
Buyer acquires specific assets and assumes specific liabilities

Advantages:
+ Cherry-pick assets (exclude unwanted items)
+ Avoid unknown liabilities
+ Step-up tax basis (tax shield from D&A)
+ Can structure as tax-free reorganization

Disadvantages:
- More complex (multiple agreements for each asset)
- May require third-party consents (contracts, leases)
- Sales taxes may apply (varies by state)

Tax treatment:
- Sellers: Ordinary income on asset sale (worse for sellers)
- Buyer: Immediate tax benefit (depreciation/amortization)
- Section 338(h)(10) election: Treat as asset sale for tax (both parties benefit)
```

**B. Form of Consideration**

**All Cash:**
```
Advantages:
+ Certainty for sellers
+ Clean transaction
+ No dilution

Disadvantages:
- Requires financing (debt or equity raise)
- Seller pays immediate capital gains tax
- No ongoing participation in upside
```

**All Stock:**
```
Exchange ratio = Offer Price per Share / Buyer Stock Price

Advantages:
+ No cash required (conserve liquidity)
+ Seller defers tax (if structured as tax-free reorganization)
+ Seller retains upside exposure

Disadvantages:
- Dilution to existing shareholders
- Price fluctuation risk (collar structures mitigate)
- Complexity in valuing exchange ratio
```

**Mixed Consideration:**
```
Example: 60% cash / 40% stock

Advantages:
+ Balances interests (liquidity + upside)
+ Can optimize tax treatment
+ Flexibility in financing

Structure options:
- Fixed exchange ratio
- Floating exchange ratio
- Collar (capped and floored)
```

**C. Earnout Structures**

**When to Use Earnouts:**
- Valuation gap between buyer and seller
- Business with uncertain future performance
- Key management retention is critical
- Regulatory/integration risk

**Typical Earnout Terms:**
```
Purchase Price = Upfront Payment + Earnout (if targets met)

Example:
Upfront: $50M
Earnout: Up to $20M over 3 years based on:
- Year 1: Revenue > $30M → $5M
- Year 2: Revenue > $35M → $7M
- Year 3: Revenue > $40M → $8M

Metrics used:
- Revenue (most common)
- EBITDA (preferred by buyers)
- Customer retention
- Product milestones
- Regulatory approvals
```

**Earnout Best Practices:**
```
Clear definitions:
- What exactly is being measured?
- How are adjustments calculated?
- Who controls the business during earnout period?
- Dispute resolution mechanism

Typical earnout period: 1-3 years
Typical earnout as % of total: 10-40%

Red flags:
- Earnouts > 50% of total consideration (creates misalignment)
- Vague performance metrics
- No protection for sellers if buyer changes strategy
```

---

## 4. CAPITAL MARKETS & SECURITIES

### A. EQUITY OFFERINGS

**IPO (Initial Public Offering):**
```
Process timeline: 3-6 months

Steps:
1. Select underwriters (typically 2-4 banks)
2. File S-1 registration statement with SEC
3. SEC review and comments (2-3 rounds)
4. Roadshow (2 weeks, meet institutional investors)
5. Pricing (night before trading)
6. Trading begins

Typical costs:
- Underwriting discount: 5-7%
- Legal fees: $2-5M
- Accounting: $1-2M
- Printing/misc: $500K-1M
Total: 8-10% of proceeds

Lock-up period: 180 days (insiders can't sell)
```

**Secondary Offerings:**
```
Types:
- Follow-on offering: Company issues new shares
- Secondary sale: Existing shareholders sell
- Mixed: Both new issuance and secondary

Process: Faster than IPO (1-2 weeks)
- File S-3 (shelf registration) or spot secondary
- Marketing (1-2 days for marketed deal)
- Pricing
- Settlement (T+2)

Costs: 2-5% underwriting fee
```

**PIPE (Private Investment in Public Equity):**
```
Definition: Private placement to accredited investors

Structure:
- Common stock at discount (5-15% typical)
- Preferred stock with conversion features
- Warrants attached

Registration rights: Typically must register within 30-90 days

Used when:
- Need capital quickly
- Market conditions poor for public offering
- Strategic investor involvement desired
```

### B. DEBT CAPITAL MARKETS

**Investment Grade Bonds:**
```
Ratings: BBB- or higher (S&P/Fitch) or Baa3 (Moody's)

Typical terms:
- Maturity: 5, 7, 10, 30 years
- Coupon: Treasury + 50-200 bps (depends on rating)
- Covenants: Minimal (negative pledge, limitation on liens)
- Make-whole call: T+20-50 bps

Process:
1. Rating agency presentations
2. Investor roadshow (optional for known issuers)
3. Price talk (initial spread guidance)
4. Book building
5. Pricing
6. Settlement (T+2 or T+5)
```

**High Yield Bonds:**
```
Ratings: Below BBB-/Baa3

Typical terms:
- Maturity: 7-10 years
- Coupon: Treasury + 300-800 bps
- Covenants: Incurrence-based (debt/EBITDA, fixed charge coverage)
- Call protection: NC3 (non-call 3 years), then 103, 102, 101, par

Used for:
- LBO financing
- Dividend recaps
- M&A
- Refinancing bank debt

144A with registration rights:
- Sold to QIBs (Qualified Institutional Buyers)
- Must file registration statement within 180-365 days
```

**Convertible Bonds:**
```
Structure: Debt that converts to equity at predetermined price

Key terms:
- Conversion price: 20-40% premium to current stock price
- Coupon: 0-3% (below straight debt due to equity optionality)
- Maturity: 5-7 years

Valuation:
Bond value + Option value = Convertible value

Hedge fund strategy:
- Buy convertible, short stock (delta hedge)
- Capture credit spread + volatility
- Adjust hedge ratio as delta changes
```

---

## 5. TRADING STRATEGIES & ANALYSIS

### A. EQUITY TRADING STRATEGIES

**Long/Short Equity:**
```
Strategy: Long undervalued stocks, short overvalued

Position sizing:
- Gross exposure: Sum of |long| + |short|
- Net exposure: Long - Short
- Example: 130% long, 50% short = 180% gross, 80% net

Risk management:
- Single position limit: 5-10%
- Sector limits: 20-30%
- Stop loss: -7% to -10%
- Profit target: Risk/reward 1:3 minimum
```

**Pairs Trading:**
```
Identify correlated stocks that diverged

Example: Coca-Cola (KO) vs. Pepsi (PEP)
- Historical ratio: KO/PEP = 1.1
- Current ratio: 1.3 (KO expensive)
- Trade: Short KO, Long PEP
- Target: Ratio returns to 1.1

Risk: Pairs can decouple permanently
```

**Event-Driven Trading:**
```
Merger Arbitrage:
- Company A to buy Company B for $50/share
- B trading at $48
- Spread: $2 (4% gross, annualize based on timeline)
- Risk: Deal breaks, B falls to pre-announcement price

Earnings trades:
- Straddle: Buy call + put (bet on volatility)
- Strangle: OTM call + OTM put (cheaper, needs bigger move)
- Iron condor: Sell volatility if expecting small move
```

### B. OPTIONS STRATEGIES

**Basic Strategies:**
```
Covered Call:
- Own 100 shares, sell 1 call
- Generate income, cap upside
- Example: Own stock at $50, sell $55 call for $2
- Max profit: $7 (if stock >= $55 at expiry)

Protective Put:
- Own 100 shares, buy 1 put
- Insurance against downside
- Example: Own at $50, buy $45 put for $1
- Max loss: $6 (if stock <= $45)
```

**Spread Strategies:**
```
Bull Call Spread:
- Buy $50 call, sell $55 call
- Limited risk, limited reward
- Profitable if stock rises moderately

Iron Butterfly:
- Sell ATM call and put
- Buy OTM call and put
- Profit from low volatility
- Max profit at strike price
```

**Greeks:**
```
Delta: Price change per $1 stock move
Gamma: Delta change per $1 stock move
Theta: Time decay per day
Vega: Price change per 1% volatility change
Rho: Price change per 1% interest rate change

Portfolio Greeks management:
- Delta-neutral: Hedge directional risk
- Gamma-neutral: Hedge convexity risk
- Vega-neutral: Hedge volatility risk
```

---

## 6. PORTFOLIO MANAGEMENT

### A. MODERN PORTFOLIO THEORY

**Efficient Frontier:**
```
Optimization: Maximize return for given risk

Sharpe Ratio = (Return - Risk Free Rate) / Standard Deviation

Capital Allocation Line:
- Tangent portfolio (max Sharpe)
- Combine with risk-free asset
- Leverage if risk tolerance high
```

**CAPM & Factor Models:**
```
Single Factor (CAPM):
R = Rf + β(Rm - Rf)

Fama-French Three Factor:
R = Rf + β₁(Rm-Rf) + β₂(SMB) + β₃(HML)
- SMB: Small minus Big (size factor)
- HML: High minus Low (value factor)

Five Factor adds:
- RMW: Robust minus Weak (profitability)
- CMA: Conservative minus Aggressive (investment)
```

### B. RISK MANAGEMENT

**Value at Risk (VaR):**
```
95% 1-day VaR = $1M means:
- 95% confidence won't lose more than $1M tomorrow
- Expect to exceed once per month (1/20 days)

Calculation methods:
1. Historical simulation
2. Variance-covariance
3. Monte Carlo simulation
```

**Stress Testing:**
```
Scenarios:
- 2008 financial crisis repeat
- Interest rates +300 bps
- Oil price shock
- Pandemic/geopolitical event

Portfolio adjustments:
- Reduce leverage
- Add hedges (puts, VIX calls)
- Diversify across asset classes
```

---

## 7. QUICK REFERENCE FORMULAS

**Valuation:**
```
P/E = Price / EPS
EV/EBITDA = Enterprise Value / EBITDA
PEG = P/E / Growth Rate
Dividend Yield = Annual Dividend / Price
FCF Yield = FCF per Share / Price
```

**Returns:**
```
Total Return = (Ending Value - Beginning Value + Dividends) / Beginning Value
CAGR = (Ending Value / Beginning Value)^(1/Years) - 1
IRR: Rate where NPV = 0
MOIC = Exit Value / Entry Value
```

**Fixed Income:**
```
Current Yield = Annual Coupon / Price
YTM: Rate where PV of cash flows = Price
Duration: % price change for 1% yield change
Convexity: Curvature of price-yield relationship
```

**Credit Metrics:**
```
Debt/EBITDA: Leverage ratio
EBITDA/Interest: Coverage ratio
(EBITDA - CapEx) / Interest: Fixed Charge Coverage
Debt Service Coverage = EBITDA / (Interest + Principal)
```

---

*This reference guide represents institutional-grade financial knowledge. Use for educational purposes and always verify current regulations and market conditions.*