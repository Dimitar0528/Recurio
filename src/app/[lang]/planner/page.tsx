import Header from "@/components/planner/Header";
import { SubscriptionPlannerProvider } from "@/context/SubscriptionPlannerContext";
import LeftColumn from "@/components/planner/LeftColumn";
import RightColumn from "@/components/planner/RightColumn";
import { getUserSubscriptions } from "@/dal/subscriptions/queries";

export default async function Page() {
  const userSubscriptions = await getUserSubscriptions();
  const currentlyActiveSubscriptions = userSubscriptions.filter((subscription)=> subscription.status === "Active").map((subscription)=>{
    return {
      id: subscription.id,
      name: subscription.name,
      category: subscription.category,
      price: subscription.price,
      billingCycle: subscription.billingCycle,
    }
  })
  return (
    <SubscriptionPlannerProvider>
      <main
        id="main-content"
        className="min-h-screen bg-background text-foreground pb-12">
        <div className="max-w-7xl mx-auto px-6 pt-22">
          <Header />
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
            <LeftColumn />
            <RightColumn
              currentlyActiveSubscriptions={currentlyActiveSubscriptions}
            />
          </section>
        </div>
      </main>
    </SubscriptionPlannerProvider>
  );
}
