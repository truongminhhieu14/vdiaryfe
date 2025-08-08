"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProfileBanner from "@/components/Profile/ProfileBanner";
import ProfileAction from "@/components/Profile/ProfileAction";
import ProfileFeed from "@/components/Profile/ProfileFeed";
import ProfileTableOfContents from "@/components/Profile/ProfileTableOfContents";
import Sidebar from "@/components/Profile/Sidebar";
import RightSideBar from "@/components/Profile/RightSideBar";
import { IProfile } from "@/types/auth.type";
import authApi from "@/services/auth.service";
import friendApi from "@/services/friend.service";
import { useDispatch } from "react-redux";
import FriendSection from "@/components/Profile/FriendSection";


export default function FriendProfilePage() {
  const { userId } = useParams();
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [friendCount, setFriendCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [relationship, setRelationship] = useState<"me" | "friend" | "not_friend" | "requested" | "following">("not_friend");



  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await authApi.getProfileById(userId as string);
        setProfile(res.data.user);
        setRelationship(res.data.relationship);
      } catch (err: any) {
        setError("Không tìm thấy thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    const fetchFriendCount = async () => {
      try {
        const res = await friendApi.getAllFriendById(userId as string);
        setFriendCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFriendCount(0);
      }
    };

    const fetchFollowerCount = async () => {
      try {
        const res = await friendApi.getAllFollowerById(userId as string); 
        setFollowerCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFollowerCount(0);
      }
    };

    const fetchFollowingCount = async () => {
      try {
        const res = await friendApi.getAllFolowingById(userId as string);
        setFollowingCount(res.data.data.pagination.count || 0);
      } catch (e) {
        setFollowingCount(0);
      }
    };

    fetchProfile();
    fetchFriendCount();
    fetchFollowerCount();
    fetchFollowingCount();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>Không tìm thấy profile</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="max-w-4xl mx-auto bg-white flex-1 flex flex-col items-center px-4">
        <ProfileBanner profile={profile} />
        <ProfileAction
          profile={{
            followerCount: followerCount,
            friendCount: friendCount,
            followingCount: followingCount,
          }}
          relationship={relationship}
          userId={profile?._id}
        />
        <div className="flex w-full max-w-5xl gap-4">
          <div className="w-1/3">
            <ProfileTableOfContents />
          </div>
          <div className="flex-1">
            <ProfileFeed />
          </div>
        </div>
      </main>
      <RightSideBar />
    </div>
  );
}