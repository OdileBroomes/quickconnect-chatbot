import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const initialOptions = [
  "New Order",
  "Return/Cancel Service",
  "Technical Support",
  "Speak to a Representative"
];

const issueTypes = ["No Signal", "Slow Internet", "Dropped Calls", "Other"];
const languages = ["English", "Spanish", "French", "Portuguese"];
const orderOptions = [
  "Replacement Phone",
  "Replacement SIM Card",
  "New Phone",
  "New Cable TV Subscription"
];

const orderDetails = {
  "Replacement Phone": { stock: false, eta: "3 business days", delivery: "Pickup at office" },
  "Replacement SIM Card": { stock: true, eta: "Available immediately", delivery: "Pickup at office" },
  "New Phone": { stock: true, eta: "Available immediately", delivery: "Home delivery" },
  "New Cable TV Subscription": { stock: false, eta: "Available next week", delivery: "Technician will install at your home" },
};

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Welcome to QuickConnect Support Chat!" },
    { from: "bot", text: "How can we assist you today?" }
  ]);

  const [state, setState] = useState("main_menu");
  const [input, setInput] = useState("");
  const [selection, setSelection] = useState("");
  const [issue, setIssue] = useState("");
  const [language, setLanguage] = useState("");
  const [order, setOrder] = useState("");

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const handleMainSelection = (value) => {
    setSelection(value);
    addMessage("user", value);
    switch (value) {
      case "New Order":
        addMessage("bot", "Please select the item you'd like to order:");
        setState("awaiting_order");
        break;
      case "Return/Cancel Service":
        addMessage("bot", "We're sorry to see you go. Please tell us your reason for cancelling:");
        setState("awaiting_return_reason");
        break;
      case "Technical Support":
        addMessage("bot", "Please select your issue type:");
        setState("awaiting_issue_type");
        break;
      case "Speak to a Representative":
        addMessage("bot", "Before we connect you, please select your preferred language:");
        setState("awaiting_language");
        break;
    }
  };

  const handleInputSubmit = () => {
    if (!input) return;
    addMessage("user", input);

    if (state === "awaiting_return_reason") {
      addMessage("bot", "Thank you. Your cancellation request has been noted and is being processed.");
      setState("main_menu");
    } else if (state === "awaiting_issue_description") {
      addMessage("bot", "Thanks. We've recorded your issue and will forward it to our technical team.");
      setState("main_menu");
    } else if (state === "check_resolved") {
      if (input.toLowerCase().includes("yes")) {
        addMessage("bot", "👍 Glad it's resolved! Let us know if you need anything else.");
      } else {
        addMessage("bot", "⚙️ We'll escalate this to our support team. You will be contacted shortly.");
      }
      setState("main_menu");
    }
    setInput("");
  };

  const handleIssueSelection = (val) => {
    setIssue(val);
    addMessage("user", `Issue Selected: ${val}`);
    if (val === "Other") {
      addMessage("bot", "Please briefly describe your issue:");
      setState("awaiting_issue_description");
    } else {
      let steps = "";
      if (val === "No Signal") steps = "- Check airplane mode\n- Restart device\n- Verify network coverage";
      if (val === "Slow Internet") steps = "- Restart modem/router\n- Disconnect unused devices\n- Switch networks";
      if (val === "Dropped Calls") steps = "- Check signal bars\n- Restart device\n- Try another location";
      addMessage("bot", `🛠 Troubleshooting Steps:\n${steps}\n\nDid this help? Type 'yes' or 'no' below.`);
      setState("check_resolved");
    }
  };

  const handleLanguageSelection = (lang) => {
    setLanguage(lang);
    addMessage("user", `Preferred Language: ${lang}`);
    addMessage("bot", `Connecting you to a ${lang}-speaking representative...\n📞 Or call 1-800-QUICKHELP for immediate assistance.`);
    setState("main_menu");
  };

  const handleOrderSelection = (item) => {
    setOrder(item);
    addMessage("user", `Order selected: ${item}`);
    const d = orderDetails[item];
    if (d.stock) {
      addMessage("bot", `✅ ${item} is in stock.\nDelivery: ${d.delivery}\nETA: ${d.eta}`);
    } else {
      addMessage("bot", `❌ ${item} is out of stock.\nETA: ${d.eta}\nDelivery: ${d.delivery}`);
    }
    setState("main_menu");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardContent className="space-y-2">
          <div className="h-[400px] overflow-y-auto border rounded p-2 bg-white">
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-${msg.from === "bot" ? "blue" : "green"}-700 mb-2`}>
                <strong>{msg.from === "bot" ? "Bot" : "You"}:</strong> {msg.text}
              </div>
            ))}
          </div>
          {state === "main_menu" && (
            <Select onValueChange={handleMainSelection}>
              {initialOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </Select>
          )}
          {state === "awaiting_order" && (
            <Select onValueChange={handleOrderSelection}>
              {orderOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </Select>
          )}
          {state === "awaiting_issue_type" && (
            <Select onValueChange={handleIssueSelection}>
              {issueTypes.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </Select>
          )}
          {state === "awaiting_language" && (
            <Select onValueChange={handleLanguageSelection}>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>{lang}</SelectItem>
              ))}
            </Select>
          )}
          {!["main_menu", "awaiting_order", "awaiting_issue_type", "awaiting_language"].includes(state) && (
            <div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your response..." />
              <Button onClick={handleInputSubmit}>Send</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
