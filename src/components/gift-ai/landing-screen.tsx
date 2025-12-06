import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface LandingScreenProps {
  onStart: (handle: string) => void;
  isLoading?: boolean;
}

export function LandingScreen({ onStart, isLoading }: LandingScreenProps) {
  const [handle, setHandle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      let formatted = handle.trim();
      if (!formatted.startsWith("@")) {
        formatted = "@" + formatted;
      }
      onStart(formatted);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col items-center justify-center p-6 text-center">
      {/* Header / Logo */}
      <div className="absolute top-6 left-6 font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
        Gift-AI
      </div>

      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-3xl rotate-3 flex items-center justify-center shadow-xl">
             <span className="text-4xl">🎁</span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Descubra o presente ideal
          </h1>
          <p className="text-lg text-slate-500 px-4">
            Analisamos o Instagram para criar sugestões personalizadas e emocionantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="relative">
            <Input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@ joao_corrida"
              className="h-14 pl-6 text-lg rounded-2xl border-slate-200 shadow-sm focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-semibold rounded-2xl bg-slate-900 hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando..." : "Analisar perfil"}
          </Button>
          <p className="text-xs text-slate-400">
            Analisamos apenas dados públicos para gerar sugestões.
          </p>
        </form>
      </div>
    </div>
  );
}
