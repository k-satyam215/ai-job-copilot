"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { api } from "../../lib/api";

export default function BillingPage() {
  const [plans, setPlans] = useState<any>({});
  const [me, setMe] = useState<any>(null);
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    api.get("/billing/plans").then((res) => setPlans(res.data)).catch(() => {});
    api.get("/billing/me").then((res) => setMe(res.data)).catch(() => {});
  }, []);

  async function createRazorpayOrder(plan: string) {
    const res = await api.post("/billing/razorpay/order", { plan });
    setOrder(res.data);
  }

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Navbar title="SaaS Billing" />
        <section className="panel"><h2>Current Plan</h2><p className="muted">{me?.plan || "free"} - {me?.ai_credits ?? 0} AI credits</p></section>
        <section className="grid" style={{ marginTop: 16 }}>
          {Object.entries(plans).map(([name, plan]: any) => <article className="panel" key={name}><span className="badge">{name}</span><h2>{plan.price === 0 ? "Free" : `$${plan.price}`}</h2><p className="muted">{plan.features.join(", ")}</p>{name !== "free" && <button className="button" onClick={() => createRazorpayOrder(name)}>Create Razorpay Order</button>}</article>)}
        </section>
        {order && <section className="panel" style={{ marginTop: 16 }}><h2>Razorpay Order</h2><pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(order, null, 2)}</pre></section>}
      </main>
    </div>
  );
}
