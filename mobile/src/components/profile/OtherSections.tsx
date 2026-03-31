import React from "react";
import { ProfileGallery } from "./ProfileGallery";
import { FriendsSection } from "./FriendsSection";

interface OtherSectionsProps {
  followingCount: number;
  followersCount: number;
}

export function OtherSections({
  followingCount,
  followersCount,
}: OtherSectionsProps) {
  return (
    <>
      {/* Gallery Section */}
      <ProfileGallery />

      {/* Connections Section */}
      <FriendsSection
        followingCount={followingCount}
        followersCount={followersCount}
      />
    </>
  );
}
