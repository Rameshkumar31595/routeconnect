import { Loader2 } from 'lucide-react';

export default function LoadingState({ label }: { label: string }) {
  return (
    <div className="rounded-[2rem] border border-purple-300/50 bg-white/95 p-10 text-center shadow-lg">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600 shadow-md">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
      <p className="mt-6 text-lg font-bold text-purple-900">{label}</p>
      <p className="mt-3 max-w-xl mx-auto text-sm leading-6 text-purple-700">
        We&apos;re scanning the network for the fastest travel options for your route.
      </p>
    </div>
  );
}
