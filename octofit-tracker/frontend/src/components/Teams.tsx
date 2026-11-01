import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

function loadTeams() {
  return getJson<Record<string, unknown>>('/api/teams');
}

export default function Teams() {
  return <CapabilityCard
    title="Teams"
    description="Manage teams and members."
    load={loadTeams}
    collection="teams"
    emptyMessage="No teams yet."
    renderItem={(team: { name: string; members?: unknown[] }) => `${team.name} (${team.members?.length ?? 0} members)`}
  />;
}
