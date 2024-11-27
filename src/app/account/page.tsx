"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, PlusCircle, MinusCircle } from "lucide-react";

export default function DepositAccount() {
  const [balance, setBalance] = useState(1000); // Mock initial balance
  const [amount, setAmount] = useState("");

  const handleDeposit = () => {
    setBalance((prevBalance) => prevBalance + Number(amount));
    setAmount("");
  };

  const handleWithdraw = () => {
    if (Number(amount) <= balance) {
      setBalance((prevBalance) => prevBalance - Number(amount));
      setAmount("");
    } else {
      alert("Insufficient funds");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-blue-900 mb-8">
        National Philately Deposit Account
      </h2>

      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Account Balance</CardTitle>
          <CardDescription>Manage your philately funds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-center mb-6">
            ₹{balance.toFixed(2)}
          </div>
          <Tabs defaultValue="deposit">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="deposit">Deposit</TabsTrigger>
              <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            </TabsList>
            <TabsContent value="deposit">
              <div className="space-y-4">
                {/* <Label htmlFor="deposit-amount">Deposit Amount</Label> */}
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button className="w-full" onClick={handleDeposit}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Deposit Funds
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="withdraw">
              <div className="space-y-4">
                {/* <Label htmlFor="withdraw-amount">Withdraw Amount</Label> */}
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Button className="w-full" onClick={handleWithdraw}>
                  <MinusCircle className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <CreditCard className="w-4 h-4 mr-2" />
            View Transaction History
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
