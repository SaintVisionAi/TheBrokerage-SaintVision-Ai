import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, DollarSign, TrendingUp } from 'lucide-react';

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('500000');
  const [loanTerm, setLoanTerm] = useState('30');
  const [interestRate, setInterestRate] = useState('9');
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanTerm);
    const annualRate = parseFloat(interestRate);

    if (!principal || !years || !annualRate) return;

    const monthlyRate = (annualRate / 100) / 12;
    const numberOfPayments = years * 12;
    const compoundFactor = Math.pow(1 + monthlyRate, numberOfPayments);
    const monthlyPayment = (principal * monthlyRate * compoundFactor) / (compoundFactor - 1);

    if (!isNaN(monthlyPayment) && monthlyPayment !== Infinity && monthlyPayment > 0) {
      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - principal;

      setResult({
        monthlyPayment,
        totalPayment,
        totalInterest
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-900/20 to-black border-green-400/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl text-green-400">
          <Calculator className="h-6 w-6" />
          Business Loan Payment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="loan-amount" className="text-white">Loan Amount ($)</Label>
            <Input
              id="loan-amount"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="bg-white/5 border-green-400/30 text-white text-lg font-bold"
              data-testid="input-loan-amount"
            />
          </div>
          <div>
            <Label htmlFor="loan-term" className="text-white">Loan Term (years)</Label>
            <Input
              id="loan-term"
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(e.target.value)}
              className="bg-white/5 border-green-400/30 text-white text-lg font-bold"
              data-testid="input-loan-term"
            />
          </div>
          <div>
            <Label htmlFor="interest-rate" className="text-white">Interest Rate (%)</Label>
            <Input
              id="interest-rate"
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="bg-white/5 border-green-400/30 text-white text-lg font-bold"
              data-testid="input-interest-rate"
            />
          </div>
        </div>

        <Button
          onClick={calculateLoan}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-bold text-lg py-6"
          data-testid="button-calculate-loan"
        >
          <DollarSign className="h-5 w-5 mr-2" />
          Calculate Payment
        </Button>

        {result && (
          <div className="mt-6 space-y-4 p-6 bg-green-400/10 border border-green-400/30 rounded-lg">
            <div className="text-center">
              <p className="text-white/70 text-sm mb-2">Monthly Payment</p>
              <p className="text-4xl font-bold text-green-400" data-testid="text-monthly-payment">
                ${result.monthlyPayment.toFixed(2)}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-green-400/20">
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">Total Payment</p>
                <p className="text-xl font-bold text-white" data-testid="text-total-payment">
                  ${result.totalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm mb-1">Total Interest</p>
                <p className="text-xl font-bold text-white" data-testid="text-total-interest">
                  ${result.totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-white/60 text-sm mb-3">Ready to get started?</p>
              <a href="/apply">
                <Button className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Apply Now - Get Pre-Qualified
                </Button>
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
