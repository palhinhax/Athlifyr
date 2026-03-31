import React from "react";
import { ProfileGallery } from "./ProfileGallery";
import { FriendsSection } from "./FriendsSection";

interface OtherSectionsProps {
  friendsCount: number;
}

export function OtherSections({ friendsCount }: OtherSectionsProps) {
  return (
    <>
      {/* Gallery Section */}
      <ProfileGallery />

      {/* Friends Section */}
      <FriendsSection friendsCount={friendsCount} />
    </>
  );
}
