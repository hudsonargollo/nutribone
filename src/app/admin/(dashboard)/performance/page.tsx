import { getStorePerformance, getOrderStatusBreakdown } from "@/lib/admin-data";
import { PerformanceRings } from "@/components/admin/performance-rings";
import { OrderPipelineDonut } from "@/components/admin/order-pipeline-donut";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Rendimiento" };

export const dynamic = "force-dynamic";

export default async function PerformancePage() {
  await requireAdmin(); // layouts don't re-run on client navigation
  const [performance, statusBreakdown] = await Promise.all([
    getStorePerformance(),
    getOrderStatusBreakdown(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Rendimiento</h1>
      <p className="mt-1 text-sm text-muted">
        La salud de la tienda y tu flujo de pedidos, de un vistazo.
      </p>

      <div className="mt-6">
        <PerformanceRings data={performance} />
      </div>
      <div className="mt-6">
        <OrderPipelineDonut counts={statusBreakdown.counts} total={statusBreakdown.total} />
      </div>
    </div>
  );
}
