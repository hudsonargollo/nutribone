"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { refreshCatalog } from "@/lib/cache-tags";

const MAX_STOCK = 1_000_000;

export async function setProductStock(formData: FormData): Promise<void> {
  await requireAdmin();
  const productId = String(formData.get("productId") ?? "");
  const raw = Number(formData.get("stock"));
  if (!productId) return;
  const stock = Number.isFinite(raw) ? Math.min(MAX_STOCK, Math.max(0, Math.floor(raw))) : 0;

  try {
    await prisma.product.update({ where: { id: productId }, data: { stock } });
  } catch (err) {
    console.error("[inventory] could not save stock:", err);
    return;
  }
  refreshCatalog();
  revalidatePath("/admin/inventory");
}