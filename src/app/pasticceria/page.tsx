import { redirect } from 'next/navigation';

export default function PasticceriaPage() {
  redirect('/menu?cat=pasticceria');
}

