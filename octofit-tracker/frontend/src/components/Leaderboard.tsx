import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

function loadLeaderboard() {
  return getJson<Record<string, unknown>>('/api/leaderboard');
}

export default function Leaderboard() {
  return <CapabilityCard
    title="Leaderboard"
    description="Compare team point totals."
    load={loadLeaderboard}
    collection="leaderboard"
    emptyMessage="No rankings yet."
    renderItem={(entry: { teamName: string; totalPoints: number; rank: number }) => `${entry.rank}. ${entry.teamName}: ${entry.totalPoints} points`}
  />;
}
