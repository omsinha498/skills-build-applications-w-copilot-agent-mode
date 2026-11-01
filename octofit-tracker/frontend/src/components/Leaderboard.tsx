import { CapabilityCard } from './CapabilityCard.js';
export default function Leaderboard() {
  return <CapabilityCard
    title="Leaderboard"
    description="Compare team point totals."
    endpoint="/api/leaderboard"
    collection="leaderboard"
    emptyMessage="No rankings yet."
    renderItem={(entry: { teamName: string; totalPoints: number; rank: number }) => `${entry.rank}. ${entry.teamName}: ${entry.totalPoints} points`}
  />;
}
