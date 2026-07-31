"use client";

import { FollowSection } from "./FollowSection";
import { Hero } from "./Hero";
import { IconSet } from "./IconSet";
import { JourneyOverview } from "./JourneyOverview";
import { LevelCard } from "./LevelCard";
import { ProfileStats } from "./ProfileStats";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { useGdIcons } from "../hooks/useGdIcons";
import { useGdProfile } from "../hooks/useGdProfile";
import { useDemonlistRanks } from "../hooks/useDemonlistRanks";
import { usePageMotion } from "../hooks/usePageMotion";
import { LEVELS } from "../site-data";

export function FanSite() {
  const { profile, source } = useGdProfile();
  const { icons, renderStatus } = useGdIcons(profile);
  const { placements, status: demonlistStatus } = useDemonlistRanks();
  usePageMotion();

  return (
    <>
      <a className="skip-link" href="#main-content">Перейти к содержимому</a>
      <div className="page-progress" aria-hidden="true"><span /></div>
      <SiteHeader />

      <main id="main-content">
        <Hero cubeIcon={icons.cube} currentLevel={LEVELS[0]} />
        <JourneyOverview
          levels={LEVELS}
          placements={placements}
          demonlistStatus={demonlistStatus}
        />
        {LEVELS.map((level, index) => (
          <LevelCard
            level={level}
            index={index}
            total={LEVELS.length}
            placement={placements[level.levelId]}
            demonlistStatus={demonlistStatus}
            key={level.id}
          />
        ))}
        <ProfileStats
          profile={profile}
          source={source}
          iconStatus={renderStatus}
        />
        <IconSet icons={icons} />
        <FollowSection />
      </main>

      <SiteFooter />
    </>
  );
}
