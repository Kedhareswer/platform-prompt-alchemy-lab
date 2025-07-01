import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus, X, Info } from "lucide-react";
import { ContextInfo, ContextType, ContextAnalysis } from "@/utils/contextPrompting";

interface ContextBuilderProps {
  analysis: ContextAnalysis | null;
  contextInfo: ContextInfo[];
  onContextChange: (contexts: ContextInfo[]) => void;
}

export const ContextBuilder = ({ analysis, contextInfo, onContextChange }: ContextBuilderProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<ContextType>>(new Set());
  const [newContexts, setNewContexts] = useState<Record<ContextType, string>>({
    situational: '',
    background: '',
    domain: '',
    temporal: '',
    audience: ''
  });

  const contextLabels: Record<ContextType, string> = {
    situational: 'Situational Context',
    background: 'Background Information', 
    domain: 'Domain-Specific Details',
    temporal: 'Time & Urgency',
    audience: 'Target Audience'
  };

  const contextDescriptions: Record<ContextType, string> = {
    situational: 'Current situation, environment, or circumstances',
    background: 'Relevant history, previous context, or existing information',
    domain: 'Industry-specific requirements, constraints, or standards',
    temporal: 'Deadlines, timeframes, urgency level, or timing considerations',
    audience: 'Who this is for, their expertise level, and specific needs'
  };

  const toggleSection = (type: ContextType) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(type)) {
      newExpanded.delete(type);
    } else {
      newExpanded.add(type);
    }
    setExpandedSections(newExpanded);
  };

  const addContext = (type: ContextType) => {
    const content = newContexts[type].trim();
    if (!content) return;

    const newContext: ContextInfo = {
      type,
      content,
      relevance: 0.8,
      priority: 'medium'
    };

    onContextChange([...contextInfo, newContext]);
    setNewContexts({ ...newContexts, [type]: '' });
  };

  const removeContext = (index: number) => {
    const updated = contextInfo.filter((_, i) => i !== index);
    onContextChange(updated);
  };

  const getContextsByType = (type: ContextType) => {
    return contextInfo.filter(ctx => ctx.type === type);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          Context Builder
          {analysis && (
            <Badge variant={analysis.completenessScore > 70 ? "default" : "secondary"}>
              {analysis.completenessScore}% Complete
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {analysis && analysis.contextGaps.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-amber-800 mb-2">Missing Context Detected:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              {analysis.contextGaps.map((gap, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  {gap}
                </li>
              ))}
            </ul>
          </div>
        )}

        {Object.entries(contextLabels).map(([type, label]) => {
          const contextType = type as ContextType;
          const isExpanded = expandedSections.has(contextType);
          const contexts = getContextsByType(contextType);
          const isMissing = analysis?.missingContext.includes(contextType);

          return (
            <div key={type} className="border rounded-lg">
              <Collapsible open={isExpanded} onOpenChange={() => toggleSection(contextType)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`w-full justify-between p-4 h-auto ${
                      isMissing ? 'bg-red-50 hover:bg-red-100' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{label}</span>
                      {contexts.length > 0 && (
                        <Badge variant="outline">{contexts.length}</Badge>
                      )}
                      {isMissing && (
                        <Badge variant="destructive" className="text-xs">Missing</Badge>
                      )}
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </Button>
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-4 pb-4">
                  <p className="text-sm text-gray-600 mb-3">{contextDescriptions[contextType]}</p>
                  
                  {/* Existing contexts */}
                  {contexts.map((context, index) => (
                    <div key={index} className="flex items-start gap-2 mb-2 p-2 bg-gray-50 rounded">
                      <span className="text-sm flex-1">{context.content}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContext(contextInfo.indexOf(context))}
                        className="text-red-600 hover:text-red-800 p-1 h-auto"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Add new context */}
                  <div className="space-y-2">
                    <Textarea
                      placeholder={`Add ${label.toLowerCase()}...`}
                      value={newContexts[contextType]}
                      onChange={(e) => setNewContexts({
                        ...newContexts,
                        [contextType]: e.target.value
                      })}
                      className="min-h-[60px] text-sm"
                    />
                    <Button
                      onClick={() => addContext(contextType)}
                      disabled={!newContexts[contextType].trim()}
                      size="sm"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add {label}
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}

        {contextInfo.length > 0 && (
          <>
            <Separator />
            <div className="text-sm text-gray-600">
              <strong>Total Context Items:</strong> {contextInfo.length}
              {analysis && (
                <span className="ml-4">
                  <strong>Completeness:</strong> {analysis.completenessScore}%
                </span>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
