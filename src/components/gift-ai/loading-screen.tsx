import { Skeleton } from "@/components/ui/skeleton";

interface LoadingScreenProps {
  handle: string;
  stage: 'profile' | 'results';
  profileSummary?: {
      avatar?: string;
      keywords?: string[];
  };
}

export function LoadingScreen({ handle, stage, profileSummary }: LoadingScreenProps) {
  const isProfile = stage === 'profile';

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-8">
        
        {/* Avatar Placeholder or Real Image */}
        <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping opacity-75"></div>
            <div className="relative w-24 h-24 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {profileSummary?.avatar ? (
                    <img src={profileSummary.avatar} alt={handle} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-xl font-bold text-purple-600">
                        {handle.substring(1, 3).toUpperCase()}
                    </span>
                )}
            </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">
            {isProfile ? `Analisando ${handle}` : "Encontramos presentes incríveis!"}
          </h2>
          <p className="text-slate-500 text-lg">
            {isProfile 
              ? "Mergulhando nas memórias compartilhadas..." 
              : `Preparamos sugestões exclusivas para ${handle}.`}
          </p>
          
          {/* Keywords Animation */}
          {profileSummary?.keywords && profileSummary.keywords.length > 0 && !isProfile && (
              <div className="flex flex-wrap justify-center gap-2 mt-4 animate-in slide-in-from-bottom-4 duration-700">
                  {profileSummary.keywords.map((k, i) => (
                      <span key={k} className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium border border-purple-100" style={{ animationDelay: `${i * 100}ms` }}>
                          #{k}
                      </span>
                  ))}
              </div>
          )}
        </div>

        {/* Loading Card Animation - Kept simple */}
        <div className="bg-slate-50 rounded-2xl p-6 shadow-inner space-y-4 max-w-sm mx-auto">
             <div className="flex items-center space-x-4">
                 <Skeleton className="h-12 w-12 rounded-full" />
                 <div className="space-y-2">
                     <Skeleton className="h-4 w-[200px]" />
                     <Skeleton className="h-4 w-[150px]" />
                 </div>
             </div>
             <div className="space-y-2 pt-2">
                <Skeleton className="h-32 w-full rounded-xl" />
             </div>
             <p className="text-xs text-center text-slate-400 pt-2 animate-pulse">
                {isProfile ? "Identificando interesses..." : "Organizando ideias..."}
             </p>
        </div>
      </div>
    </div>
  );
}
