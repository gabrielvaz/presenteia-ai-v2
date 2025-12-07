
import { useGift } from "@/context/gift-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function AnalysisStatusCard() {
  const { handle, profileData, isAnalyzing } = useGift();
  const [statusText, setStatusText] = useState("Iniciando leitura...");

  // Simulate progress text updates based on real data availability
  useEffect(() => {
    if (!isAnalyzing && profileData) {
        setStatusText("Perfil analisado com sucesso!");
        return;
    }

    if (profileData?.username) {
        if (profileData.recentPosts.length > 0) {
            setStatusText(`Analisando ${profileData.recentPosts.length} postagens recentes...`);
        } else {
            setStatusText(`Lendo bio de @${profileData.username}...`);
        }
    } else {
        setStatusText(`Conectando ao perfil @${handle.replace('@', '')}...`);
    }
  }, [profileData, isAnalyzing, handle]);

  if (!handle) return null;

  return (
    <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm mb-6 animate-in slide-in-from-top-4 duration-500">
      <div className="relative">
        <Avatar className="h-12 w-12 border-2 border-purple-200">
            <AvatarImage src={profileData?.profilePicUrl} className="object-cover" />
            <AvatarFallback className="bg-purple-50 text-purple-600 font-bold">
                {handle.replace('@', '').slice(0, 2).toUpperCase()}
            </AvatarFallback>
        </Avatar>
        {isAnalyzing && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <Loader2 className="h-4 w-4 text-purple-600 animate-spin" />
            </div>
        )}
      </div>
      
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-slate-800">
            {profileData?.username ? `@${profileData.username}` : handle}
        </h4>
        <p className="text-xs text-slate-500 flex items-center gap-2">
            {statusText}
        </p>
      </div>
      
      {/* Mini stats badges if available */}
      {profileData && (
        <div className="hidden sm:flex gap-2">
            {profileData.followers > 0 && (
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {profileData.followers.toLocaleString()} seg.
                </span>
            )}
        </div>
      )}
    </div>
  );
}
