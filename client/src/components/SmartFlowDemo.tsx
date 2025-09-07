import React from "react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/GlassCard";
import { Zap, Shield, Cpu } from "lucide-react";

export default function SmartFlowDemo() {
  return (
    <div className="sf-bg p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="sf-shine text-4xl font-bold mb-4">SmartFlow Systems Integration</h1>
        <p className="text-[rgba(233,230,223,0.8)] max-w-2xl mx-auto">
          Demonstrating the seamless integration of standardized SmartFlow components 
          with advanced premium animations and effects.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard 
          title="Standardized Classes"
          cta={<Button className="sf-btn">Learn More</Button>}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="text-[var(--sf-gold)]" size={20} />
            <span className="sf-shine font-semibold">Utility First</span>
          </div>
          <p>Uses standardized SF utility classes like <code className="sf-glass px-2 py-1 text-sm">.sf-bg</code>, <code className="sf-glass px-2 py-1 text-sm">.sf-shine</code>, and <code className="sf-glass px-2 py-1 text-sm">.sf-btn</code> for consistent styling.</p>
        </GlassCard>
        
        <GlassCard 
          title="Advanced Animations"
          cta={<Button variant="outline">Explore Effects</Button>}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-[var(--sf-gold)]" size={20} />
            <span className="gradient-gold-text font-semibold">Enhanced UI</span>
          </div>
          <p>Combines standardized components with advanced circuit board backgrounds, interactive sparkles, and ultra-realistic glassmorphism effects.</p>
        </GlassCard>
        
        <GlassCard 
          title="Brand Assets"
          cta={<Button variant="secondary">View Logos</Button>}
        >
          <div className="flex items-center gap-2 mb-3">
            <Cpu className="text-[var(--sf-gold)]" size={20} />
            <span className="sf-shine font-semibold">Professional</span>
          </div>
          <p>Includes official SmartFlow Systems logos and brand assets for consistent professional presentation across all implementations.</p>
        </GlassCard>
      </div>
      
      <div className="sf-glass p-6 text-center">
        <h3 className="sf-shine text-xl font-bold mb-2">Perfect Harmony</h3>
        <p className="text-[rgba(233,230,223,0.8)]">
          The integration provides both standardized utility classes for rapid development 
          and premium visual effects for an exceptional user experience.
        </p>
      </div>
    </div>
  );
}