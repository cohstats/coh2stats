import React, { useEffect, useRef } from "react";
import { Typography } from "antd";
import { useData, useLoading } from "../../firebase";
import { Loading } from "../../components/loading";
import { Donation } from "../../components/donations";
const { Title, Link, Text, Paragraph } = Typography;

const useMountEffect = (fun: { (): void }) => useEffect(fun, []);

const About: React.FC = () => {
  const isLoading = useLoading("globalStats");
  const data: Record<string, any> = useData("globalStats");
  const donationsRef = useRef(null);
  const contributionRef = useRef(null);

  let analyzedMatches = <Loading />;
  let analyzedTopMatches = <Loading />;

  if (!isLoading) {
    analyzedMatches = data["analyzedMatches"];
    analyzedTopMatches = data["analyzedTopMatches"];
  }

  useMountEffect(() => {
    const hash = window.location.hash;
    console.log("scrolling", hash, donationsRef);
    if (hash == "#donations" && donationsRef) {
      // @ts-ignore
      donationsRef.current.scrollIntoView();
    } else if (hash == "#bugs" && donationsRef) {
      // @ts-ignore
      contributionRef.current.scrollIntoView();
    }
  }); // Scroll on mount

  return (
    <div style={{ textAlign: "center", maxWidth: 900, margin: "0 auto" }}>
      <Title level={2} style={{ paddingTop: 15 }} id={"crawler"}>
        Input Data and Crawler process
      </Title>
      <Paragraph>
        Relic doesn't provide insight or any easy way to get the match data. We are forced to
        crawl the leaderboards and get <Text strong>limited data</Text> from there.
      </Paragraph>
      <Paragraph>
        We are currently crawling top 200 positions from all kinds of COH2 leaderboards (1v1,2v2
        etc). This gives us 5200(~3000 unique) top players for the given day. We then proceed with
        analysing/saving their matches for the given day. This gives us ~4000 matches / day.
        <br />
        And we are tracking only auto-match games which are against players (filter out vs AI
        games).
      </Paragraph>
      More technical description of this process can be found{" "}
      <Link href="https://github.com/petrvecera/coh2ladders#crawler-process" target="_blank">
        here
      </Link>
      <br />
      <br />
      However based on{" "}
      <Link href="http://coh2chart.com/" target="_blank">
        this data
      </Link>{" "}
      from 2017 we expect that there is around ~50k matches/day. Which means{" "}
      <Text strong>we are processing around 8% of all games</Text>.
      <br />
      <br />
      The amount of data with some types of games is really a problem. You can see that winrate
      each day can really fluctuate by tens of % if the amount of games is under 1k for the given
      date.
      <br />
      <br />
      <b>So far analyzed {analyzedMatches} matches.</b>
      <a href={"#top200"}>
        <Title level={2} style={{ paddingTop: 15 }} id={"top200"}>
          Analysis for top 200 rank only
        </Title>
      </a>
      <Paragraph>
        Analysis which is limited to top 200 rank,{" "}
        <Text strong>only includes matches where all players in the match </Text>
        are ranked top 200 for the <Text strong>particular game mode</Text> (1v1, 2v2, 3v3, 4v4).
        They have to be at least rank 200 the day the match was played to be counted in.
      </Paragraph>
      <Paragraph>
        Teams of 2, 3, 4 are included in the modes 2v2, 3v3, 4v4 however as stated above only
        matches in the mode where players are ranked top 200 are counted. Example:{" "}
        <i>teamof2 is ranked top 200, plays 4v4 - their match is not counted! </i>
        As you can see there is significantly less games in 3v3, 4v4 mode than in 1v1 and 2v2.
        It's caused by the fact that it's way likely that all 6(8) players from that mode are
        highly ranked.
      </Paragraph>
      <Paragraph>
        This statics again isn't 100% correct. The faction for which the player is ranked top200
        does not play role. We could improve this in future by limiting only their faction.
        Example:{" "}
        <i>
          Player is ranked top 200 in 1v1 wehrmacht, plays 1v1 as soviet - his match could be
          counted in (in case the other player is top 200 1v1 too).
        </i>
      </Paragraph>
      <Paragraph>
        In future we might also change this statistics to be top % and not top 200 rank because
        each faction has different amount of players which might affect the calculations.
        <br />
        It's also questionable if this approach is the right one for team games. The amount of
        matches this produces is extremely low.
      </Paragraph>
      <Paragraph>
        <Title level={5}>Difference between top 200 and regular stats?</Title>
        The regular analysis takes matches from top 200 players as base input too. However the
        difference is that regular analysis does not care about the other players. In regular
        analysis you could have one team be top 200 and other team rank 2000. Or in 4v4, only 1
        player from the match could be top 200 and other players might be much lower skill.
      </Paragraph>
      <b>So far analyzed {analyzedTopMatches} matches.</b>
      <a href={"#future"}>
        <Title level={2} style={{ paddingTop: 15 }} id={"future"}>
          Future functionality
        </Title>
      </a>
      As you can see lot of features and functionality is not finished right now. Feel free to
      vote/discuss on the forums about the priority of each feature.
      <br />
      <Text strong>Match overview</Text>
      <br />
      We would like to add much better match overview. Relic stores much more data for each match
      that it's shown. We are able to get this data and we would like to display much better match
      overview which would include the map, player average rankings and more info.
      <br />
      Also the players would have possibility to request their matches to be stored (so not only
      the top 4%).
      <br />
      <br />
      <Text strong>Players overview</Text>
      <br />
      We would like to give better player overview. For example track their record how good they
      are playing on each map. Maybe add percentile to their rank because each mode has different
      amount of players and ranked positions.
      <br />
      <br />
      <Text strong>Other</Text>
      <br />
      There is huge amount of things we could improve everywhere. The stats charts possibilities
      are limitless. We definitely want to add analysis based on each map. To see if some maps are
      better for different factions. If you have any ideas feel free to suggest them.
      <a href={"#bugs"} ref={contributionRef}>
        <Title level={2} style={{ paddingTop: 15 }} id={"bugs"}>
          Bugs, ideas and contribution
        </Title>
      </a>
      This project is completely open source, head over to the{" "}
      <Link href="https://github.com/petrvecera/coh2ladders" target="_blank">
        GitHub Repo
      </Link>{" "}
      for more info. Any contributions are welcomed. However please read more info in the repo
      description if you have required skill set.
      <br />
      <br />
      You can report any bugs or feature requests on{" "}
      <Link href="https://github.com/petrvecera/coh2ladders/issues" target="_blank">
        GitHub issues
      </Link>
      .
      <br />
      <br />
      For any discussion, ideas or anything else. Head over to the coh2.org{" "}
      <Link
        href="https://www.coh2.org/topic/108057/coh2stats-com-match-and-player-statistics-2-0"
        target="_blank"
      >
        forums topic
      </Link>
      .
      <br />
      You can also use this site email or dm me{" "}
      <Link href="https://www.coh2.org/user/112252/pagep" target="_blank">
        at the forums.
      </Link>
      <div ref={donationsRef}>
        <a href={"#donations"}>
          <Title level={2} style={{ paddingTop: 15 }} id={"donations"}>
            Donations and support
          </Title>
        </a>
        We are able to support the basic hosting, domain and statistics/info functionality from
        our own pocket. This will rank up for tens of dollars per year. Plus we don't charge
        anything for our time.
        <br />
        <br />
        The original idea was to give unlimited match history for each player. Because this is
        something which Relic with their "Recent Matches" doesn't support (They track only last 10
        games for each mode for each player). However when we started working on this project, we
        greatly underestimated the amount of data which is produced every day.
        <br />
        We are tracking merely 120k matches and the DB holding this has up to 4GB already (as of
        writing this page). We are guessing COH2 to have ~50k matches/day.
        <br />
        We are still planning to deliver advanced match overview which would bring more
        functionality and better insight into your past games. But we will most likely not be able
        to hold more matches than relic already does because of the increased cost without some
        kind of income (donations/ads?).
        <br />
        <br />
        <br />
        If you would like to give financial support, you can do so. <br />
        100% of donations will go towards this project costs <br />
        In case you want to be mentioned on the site, write your nickname into the payment note.
        <br />
        <Donation />
        <br />
        <b>Past donations:</b>
        <br />
        gunther09
      </div>
    </div>
  );
};

export default About;
