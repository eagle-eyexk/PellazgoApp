import React from 'react';
import { Globe, Shield, Bell, Palette } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-8">
      <h1 className="font-heading text-2xl text-white">Cilësimet</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#8C764E]" />
            <h3 className="text-sm font-body text-white font-medium">Gjuhët</h3>
          </div>
          <p className="text-xs font-body text-white/40">Shqip (Primare) · English (Sekondare)</p>
          <p className="text-xs font-body text-white/30">Gjuhët menaxhohen automatikisht. Të gjitha produktet, kategoritë dhe artikujt mbështesin dy gjuhë.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#8C764E]" />
            <h3 className="text-sm font-body text-white font-medium">Siguria</h3>
          </div>
          <p className="text-xs font-body text-white/40">SSL · Mbrojtja e të dhënave aktive</p>
          <p className="text-xs font-body text-white/30">Të gjitha lidhjet janë të siguruara me SSL. Të dhënat ruhen me enkriptim.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[#8C764E]" />
            <h3 className="text-sm font-body text-white font-medium">Njoftimet</h3>
          </div>
          <p className="text-xs font-body text-white/40">Email-et automatike janë aktive</p>
          <p className="text-xs font-body text-white/30">Porositë e reja, ndryshimet e statusit, dhe alarmet e stokut dërgohen automatikisht.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-[#8C764E]" />
            <h3 className="text-sm font-body text-white font-medium">Tema</h3>
          </div>
          <p className="text-xs font-body text-white/40">Pellazgo — Obsidian & Bone</p>
          <p className="text-xs font-body text-white/30">Paleta e ngjyrave: Bone White (#F9F9F7), Deep Obsidian (#0A0A0A), Antique Gold (#8C764E).</p>
        </div>
      </div>
    </div>
  );
}
