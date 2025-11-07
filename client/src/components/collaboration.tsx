import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Share2,
  MessageSquare,
  Bell,
  UserPlus,
  Eye,
  Edit3,
  Circle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CollaboratorStatus {
  id: string;
  name: string;
  email: string;
  status: "online" | "offline" | "away";
  currentView?: string;
  isEditing?: boolean;
  color: string;
}

interface CollaborationActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details?: string;
}

export default function Collaboration() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [collaborators, setCollaborators] = useState<CollaboratorStatus[]>([]);
  const [activities, setActivities] = useState<CollaborationActivity[]>([]);
  const { toast } = useToast();

  // Mock collaborators (placeholder data)
  const mockCollaborators: CollaboratorStatus[] = [
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah.chen@smartflow.com",
      status: "online",
      currentView: "Dashboard",
      isEditing: false,
      color: "#FFD700",
    },
    {
      id: "2",
      name: "Mike Johnson",
      email: "mike.j@smartflow.com",
      status: "online",
      currentView: "Query Builder",
      isEditing: true,
      color: "#B58E00",
    },
    {
      id: "3",
      name: "Lisa Park",
      email: "lisa.park@smartflow.com",
      status: "away",
      color: "#E6C200",
    },
  ];

  const mockActivities: CollaborationActivity[] = [
    {
      id: "1",
      userId: "2",
      userName: "Mike Johnson",
      action: "edited",
      timestamp: new Date(Date.now() - 120000).toISOString(),
      details: "Updated sales dashboard query",
    },
    {
      id: "2",
      userId: "1",
      userName: "Sarah Chen",
      action: "commented",
      timestamp: new Date(Date.now() - 300000).toISOString(),
      details: "Added note on quarterly report",
    },
    {
      id: "3",
      userId: "3",
      userName: "Lisa Park",
      action: "viewed",
      timestamp: new Date(Date.now() - 600000).toISOString(),
      details: "Opened customer analytics",
    },
  ];

  useEffect(() => {
    if (isEnabled) {
      // Simulate loading collaborators
      setTimeout(() => {
        setCollaborators(mockCollaborators);
        setActivities(mockActivities);
      }, 500);
    }
  }, [isEnabled]);

  const enableCollaboration = () => {
    setIsEnabled(true);
    toast({
      title: "Collaboration Mode Enabled",
      description: "Real-time collaboration features are now active (Demo Mode).",
    });
  };

  const inviteCollaborator = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Invite collaborators feature will be available in a future release.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(timestamp).getTime()) / 1000
    );
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (!isEnabled) {
    return (
      <Card className="sfs-card">
        <CardHeader className="border-b border-gold-700/30">
          <CardTitle className="text-gold-300 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Real-Time Collaboration
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-700/20 flex items-center justify-center">
              <Users className="w-8 h-8 text-gold-500" />
            </div>
            <h3 className="text-lg font-semibold text-gold-100 mb-2">
              Collaborate in Real-Time
            </h3>
            <p className="text-gold-300/70 mb-6 max-w-md mx-auto">
              Enable collaboration to work together with your team on queries,
              dashboards, and reports. See who's online and what they're working on.
            </p>
            <Badge className="badge-gold mb-4">Preview Feature</Badge>
            <div className="mt-6">
              <Button onClick={enableCollaboration} className="btn-gold">
                <Share2 className="w-4 h-4 mr-2" />
                Enable Collaboration (Demo)
              </Button>
            </div>
            <div className="mt-8 text-left border-t border-gold-700/30 pt-6">
              <h4 className="font-semibold text-gold-100 mb-3">Features (Coming Soon):</h4>
              <ul className="space-y-2 text-sm text-gold-300/70">
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 mt-0.5 text-gold-500 fill-current" />
                  <span>See who's viewing and editing in real-time</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 mt-0.5 text-gold-500 fill-current" />
                  <span>Collaborative query editing with live cursors</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 mt-0.5 text-gold-500 fill-current" />
                  <span>Comments and annotations on queries and results</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 mt-0.5 text-gold-500 fill-current" />
                  <span>Activity feed for team actions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Circle className="w-4 h-4 mt-0.5 text-gold-500 fill-current" />
                  <span>Share dashboards with team members</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="sfs-card">
        <CardHeader className="border-b border-gold-700/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold-300 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Active Collaborators
              <Badge className="badge-gold ml-2">Demo Mode</Badge>
            </CardTitle>
            <Button onClick={inviteCollaborator} className="btn-gold" size="sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {collaborators.map((collaborator) => (
              <div
                key={collaborator.id}
                className="flex items-center justify-between p-3 border border-gold-700/30 rounded-lg bg-black-900/30"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="border-2" style={{ borderColor: collaborator.color }}>
                      <AvatarFallback
                        className="text-black-900 font-semibold"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black-900 ${getStatusColor(
                        collaborator.status
                      )}`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gold-100">{collaborator.name}</p>
                    <p className="text-xs text-gold-300/50">{collaborator.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {collaborator.currentView && (
                    <div className="flex items-center gap-1 text-xs text-gold-300/70">
                      {collaborator.isEditing ? (
                        <>
                          <Edit3 className="w-3 h-3" />
                          <span>Editing {collaborator.currentView}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Viewing {collaborator.currentView}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="sfs-card">
        <CardHeader className="border-b border-gold-700/30">
          <CardTitle className="text-gold-300 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 border-l-2 border-gold-700/30 pl-4"
              >
                <MessageSquare className="w-4 h-4 text-gold-500 mt-1" />
                <div className="flex-1">
                  <p className="text-sm text-gold-100">
                    <span className="font-medium">{activity.userName}</span>{" "}
                    <span className="text-gold-300/70">{activity.action}</span>
                  </p>
                  {activity.details && (
                    <p className="text-xs text-gold-300/50 mt-1">{activity.details}</p>
                  )}
                  <p className="text-xs text-gold-300/40 mt-1">
                    {getTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for collaboration features
export function useCollaboration() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [activeUsers, setActiveUsers] = useState<CollaboratorStatus[]>([]);

  useEffect(() => {
    const collaborationEnabled = localStorage.getItem("collaborationEnabled");
    if (collaborationEnabled === "true") {
      setIsEnabled(true);
    }
  }, []);

  const enableCollaboration = () => {
    setIsEnabled(true);
    localStorage.setItem("collaborationEnabled", "true");
  };

  const disableCollaboration = () => {
    setIsEnabled(false);
    localStorage.setItem("collaborationEnabled", "false");
  };

  return {
    isEnabled,
    activeUsers,
    enableCollaboration,
    disableCollaboration,
  };
}
