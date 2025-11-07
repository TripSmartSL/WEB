import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CreditCard, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { StripePaymentFormProps } from '@/types';

const countries = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 
  'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Austria', 'Belgium', 'Sweden',
  'Norway', 'Denmark', 'Finland', 'Ireland', 'Portugal', 'Greece', 'Poland',
  'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia', 'Slovakia',
  'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Cyprus',
  'Japan', 'South Korea', 'Singapore', 'Hong Kong', 'New Zealand', 'Sri Lanka'
];

const StripePaymentForm = ({ amount, onSuccess, onCancel }: StripePaymentFormProps) => {
  const { toast } = useToast();
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    country: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setCardData({ ...cardData, [name]: formatCardNumber(value) });
    } else if (name === 'expiryDate') {
      setCardData({ ...cardData, [name]: formatExpiryDate(value) });
    } else if (name === 'cvv') {
      setCardData({ ...cardData, [name]: value.replace(/\D/g, '').slice(0, 3) });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: 'Payment Successful!',
        description: `Your payment of $${amount} has been processed successfully.`,
      });
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card information</Label>
              <div className="relative">
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={cardData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="pr-12"
                  required
                  maxLength={19}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={cardData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM / YY"
                  required
                  maxLength={5}
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="cvv"
                  name="cvv"
                  type="text"
                  value={cardData.cvv}
                  onChange={handleInputChange}
                  placeholder="CVC"
                  required
                  maxLength={3}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Name on card</Label>
              <Input
                id="cardName"
                name="cardName"
                value={cardData.cardName}
                onChange={handleInputChange}
                placeholder="Full name on card"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country or region</Label>
              <select
                id="country"
                name="country"
                value={cardData.country}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-background"
                required
              >
                <option value="">Select country...</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Total Amount</span>
              <span className="text-2xl font-bold">${amount}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <Lock className="h-3 w-3" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-sunset hover:shadow-glow"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay $${amount}`}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default StripePaymentForm;
