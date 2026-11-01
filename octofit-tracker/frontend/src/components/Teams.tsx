import { CapabilityCard } from './CapabilityCard.js';
export default function Teams() {
  return <CapabilityCard
    title="Teams"
    description="Manage teams and members."
    endpoint="/api/teams"
    collection="teams"
    emptyMessage="No teams yet."
    renderItem={(team: { name: string; members?: unknown[] }) => `${team.name} (${team.members?.length ?? 0} members)`}
  />;
}
