import { prisma } from "@/lib/prisma";

export async function logAuditEvent({
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
}: {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entity,
        entityId: entityId || null,
        details: details || null,
        ipAddress: ipAddress || "127.0.0.1",
      },
    });
  } catch (error) {
    console.error("Failed to write audit log:", error);
  }
}
