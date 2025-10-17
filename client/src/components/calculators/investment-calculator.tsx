import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Sparkles } from 'lucide-react';

export default function InvestmentCalculator() {
  const [principal, setPrincipal] = useState('100000');
  const [annualRate, setAnnualRate] = useState('10');
  const [termYears, setTermYears] = useState('5');
  const [result, setResult] = useState<{
    annualReturn: number;
    monthlyReturn: number;
    totalReturn: number;
    finalValue: number;
    roi: number;
  } | null>(null);

  const calculateROI = () => {
    const principalAmount = parseFloat(principal);
    const rate = parseFloat(annualRate);
    const years = parseInt(termYears);

    if (!principalAmount || !rate || !years) return;

    const annualReturn = principalAmount * (rate / 100);
    const monthlyReturn = annualReturn / 12;
    const totalReturn = annualReturn * years;
    const finalValue = principalAmount + totalReturn;
    const roi = (totalReturn / principalAmount) * 100;

    setResult({
      annualReturn,
      monthlyReturn,
      totalReturn,
      finalValue,
      roi
    });
  };

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-black border-blue-400/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-blue-400">
          <Sparkles className="h-6 w-6" />
          Investment ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="principal" className="text-white">Investment Amount ($)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="bg-white/5 border-blue-400/30 text-white text-lg font-bold"
              data-testid="input-investment-principal"
            />
          </div>
          <div>
            <Label htmlFor="annual-rate" className="text-white">Annual Return Rate (%)</Label>
            <Input
              id="annual-rate"
              type="number"
              step="0.1"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="bg-white/5 border-blue-400/30 text-white text-lg font-bold"
              data-testid="input-annual-rate"
            />
            <p className="text-xs text-white/50 mt-1">SVG offers 9-12% fixed returns</p>
          </div>
          <div>
            <Label htmlFor="term-years" className="text-white">Investment Term (years)</Label>
            <Input
              id="term-years"
              type="number"
              value={termYears}
              onChange={(e) => setTermYears(e.target.value)}
              className="bg-white/5 border-blue-400/30 text-white text-lg font-bold"
              data-testid="input-term-years"
            />
          </div>
        </div>

        <Button
          onClick={calculateROI}
          className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-lg py-6"
          data-testid="button-calculate-roi"
        >
          <TrendingUp className="h-5 w-5 mr-2" />
          Calculate Returns
        </Button>

        {result && (
          <div className="mt-6 space-y-4 p-6 bg-blue-400/10 border border-blue-400/30 rounded-lg">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">Total ROI</p>
              <p className="text-5xl font-bold text-blue-400" data-testid="text-roi-percentage">
                {result.roi.toFixed(1)}%
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-blue-400/20">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">Annual Return</p>
                <p className="text-xl font-bold text-green-400" data-testid="text-annual-return">
                  ${result.annualReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">Monthly Distribution</p>
                <p className="text-xl font-bold text-green-400" data-testid="text-monthly-return">
                  ${result.monthlyReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">Total Return ({termYears} years)</p>
                <p className="text-xl font-bold text-white" data-testid="text-total-return">
                  ${result.totalReturn.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">Final Portfolio Value</p>
                <p className="text-xl font-bold text-white" data-testid="text-final-value">
                  ${result.finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="pt-4 text-center bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg">
              <p className="text-blue-400 font-bold mb-2">🙏 Faith-Aligned Investing</p>
              <p className="text-white/80 text-sm mb-3">
                Your investments align with Christian values while delivering consistent returns
              </p>
              <a href="/apply">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Start Investing Today
                </Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
