import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

function loadWorkouts() {
  return getJson<Record<string, unknown>>('/api/workouts/suggestions/mona@example.com');
}

export default function Workouts() {
  return <CapabilityCard
    title="Workout suggestions"
    description="Recommend workouts from activity patterns."
    load={loadWorkouts}
    collection="suggestions"
    emptyMessage="No workout suggestions yet."
    renderItem={(workout: { title: string; reason: string }) => <>{workout.title}: {workout.reason}</>}
  />;
}
