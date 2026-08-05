import { Redirect } from 'expo-router';

export default function Index() {
  // Langsung arahkan user ke screen dashboard
  return <Redirect href="/dashboard" />;
}