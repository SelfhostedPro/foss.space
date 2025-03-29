import { createFileRoute } from "@tanstack/react-router";
import { useSession } from "@/hooks/use-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";

export const Route = createFileRoute('/_app/profile')({
  component: ProfilePage
});

function ProfilePage() {
  const { user, isLoading } = useSession();

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <Card>
            <CardContent className="p-8 flex justify-center items-center">
              <div className="text-muted-foreground">Loading profile...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8">
        <div className="container mx-auto">
          <Card>
            <CardContent className="p-8 flex justify-center items-center">
              <div className="text-muted-foreground">
                Please log in to view your profile.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col gap-8">
          {/* Header Card */}
          <Card>
            <CardHeader className="pb-0">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>
                    Manage your account settings and preferences
                  </CardDescription>
                </div>
                <Button size="sm">Edit Profile</Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-6 items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.image || ""} alt={user.name || "User"} />
                  <AvatarFallback className="text-2xl">
                    {(user.name?.charAt(0) || user.email?.charAt(0) || "U").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{user.name || "Anonymous User"}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">{user.role || "User"}</Badge>
                    {/* Add more badges as needed */}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-muted-foreground text-sm">Threads</div>
                  <div className="text-2xl font-semibold">0</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-muted-foreground text-sm">Posts</div>
                  <div className="text-2xl font-semibold">0</div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-muted-foreground text-sm">Joined</div>
                  <div className="text-2xl font-semibold">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Expandable Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {user.bio || "No bio provided yet."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 